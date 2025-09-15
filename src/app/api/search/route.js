import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    
    if (q.length < 2) {
      return NextResponse.json({ results: { kanji: [], words: [] } });
    }

    // Détecter si la requête est en japonais
    const isJapanese = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/.test(q);

    const [kanji, words] = await Promise.all([
      // Recherche de kanji
      prisma.kanji.findMany({
        where: isJapanese 
          ? { character: { contains: q } }  // Recherche par caractère pour le japonais
          : { meaningEn: { has: q } },      // Recherche par signification pour l'anglais
        take: limit,
        orderBy: { frequency: 'asc' }
      }),
      
      // Recherche de mots
      prisma.word.findMany({
        where: isJapanese
          ? {
              OR: [
                { kanjis: { some: { text: { contains: q } } } },
                { kanas: { some: { text: { contains: q } } } }
              ]
            }
          : {
              senses: {
                some: {
                  glosses: {
                    some: { 
                      text: { contains: q },
                      lang: "eng"
                    }
                  }
                }
              }
            },
        take: limit,
        include: {
          kanjis: true,
          kanas: true,
          senses: {
            include: {
              glosses: {
                where: { lang: "eng" }
              }
            },
            take: 1
          }
        },
        orderBy: { common: 'desc' }
      })
    ]);

    return NextResponse.json({ 
      results: { 
        kanji, 
        words 
      }
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ results: { kanji: [], words: [] } });
  }
}