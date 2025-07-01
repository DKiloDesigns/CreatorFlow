/*
  Warnings:

  - You are about to drop the column `deactivated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN', 'SUPPORT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deactivated",
DROP COLUMN "isAdmin",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
