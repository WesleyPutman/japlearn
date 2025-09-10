import prisma from "@/lib/prisma";

export async function getKanjiByCharacter(character) {
  try {
    const kanji = await prisma.kanji.findUnique({
      where: { character },
      include: {
        words: {
          include: {
            kanjis: true,
            kanas: true
          }
        }
      }
    });
    return kanji;
  } catch (error) {
    console.error("Error fetching kanji:", error);
    return null;
  }
}