/*
  Warnings:

  - You are about to drop the column `meaningEn` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `meaningFr` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `reading` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `word` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the `Kanji` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_KanjiWords` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entryId]` on the table `Word` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entryId` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `searchVector` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Made the column `common` on table `Word` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."_KanjiWords" DROP CONSTRAINT "_KanjiWords_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_KanjiWords" DROP CONSTRAINT "_KanjiWords_B_fkey";

-- DropIndex
DROP INDEX "public"."Word_word_key";

-- AlterTable
ALTER TABLE "public"."Word" DROP COLUMN "meaningEn",
DROP COLUMN "meaningFr",
DROP COLUMN "reading",
DROP COLUMN "word",
ADD COLUMN     "entryId" TEXT NOT NULL,
ADD COLUMN     "searchVector" tsvector NOT NULL,
ALTER COLUMN "common" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Kanji";

-- DropTable
DROP TABLE "public"."_KanjiWords";

-- CreateTable
CREATE TABLE "public"."WordKanji" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "WordKanji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WordKana" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "WordKana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sense" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "Sense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gloss" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "senseId" INTEGER NOT NULL,

    CONSTRAINT "Gloss_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_entryId_key" ON "public"."Word"("entryId");

-- AddForeignKey
ALTER TABLE "public"."WordKanji" ADD CONSTRAINT "WordKanji_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WordKana" ADD CONSTRAINT "WordKana_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sense" ADD CONSTRAINT "Sense_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gloss" ADD CONSTRAINT "Gloss_senseId_fkey" FOREIGN KEY ("senseId") REFERENCES "public"."Sense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
