/*
  Warnings:

  - The values [BLOG] on the enum `PageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PageType_new" AS ENUM ('HOME', 'ABOUT', 'SKILLS', 'SERVICES', 'CONTACT', 'TESTIMONIALS', 'BLOGS', 'PROJECTS', 'CASE_STUDIES', 'PRIVACY_POLICY', 'TERMS_OF_SERVICE');
ALTER TABLE "View" ALTER COLUMN "pageType" TYPE "PageType_new" USING ("pageType"::text::"PageType_new");
ALTER TYPE "PageType" RENAME TO "PageType_old";
ALTER TYPE "PageType_new" RENAME TO "PageType";
DROP TYPE "public"."PageType_old";
COMMIT;
