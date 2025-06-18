/*
  Warnings:

  - You are about to drop the column `clickThroughRate` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `platformMetrics` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `platformPostIds` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `savedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `saves` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_userId_status_scheduledAt_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "clickThroughRate",
DROP COLUMN "errorMessage",
DROP COLUMN "platformMetrics",
DROP COLUMN "platformPostIds",
DROP COLUMN "savedAt",
DROP COLUMN "saves",
ALTER COLUMN "comments" DROP NOT NULL,
ALTER COLUMN "likes" DROP NOT NULL,
ALTER COLUMN "shares" DROP NOT NULL,
ALTER COLUMN "views" DROP NOT NULL,
ALTER COLUMN "engagementRate" DROP NOT NULL,
ALTER COLUMN "impressions" DROP NOT NULL,
ALTER COLUMN "reach" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_brandCollabId_idx" ON "Post"("brandCollabId");
