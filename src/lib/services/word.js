import prisma from "@/lib/prisma";

export async function getWordBySlug(slug) {
  let word = await prisma.word.findFirst({
    where: { kanjis: { some: { text: slug } } },
    include: { kanjis: true, kanas: true, senses: { include: { glosses: true } } }
  });

  if (!word && !isNaN(parseInt(slug))) {
    word = await prisma.word.findUnique({
      where: { id: parseInt(slug) },
      include: { kanjis: true, kanas: true, senses: { include: { glosses: true } } }
    });
  }

  return word;
}
