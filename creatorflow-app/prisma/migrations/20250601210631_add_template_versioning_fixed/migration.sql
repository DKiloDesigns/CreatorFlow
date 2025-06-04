-- CreateTable
CREATE TABLE "TemplateVersion" (
    "id" TEXT NOT NULL,
    "captionTemplateId" TEXT,
    "hashtagGroupId" TEXT,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "hashtags" TEXT[],
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateVersion" ADD CONSTRAINT "TemplateVersion_captionTemplateId_fkey" FOREIGN KEY ("captionTemplateId") REFERENCES "CaptionTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVersion" ADD CONSTRAINT "TemplateVersion_hashtagGroupId_fkey" FOREIGN KEY ("hashtagGroupId") REFERENCES "HashtagGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
