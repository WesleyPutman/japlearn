import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const q = searchParams.get("q")?.trim() || ""
    const pageSize = 10; // Nombre d'éléments par page

    // Si aucune requête, retourner les mots les plus courants
    if (!q) {
      const [words, total] = await Promise.all([
        prisma.word.findMany({
          where: {
            common: true // Filtre uniquement les mots courants
          },
          include: {
            kanjis: true,
            kanas: true,
            senses: {
              include: {
                glosses: true
              }
            }
          },
          orderBy: [
            { frequency: 'asc' }  // Tri par fréquence (les plus courants d'abord)
          ],
          take: pageSize,
        }),
        prisma.word.count({
          where: {
            common: true
          }
        })
      ]);
      
      // Traiter les mots pour identifier les formes principales et alternatives
      const processedWords = words.map(processWordForms);
      
      return NextResponse.json({ 
        word: processedWords, 
        total,
        isDefaultResults: true 
      });
    }

    const searchLowerCase = q.toLowerCase();
    const skip = (page - 1) * pageSize;

    // Requête avec pagination directe dans la base de données
    const [words, total] = await Promise.all([
      prisma.word.findMany({
        where: {
          OR: [
            { kanjis: { some: { text: { startsWith: q } } } },
            { kanas: { some: { text: { startsWith: q } } } },
            { senses: { some: { glosses: { some: { text: { contains: q } } } } } }
          ]
        },
        include: {
          kanjis: true,
          kanas: true,
          senses: {
            include: {
              glosses: true
            }
          }
        },
        orderBy: [
          { frequency: 'asc' }  // Tri initial par fréquence
        ],
        skip,
        take: pageSize,
      }),
      prisma.word.count({
        where: {
          OR: [
            { kanjis: { some: { text: { startsWith: q } } } },
            { kanas: { some: { text: { startsWith: q } } } },
            { senses: { some: { glosses: { some: { text: { contains: q } } } } } }
          ]
        }
      })
    ]);

    // Traiter et calculer la priorité des mots
    const wordsWithPriority = words.map(word => {
      // Traitement des formes alternatives
      const processedWord = processWordForms(word);
      
      let matchPriority = 1000;  // Plus petit = plus prioritaire

      // Vérifie si la première définition contient la recherche
      const firstSense = processedWord.senses[0];
      if (firstSense) {
        const firstGlosses = firstSense.glosses
          .filter(g => g.lang === "eng")
          .map(g => g.text.toLowerCase());
        
        // Si la première définition commence par la recherche, priorité maximale
        if (firstGlosses.some(g => g.startsWith(searchLowerCase))) {
          matchPriority = 1;  // Priorité maximale
        } 
        // Si la première définition contient la recherche, priorité élevée
        else if (firstGlosses.some(g => g.includes(searchLowerCase))) {
          matchPriority = 5;  // Priorité élevée
        }
      }

      // Vérifie si le texte kanji ou kana correspond exactement à la recherche
      if (processedWord.kanjis.some(k => k.text === q) || processedWord.kanas.some(k => k.text === q)) {
        matchPriority = 0;  // Priorité absolue pour correspondance exacte
      }

      return {
        ...processedWord,
        matchPriority
      };
    });

    // Tri final: d'abord par priorité de correspondance, puis par fréquence
    const sortedWords = wordsWithPriority.sort((a, b) => {
      if (a.matchPriority !== b.matchPriority) {
        return a.matchPriority - b.matchPriority;
      }
      return a.frequency - b.frequency;
    });
    
    return NextResponse.json({ 
      word: sortedWords,
      total,
      isSearchResults: true
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Fonction pour traiter les formes principales et alternatives d'un mot
function processWordForms(word) {
  if (!word) return word;
  
  // Identifier le kanji principal et les alternatifs
  let mainKanji = null;
  let altKanjis = [];
  
  // Si un seul kanji, c'est le principal
  if (word.kanjis.length === 1) {
    mainKanji = word.kanjis[0];
  }
  // Si plusieurs kanji, on identifie le principal selon des règles
  else if (word.kanjis.length > 1) {
    // Critères de sélection pour la forme principale:
    // 1. Préférer les kanjis sans info spéciale
    // 2. Sinon préférer le premier dans l'ordre de tri
    // 3. Priorité à celui avec la fréquence la plus basse (si disponible)
    
    // Filtrer les kanjis sans info (les candidats principaux)
    const candidatesWithoutInfo = word.kanjis.filter(k => !k.info);
    
    if (candidatesWithoutInfo.length > 0) {
      // Parmi ceux sans info, préférer celui qui a le moins de traits
      // (généralement les formes standard sont plus simples)
      mainKanji = candidatesWithoutInfo[0];
      
      // Le reste va dans les alternatifs
      altKanjis = word.kanjis.filter(k => k !== mainKanji);
    } else {
      // Si tous ont des infos, prendre celui avec le moins d'info (probablement moins rare)
      mainKanji = word.kanjis.reduce((shortest, current) => {
        if (!shortest) return current;
        if (!current.info) return current;
        if (current.info.length < shortest.info.length) return current;
        return shortest;
      }, null);
      
      // Le reste va dans les alternatifs
      altKanjis = word.kanjis.filter(k => k !== mainKanji);
    }
  }
  
  // Pour les kanas, stratégie similaire
  let mainKana = null;
  let altKanas = [];
  
  if (word.kanas.length === 1) {
    mainKana = word.kanas[0];
  } else if (word.kanas.length > 1) {
    // Prendre le kana sans info spéciale s'il existe
    const standardKanas = word.kanas.filter(k => !k.info);
    if (standardKanas.length > 0) {
      mainKana = standardKanas[0];
      altKanas = word.kanas.filter(k => k !== mainKana);
    } else {
      mainKana = word.kanas[0];
      altKanas = word.kanas.slice(1);
    }
  }
  
  // Pour que ce soit clair dans le frontend
  return {
    ...word,
    mainKanjiText: mainKanji?.text || '',
    mainKanaText: mainKana?.text || '',
    mainKanji,
    mainKana,
    altKanjis,
    altKanas,
    hasAlternatives: altKanjis.length > 0 || altKanas.length > 0
  };
}