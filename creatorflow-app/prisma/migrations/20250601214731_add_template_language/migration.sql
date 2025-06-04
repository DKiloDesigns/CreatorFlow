-- AlterTable
ALTER TABLE "CaptionTemplate" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "HashtagGroup" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';
