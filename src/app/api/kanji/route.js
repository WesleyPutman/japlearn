import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/kanji
export async function GET() {
  try {
    const kanji = await prisma.kanji.findMany()
    return NextResponse.json(kanji)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/kanji
export async function POST(request) {
  try {
    const data = await request.json()
    const newKanji = await prisma.kanji.create({ data })
    return NextResponse.json(newKanji, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
