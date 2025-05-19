/*
  Warnings:

  - The `status` column on the `BluetoothScales` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BluetoothScalesStatus" AS ENUM ('connected', 'disconnected');

-- AlterTable
ALTER TABLE "BluetoothScales" DROP COLUMN "status",
ADD COLUMN     "status" "BluetoothScalesStatus" NOT NULL DEFAULT 'disconnected';
