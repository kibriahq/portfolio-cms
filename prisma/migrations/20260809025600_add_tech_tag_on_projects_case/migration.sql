-- AlterTable
ALTER TABLE "CaseStudy" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[];
