-- AlterTable
ALTER TABLE "User" ADD COLUMN     "payment_retry_count" INTEGER DEFAULT 0,
ADD COLUMN     "payment_retry_date" TIMESTAMP(3);
