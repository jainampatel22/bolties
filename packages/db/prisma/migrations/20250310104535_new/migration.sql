/*
  Warnings:

  - The values [User] on the enum `PromptType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromptType_new" AS ENUM ('USER', 'SYSTEM');
ALTER TABLE "Prompt" ALTER COLUMN "type" TYPE "PromptType_new" USING ("type"::text::"PromptType_new");
ALTER TYPE "PromptType" RENAME TO "PromptType_old";
ALTER TYPE "PromptType_new" RENAME TO "PromptType";
DROP TYPE "PromptType_old";
COMMIT;
