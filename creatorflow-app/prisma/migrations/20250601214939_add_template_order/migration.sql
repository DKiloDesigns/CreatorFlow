-- AlterTable
ALTER TABLE "CaptionTemplate" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "HashtagGroup" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
