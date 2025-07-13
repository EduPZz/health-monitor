-- CreateEnum
CREATE TYPE "CompanionRequestType" AS ENUM ('to_share', 'to_receive');

-- AlterTable
ALTER TABLE "CompanionRequest" ADD COLUMN     "type" "CompanionRequestType" NOT NULL DEFAULT 'to_share';
