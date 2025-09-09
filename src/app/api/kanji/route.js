import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const q = searchParams.get("q")?.trim() || ""

    const where = q
      ? {
          OR: [
            { character: { contains: q } },
            { meaningEn: { has: q } },
            { meaningFr: { has: q } },
          ],
        }
      : {}

    const [kanji, total] = await Promise.all([
      prisma.kanji.findMany({
        where,
        skip: (page - 1) * 20,
        take: 20,
        orderBy: [
          { frequency: 'asc' }, // Tri par fréquence
          { grade: 'asc' },     // Puis par niveau scolaire
          { character: 'asc' }  // Puis alphabétique
        ],
      }),
      prisma.kanji.count({ where }),
    ])

    return NextResponse.json({ kanji, total })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}