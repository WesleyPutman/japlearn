#!/usr/bin/env node
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction utilitaire pour déterminer la fréquence d'un kanji (plus petit = plus fréquent)
function determineKanjiFrequency(kanji) {
  // Base score - plus petit = plus prioritaire
  let score = 2000;
  
  // Les kanji JLPT sont plus importants
  if (kanji.jlpt) {
    // N5 (le plus basique) = 100, N4 = 200, etc.
    score = kanji.jlpt * 100;
  }
  
  // Bonus pour les kanji de grade scolaire bas (plus basiques, plus utilisés)
  if (kanji.grade) {
    // Grade 1 = très commun, grade 8+ = moins commun
    if (kanji.grade <= 2) score -= 50;
    else if (kanji.grade <= 4) score -= 30;
    else if (kanji.grade <= 6) score -= 10;
  }
  
  // Kanji avec peu de traits sont souvent plus basiques
  if (kanji.stroke_count) {
    if (kanji.stroke_count <= 3) score -= 30;
    else if (kanji.stroke_count <= 6) score -= 20;
    else if (kanji.stroke_count <= 9) score -= 10;
  }
  
  // Liste de kanji très communs qui devraient être prioritaires
  const veryCommonKanji = "日一人年大十二本中出三見月生五上力十入子目長時行分後名";
  if (veryCommonKanji.includes(kanji.kanji)) {
    score -= 80;
  }
  
  return Math.max(1, score);
}

async function main() {
  console.log("📚 Import des kanji...");
  
  try {
    const raw = JSON.parse(fs.readFileSync("./data/kanji.json", "utf8"));
    const kanjis = Object.values(raw.kanjis);
    const totalKanjis = kanjis.length;

    console.log(`🔄 ${totalKanjis} kanji à importer...`);
    
    let createdKanjis = 0;
    let updatedKanjis = 0;
    let errorKanjis = 0;

    // Traitement par lots pour afficher la progression
    const batchSize = 500;
    const totalBatches = Math.ceil(totalKanjis / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const start = batch * batchSize;
      const end = Math.min((batch + 1) * batchSize, totalKanjis);
      const currentBatch = kanjis.slice(start, end);
      
      console.log(`🔄 Traitement du lot ${batch+1}/${totalBatches} (${start+1} à ${end} sur ${totalKanjis})...`);

      for (const k of currentBatch) {
        try {
          // Calcul de la fréquence du kanji
          const frequency = determineKanjiFrequency(k);
          
          // On recherche d'abord le kanji
          const existingKanji = await prisma.kanji.findUnique({
            where: { character: k.kanji },
          });

          if (existingKanji) {
            // Mise à jour du kanji existant
            await prisma.kanji.update({
              where: { id: existingKanji.id },
              data: {
                meaningEn: k.meanings || [],
                meaningFr: [], // À remplir si tu as des traductions françaises
                onyomi: k.on_readings || [],
                kunyomi: k.kun_readings || [],
                nameReadings: k.name_readings || [],
                unicode: k.unicode || null,
                jlpt: k.jlpt || null,
                grade: k.grade || null,
                strokeCount: k.stroke_count || null,
                frequency: frequency,
              },
            });
            updatedKanjis++;
          } else {
            // Création d'un nouveau kanji
            await prisma.kanji.create({
              data: {
                character: k.kanji,
                meaningEn: k.meanings || [],
                meaningFr: [], // À remplir si tu as des traductions françaises
                onyomi: k.on_readings || [],
                kunyomi: k.kun_readings || [],
                nameReadings: k.name_readings || [],
                unicode: k.unicode || null,
                jlpt: k.jlpt || null,
                grade: k.grade || null,
                strokeCount: k.stroke_count || null,
                frequency: frequency,
              },
            });
            createdKanjis++;
          }
          
        } catch (err) {
          console.error(`❌ Erreur import kanji ${k.kanji}:`, err.message);
          errorKanjis++;
        }
      }
    }

    console.log(`✅ Import terminé !`);
    console.log(`📊 Statistiques:`);
    console.log(`   - Kanjis créés: ${createdKanjis}`);
    console.log(`   - Kanjis mis à jour: ${updatedKanjis}`);
    console.log(`   - Erreurs: ${errorKanjis}`);
  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Déconnecté de la base de données");
  }
}

main().catch(async (e) => {
  console.error("❌ Erreur non gérée:", e);
  await prisma.$disconnect();
  process.exit(1);
});