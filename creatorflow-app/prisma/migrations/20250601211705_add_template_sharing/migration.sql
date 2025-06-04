-- CreateTable
CREATE TABLE "TemplateShare" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "captionTemplateId" TEXT,
    "hashtagGroupId" TEXT,
    "userId" TEXT NOT NULL,
    "sharedWithUserId" TEXT,
    "sharedWithEmail" TEXT NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateShare_captionTemplateId_idx" ON "TemplateShare"("captionTemplateId");

-- CreateIndex
CREATE INDEX "TemplateShare_hashtagGroupId_idx" ON "TemplateShare"("hashtagGroupId");

-- CreateIndex
CREATE INDEX "TemplateShare_sharedWithEmail_idx" ON "TemplateShare"("sharedWithEmail");

-- AddForeignKey
ALTER TABLE "TemplateShare" ADD CONSTRAINT "TemplateShare_captionTemplateId_fkey" FOREIGN KEY ("captionTemplateId") REFERENCES "CaptionTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateShare" ADD CONSTRAINT "TemplateShare_hashtagGroupId_fkey" FOREIGN KEY ("hashtagGroupId") REFERENCES "HashtagGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
