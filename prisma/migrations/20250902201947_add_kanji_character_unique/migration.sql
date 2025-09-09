/*
  Warnings:

  - A unique constraint covering the columns `[character]` on the table `Kanji` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Kanji_character_key" ON "public"."Kanji"("character");
