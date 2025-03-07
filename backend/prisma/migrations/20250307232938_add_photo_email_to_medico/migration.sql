/*
  Warnings:

  - Added the required column `email` to the `Medico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medico" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL;
