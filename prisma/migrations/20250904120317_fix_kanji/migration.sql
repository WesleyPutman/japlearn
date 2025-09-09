-- AlterTable
ALTER TABLE "public"."Word" ADD COLUMN     "frequency" INTEGER NOT NULL DEFAULT 999999,
ALTER COLUMN "searchVector" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Kanji" (
    "id" SERIAL NOT NULL,
    "character" TEXT NOT NULL,
    "meaningEn" TEXT[],
    "meaningFr" TEXT[],
    "onyomi" TEXT[],
    "kunyomi" TEXT[],
    "jlpt" INTEGER,
    "strokeCount" INTEGER,
    "grade" INTEGER,
    "heisigEn" TEXT,
    "unicode" TEXT,
    "radical" TEXT,
    "parts" TEXT[],
    "strokeOrder" TEXT,
    "nameReadings" TEXT[],
    "codes" JSONB,
    "frequency" INTEGER NOT NULL DEFAULT 999999,

    CONSTRAINT "Kanji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_KanjiWords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_KanjiWords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kanji_character_key" ON "public"."Kanji"("character");

-- CreateIndex
CREATE INDEX "_KanjiWords_B_index" ON "public"."_KanjiWords"("B");

-- AddForeignKey
ALTER TABLE "public"."_KanjiWords" ADD CONSTRAINT "_KanjiWords_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Kanji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_KanjiWords" ADD CONSTRAINT "_KanjiWords_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
