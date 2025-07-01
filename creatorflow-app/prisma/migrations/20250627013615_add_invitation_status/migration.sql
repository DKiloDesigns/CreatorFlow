-- CreateEnum
CREATE TYPE "TeamInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELED');

-- AlterTable
ALTER TABLE "TeamInvitation" ADD COLUMN     "respondedAt" TIMESTAMP(3),
ADD COLUMN     "status" "TeamInvitationStatus" NOT NULL DEFAULT 'PENDING';
