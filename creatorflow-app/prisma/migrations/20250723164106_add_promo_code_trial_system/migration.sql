-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_trial_user" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promo_code_used" TEXT,
ADD COLUMN     "promo_code_used_at" TIMESTAMP(3),
ADD COLUMN     "trial_end_date" TIMESTAMP(3),
ADD COLUMN     "trial_start_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'TRIAL',
    "value" INTEGER NOT NULL,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_code_idx" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_is_active_idx" ON "PromoCode"("is_active");

-- CreateIndex
CREATE INDEX "PromoCode_valid_from_idx" ON "PromoCode"("valid_from");

-- CreateIndex
CREATE INDEX "PromoCode_valid_until_idx" ON "PromoCode"("valid_until");
