/*
  Warnings:

  - Added the required column `photo` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "photo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "photo" TEXT NOT NULL;
