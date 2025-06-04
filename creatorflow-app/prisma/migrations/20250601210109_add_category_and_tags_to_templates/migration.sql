-- AlterTable
ALTER TABLE "CaptionTemplate" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "HashtagGroup" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
