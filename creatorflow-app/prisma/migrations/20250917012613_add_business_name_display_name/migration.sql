-- CreateEnum
CREATE TYPE "public"."ErrorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ErrorType" AS ENUM ('CLIENT', 'SERVER', 'API', 'DATABASE', 'AUTH', 'VALIDATION', 'NETWORK', 'TIMEOUT');

-- AlterTable
ALTER TABLE "public"."SocialAccount" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "displayName" TEXT;

-- CreateTable
CREATE TABLE "public"."ErrorLog" (
    "id" TEXT NOT NULL,
    "type" "public"."ErrorType" NOT NULL,
    "severity" "public"."ErrorSeverity" NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "retryable" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "sessionId" TEXT,
    "requestId" TEXT,
    "endpoint" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoginAttempt" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastFailedAt" TIMESTAMP(3),
    "success" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecurityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecurityAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScheduledPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "platforms" TEXT[],
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "results" JSONB,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlatformIntegration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastSync" TIMESTAMP(3),
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomDashboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "widgets" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReportConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "format" TEXT NOT NULL DEFAULT 'pdf',
    "recipients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastGenerated" TIMESTAMP(3),
    "nextGeneration" TIMESTAMP(3),
    "template" TEXT,
    "filters" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReportData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReportTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ErrorLog_timestamp_idx" ON "public"."ErrorLog"("timestamp");

-- CreateIndex
CREATE INDEX "ErrorLog_type_idx" ON "public"."ErrorLog"("type");

-- CreateIndex
CREATE INDEX "ErrorLog_severity_idx" ON "public"."ErrorLog"("severity");

-- CreateIndex
CREATE INDEX "ErrorLog_resolved_idx" ON "public"."ErrorLog"("resolved");

-- CreateIndex
CREATE INDEX "LoginAttempt_identifier_idx" ON "public"."LoginAttempt"("identifier");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_idx" ON "public"."LoginAttempt"("ipAddress");

-- CreateIndex
CREATE INDEX "LoginAttempt_createdAt_idx" ON "public"."LoginAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_idx" ON "public"."SecurityEvent"("userId");

-- CreateIndex
CREATE INDEX "SecurityEvent_type_idx" ON "public"."SecurityEvent"("type");

-- CreateIndex
CREATE INDEX "SecurityEvent_severity_idx" ON "public"."SecurityEvent"("severity");

-- CreateIndex
CREATE INDEX "SecurityEvent_timestamp_idx" ON "public"."SecurityEvent"("timestamp");

-- CreateIndex
CREATE INDEX "SecurityAudit_userId_idx" ON "public"."SecurityAudit"("userId");

-- CreateIndex
CREATE INDEX "SecurityAudit_action_idx" ON "public"."SecurityAudit"("action");

-- CreateIndex
CREATE INDEX "SecurityAudit_success_idx" ON "public"."SecurityAudit"("success");

-- CreateIndex
CREATE INDEX "SecurityAudit_timestamp_idx" ON "public"."SecurityAudit"("timestamp");

-- CreateIndex
CREATE INDEX "ScheduledPost_userId_idx" ON "public"."ScheduledPost"("userId");

-- CreateIndex
CREATE INDEX "ScheduledPost_scheduledTime_idx" ON "public"."ScheduledPost"("scheduledTime");

-- CreateIndex
CREATE INDEX "ScheduledPost_status_idx" ON "public"."ScheduledPost"("status");

-- CreateIndex
CREATE INDEX "PlatformIntegration_userId_idx" ON "public"."PlatformIntegration"("userId");

-- CreateIndex
CREATE INDEX "PlatformIntegration_platform_idx" ON "public"."PlatformIntegration"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformIntegration_userId_platform_key" ON "public"."PlatformIntegration"("userId", "platform");

-- CreateIndex
CREATE INDEX "CustomDashboard_userId_idx" ON "public"."CustomDashboard"("userId");

-- CreateIndex
CREATE INDEX "ReportConfig_userId_idx" ON "public"."ReportConfig"("userId");

-- CreateIndex
CREATE INDEX "ReportConfig_isActive_idx" ON "public"."ReportConfig"("isActive");

-- CreateIndex
CREATE INDEX "ReportConfig_nextGeneration_idx" ON "public"."ReportConfig"("nextGeneration");

-- CreateIndex
CREATE INDEX "ReportData_userId_idx" ON "public"."ReportData"("userId");

-- CreateIndex
CREATE INDEX "ReportData_configId_idx" ON "public"."ReportData"("configId");

-- CreateIndex
CREATE INDEX "ReportData_generatedAt_idx" ON "public"."ReportData"("generatedAt");

-- CreateIndex
CREATE INDEX "ReportTemplate_userId_idx" ON "public"."ReportTemplate"("userId");

-- CreateIndex
CREATE INDEX "ReportTemplate_isPublic_idx" ON "public"."ReportTemplate"("isPublic");
