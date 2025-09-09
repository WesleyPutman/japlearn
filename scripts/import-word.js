import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();
const BATCH_SIZE = 200; // Ajustable selon ta machine

// Lecture du fichier top10k.csv et création d'un map de fréquences
function loadFrequencyMap() {
  try {
    console.log("📊 Chargement du top10k.csv...");
    const csvContent = readFileSync("./data/top10k.csv", "utf8");
    const records = parse(csvContent, {
      columns: false,
      skip_empty_lines: true,
    });
    
    const frequencyMap = new Map();
    records.forEach(record => {
      // Format: ,rank,frequency,word
      const rank = parseInt(record[1], 10);
      const word = record[3];
      if (word && !isNaN(rank)) {
        // Plus le rang est bas (1 étant le meilleur), plus la priorité est haute
        frequencyMap.set(word, rank);
      }
    });
    
    console.log(`✅ ${frequencyMap.size} mots chargés du top10k`);
    return frequencyMap;
  } catch (error) {
    console.error("❌ Erreur lors du chargement du top10k.csv:", error.message);
    return new Map();
  }
}

// Fonction améliorée pour déterminer la fréquence d'utilisation d'un mot
function determineFrequency(entry, frequencyMap) {
  // Base score - plus petit = plus prioritaire
  let score = 5000;
  
  // Si le mot est dans le top10k, on utilise son rang comme base
  const wordForms = [
    ...(entry.kanji || []).map(k => k.text),
    ...(entry.kana || []).map(k => k.text)
  ];
  
  // Cherche la meilleure position dans le top10k
  let bestRank = Infinity;
  for (const form of wordForms) {
    if (frequencyMap.has(form)) {
      const rank = frequencyMap.get(form);
      bestRank = Math.min(bestRank, rank);
    }
  }
  
  // Si trouvé dans le top10k, on utilise ce rang
  if (bestRank !== Infinity) {
    // Formule: plus le rang est bas, plus le score est bas
    score = Math.max(1, Math.min(1000, bestRank));
    return score; // On s'arrête ici car le ranking du top10k est plus précis
  }
  
  // Pour les mots qui ne sont pas dans le top10k
  // Bonus pour les mots marqués comme communs
  const kanjiCommon = (entry.kanji || []).filter(k => k.common).length;
  const kanaCommon = (entry.kana || []).filter(k => k.common).length;
  
  if (kanjiCommon > 0 || kanaCommon > 0) {
    // Réduction du score pour les mots communs
    score -= 1000;
    
    // Bonus supplémentaire si plusieurs formes sont communes
    score -= (kanjiCommon + kanaCommon - 1) * 100;
  }
  
  // Bonus pour les mots courts (souvent plus basiques)
  const shortestKana = entry.kana && entry.kana[0] ? entry.kana[0].text.length : 999;
  if (shortestKana <= 2) score -= 300;
  else if (shortestKana <= 3) score -= 200;
  
  // Bonus pour les verbes de base (to eat, to go...)
  const isBasicVerb = entry.sense && entry.sense.some(s => 
    s.partOfSpeech && 
    (s.partOfSpeech.includes('v1') || s.partOfSpeech.includes('v5')) && 
    s.gloss && s.gloss.some(g => g.text && g.text.startsWith('to '))
  );
  
  if (isBasicVerb) score -= 500;
  
  // Bonus pour mots très importants qui ne seraient pas dans le top10k
  const importantWords = ["食べる", "たべる", "行く", "いく", "来る", "くる", "する", "ある", "見る", "みる"];
  const hasImportantForm = wordForms.some(form => importantWords.includes(form));
  
  if (hasImportantForm) score -= 800;
  
  // Assure que le score est au minimum 1001 (pour être après le top10k)
  return Math.max(1001, score);
}

async function main() {
  console.log("📚 Import JMDict...");
  
  // Préchargement des kanji pour éviter les requêtes répétées
  console.log("🔄 Préchargement des kanji...");
  const allKanjis = await prisma.kanji.findMany({
    select: { id: true, character: true }
  });
  const kanjiMap = new Map(allKanjis.map(k => [k.character, k.id]));
  console.log(`✅ ${kanjiMap.size} kanji préchargés`);
  
  // Charge le map de fréquences
  const frequencyMap = loadFrequencyMap();
  
  const raw = readFileSync("./data/word.json", "utf8");
  const data = JSON.parse(raw);
  const entries = Array.isArray(data) ? data : data.words || [];
  const totalEntries = entries.length;

  let createdWords = 0;
  let updatedWords = 0;
  let skippedWords = 0;
  let errorWords = 0;

  // Traitement par lots plus grands
  const totalBatches = Math.ceil(totalEntries / BATCH_SIZE);

  for (let batch = 0; batch < totalBatches; batch++) {
    const start = batch * BATCH_SIZE;
    const end = Math.min((batch + 1) * BATCH_SIZE, totalEntries);
    const currentBatch = entries.slice(start, end);
    
    console.log(`🔄 Traitement du lot ${batch+1}/${totalBatches} (${start+1} à ${end} sur ${totalEntries})...`);

    // Traitement en série (plus fiable que parallèle pour les gros volumes)
    for (const entry of currentBatch) {
      try {
        // Calcul common et frequency
        const isCommon = !!(
          (entry.kanji && entry.kanji.some(k => k.common)) ||
          (entry.kana && entry.kana.some(k => k.common))
        );
        const frequency = determineFrequency(entry, frequencyMap);

        // Recherche du mot existant
        let word = await prisma.word.findUnique({
          where: { entryId: entry.id.toString() },
          include: {
            senses: { include: { glosses: true } }
          }
        });

        // Collecte des IDs de kanji à connecter (depuis le Map préchargé)
        const kanjiIdsToConnect = [];
        const kanjiTexts = (entry.kanji || []).map(k => k.text);
        for (const text of kanjiTexts) {
          const kanjiId = kanjiMap.get(text);
          if (kanjiId) kanjiIdsToConnect.push(kanjiId);
        }

        if (word) {
          // Mise à jour du mot existant
          word = await prisma.word.update({
            where: { id: word.id },
            data: { 
              common: isCommon,
              frequency: frequency
            },
          });

          // Connexion des kanji en une seule opération
          if (kanjiIdsToConnect.length > 0) {
            await prisma.word.update({
              where: { id: word.id },
              data: {
                kanjiChars: {
                  connect: kanjiIdsToConnect.map(id => ({ id }))
                }
              }
            });
          }
          
          updatedWords++;
        } else {
          // Création du mot avec liaison directe aux kanji
          word = await prisma.word.create({
            data: {
              entryId: entry.id.toString(),
              common: isCommon,
              frequency: frequency,
              kanjiChars: kanjiIdsToConnect.length > 0 ? {
                connect: kanjiIdsToConnect.map(id => ({ id }))
              } : undefined
            },
          });
          createdWords++;
        }

        // Insertion des WordKanji en batch
        const wordKanjiData = [];
        if (entry.kanji && entry.kanji.length > 0) {
          // Vérification des existants
          const existingKanjis = await prisma.wordKanji.findMany({
            where: { wordId: word.id },
            select: { text: true }
          });
          const existingTexts = new Set(existingKanjis.map(k => k.text));
          
          // Filtrage des nouveaux
          for (const k of entry.kanji) {
            if (!existingTexts.has(k.text)) {
              wordKanjiData.push({ text: k.text, wordId: word.id });
            }
          }
          
          // Insertion en batch
          if (wordKanjiData.length > 0) {
            await prisma.wordKanji.createMany({
              data: wordKanjiData,
              skipDuplicates: true
            });
          }
        }

        // Insertion des WordKana en batch
        const wordKanaData = [];
        if (entry.kana && entry.kana.length > 0) {
          // Vérification des existants
          const existingKanas = await prisma.wordKana.findMany({
            where: { wordId: word.id },
            select: { text: true }
          });
          const existingTexts = new Set(existingKanas.map(k => k.text));
          
          // Filtrage des nouveaux
          for (const k of entry.kana) {
            if (!existingTexts.has(k.text)) {
              wordKanaData.push({ text: k.text, wordId: word.id });
            }
          }
          
          // Insertion en batch
          if (wordKanaData.length > 0) {
            await prisma.wordKana.createMany({
              data: wordKanaData,
              skipDuplicates: true
            });
          }
        }

        // Supprimer les anciens sens et gloss
        if (word.senses && word.senses.length > 0) {
          const senseIds = word.senses.map(s => s.id);
          await prisma.gloss.deleteMany({ where: { senseId: { in: senseIds } } });
          await prisma.sense.deleteMany({ where: { id: { in: senseIds } } });
        }

        // Création des sens et gloss
        if (entry.sense && entry.sense.length > 0) {
          for (const s of entry.sense) {
            // Crée le sens
            const sense = await prisma.sense.create({
              data: { wordId: word.id }
            });
            
            // Préparation des gloss pour insertion en batch
            if (s.gloss && s.gloss.length > 0) {
              const glossData = s.gloss
                .filter(g => g && g.text)
                .map(g => ({
                  lang: g.lang || "eng",
                  text: g.text,
                  senseId: sense.id
                }));
              
              // Insertion en batch
              if (glossData.length > 0) {
                await prisma.gloss.createMany({ data: glossData });
              }
            }
          }
        }
      } catch (err) {
        console.error(`❌ Erreur import entry ${entry.id}:`, err.message || err);
        errorWords++;
      }
    }
    
    // Affiche la progression
    console.log(`   Progression: ${Math.min(end, totalEntries)}/${totalEntries} (${Math.floor(end/totalEntries*100)}%)`);
  }

  console.log(`✅ Import terminé !`);
  console.log(`📊 Statistiques:`);
  console.log(`   - Mots créés: ${createdWords}`);
  console.log(`   - Mots mis à jour: ${updatedWords}`);
  console.log(`   - Mots ignorés: ${skippedWords}`);
  console.log(`   - Erreurs: ${errorWords}`);
}

main()
  .catch(e => { 
    console.error("❌ Erreur fatale:", e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
    console.log("🔌 Déconnecté de la base de données");
  });