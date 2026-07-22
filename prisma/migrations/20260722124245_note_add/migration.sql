/*
  Warnings:

  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Note" DROP CONSTRAINT "Note_pkey";
CREATE SEQUENCE IF NOT EXISTS "Note_id_seq" OWNED BY "Note"."id";
ALTER TABLE "Note" ALTER COLUMN "id" SET DEFAULT nextval('"Note_id_seq"');
ALTER TABLE "Note" ALTER COLUMN "id" SET DATA TYPE INTEGER;
ALTER TABLE "Note" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Note" ADD CONSTRAINT "Note_pkey" PRIMARY KEY ("id");
SELECT setval('"Note_id_seq"', COALESCE((SELECT MAX("id") FROM "Note"), 1));
