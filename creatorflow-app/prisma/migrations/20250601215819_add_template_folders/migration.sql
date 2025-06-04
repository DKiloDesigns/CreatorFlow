-- AlterTable
ALTER TABLE "CaptionTemplate" ADD COLUMN     "folderId" TEXT;

-- AlterTable
ALTER TABLE "HashtagGroup" ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "TemplateFolder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateFolder_userId_idx" ON "TemplateFolder"("userId");

-- CreateIndex
CREATE INDEX "TemplateFolder_parentId_idx" ON "TemplateFolder"("parentId");

-- AddForeignKey
ALTER TABLE "CaptionTemplate" ADD CONSTRAINT "CaptionTemplate_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "TemplateFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashtagGroup" ADD CONSTRAINT "HashtagGroup_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "TemplateFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateFolder" ADD CONSTRAINT "TemplateFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateFolder" ADD CONSTRAINT "TemplateFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TemplateFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
