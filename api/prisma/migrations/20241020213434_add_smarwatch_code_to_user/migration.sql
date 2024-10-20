-- AlterTable
ALTER TABLE "User" ADD COLUMN     "smartwatchCode" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_smartwatchCode_fkey" FOREIGN KEY ("smartwatchCode") REFERENCES "smartwatch"("code") ON DELETE CASCADE ON UPDATE CASCADE;
