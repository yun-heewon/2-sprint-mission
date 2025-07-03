/*
  Warnings:

  - You are about to drop the column `documentId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_documentId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "documentId",
ADD COLUMN     "image" TEXT;
