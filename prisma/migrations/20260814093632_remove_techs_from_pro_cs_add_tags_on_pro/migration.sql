/*
  Warnings:

  - You are about to drop the column `technologies` on the `CaseStudy` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaseStudy" DROP COLUMN "technologies";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "technologies",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
