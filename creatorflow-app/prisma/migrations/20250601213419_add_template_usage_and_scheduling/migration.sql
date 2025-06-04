-- AlterTable
ALTER TABLE "CaptionTemplate" ADD COLUMN     "activeFrom" TIMESTAMP(3),
ADD COLUMN     "activeTo" TIMESTAMP(3),
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageLimit" INTEGER;

-- AlterTable
ALTER TABLE "HashtagGroup" ADD COLUMN     "activeFrom" TIMESTAMP(3),
ADD COLUMN     "activeTo" TIMESTAMP(3),
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageLimit" INTEGER;

-- CreateTable
CREATE TABLE "TemplateUsage" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "captionTemplateId" TEXT,
    "hashtagGroupId" TEXT,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateUsage_captionTemplateId_idx" ON "TemplateUsage"("captionTemplateId");

-- CreateIndex
CREATE INDEX "TemplateUsage_hashtagGroupId_idx" ON "TemplateUsage"("hashtagGroupId");

-- CreateIndex
CREATE INDEX "TemplateUsage_userId_idx" ON "TemplateUsage"("userId");

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_captionTemplateId_fkey" FOREIGN KEY ("captionTemplateId") REFERENCES "CaptionTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_hashtagGroupId_fkey" FOREIGN KEY ("hashtagGroupId") REFERENCES "HashtagGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
