-- CreateTable
CREATE TABLE "TemplateSnippet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateSnippet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateSnippet_userId_idx" ON "TemplateSnippet"("userId");

-- AddForeignKey
ALTER TABLE "TemplateSnippet" ADD CONSTRAINT "TemplateSnippet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
