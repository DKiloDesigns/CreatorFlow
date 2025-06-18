-- AlterTable
ALTER TABLE "TemplateFolder" ADD COLUMN     "sharedWithEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "_FolderShares" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FolderShares_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FolderShares_B_index" ON "_FolderShares"("B");

-- AddForeignKey
ALTER TABLE "_FolderShares" ADD CONSTRAINT "_FolderShares_A_fkey" FOREIGN KEY ("A") REFERENCES "TemplateFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderShares" ADD CONSTRAINT "_FolderShares_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
