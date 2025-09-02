-- CreateTable
CREATE TABLE "public"."Kanji" (
    "id" SERIAL NOT NULL,
    "character" TEXT NOT NULL,
    "meaningFr" TEXT[],
    "meaningEn" TEXT[],
    "onyomi" TEXT[],
    "kunyomi" TEXT[],
    "jlpt" INTEGER,
    "strokeCount" INTEGER,
    "grade" INTEGER,
    "heisigEn" TEXT,
    "unicode" TEXT,
    "radical" TEXT,
    "parts" TEXT[],
    "strokeOrder" TEXT[],
    "nameReadings" TEXT[],
    "codes" TEXT[],

    CONSTRAINT "Kanji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Word" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "meaningEn" TEXT[],
    "meaningFr" TEXT[],

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_KanjiWords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_KanjiWords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_KanjiWords_B_index" ON "public"."_KanjiWords"("B");

-- AddForeignKey
ALTER TABLE "public"."_KanjiWords" ADD CONSTRAINT "_KanjiWords_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Kanji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_KanjiWords" ADD CONSTRAINT "_KanjiWords_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
