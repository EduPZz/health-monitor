-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_smartwatchCode_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_smartwatchCode_fkey" FOREIGN KEY ("smartwatchCode") REFERENCES "smartwatch"("code") ON DELETE SET NULL ON UPDATE CASCADE;
