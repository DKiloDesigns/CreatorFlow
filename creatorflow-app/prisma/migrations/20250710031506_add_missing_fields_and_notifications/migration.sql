/*
  Warnings:

  - You are about to drop the column `notifications` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isRepost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "mentions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "parentPostId" TEXT,
ADD COLUMN     "repostCount" INTEGER,
ADD COLUMN     "repostInterval" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "notifications";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "channels" TEXT[],
    "priority" TEXT NOT NULL,
    "metadata" JSONB,
    "actionUrl" TEXT,
    "actionText" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Post_parentPostId_idx" ON "Post"("parentPostId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
