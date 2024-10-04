/*
  Warnings:

  - You are about to drop the column `experienceDescription` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "experienceDescription",
ADD COLUMN     "description" TEXT;
