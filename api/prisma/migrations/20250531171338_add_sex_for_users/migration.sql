/*
  Warnings:

  - Added the required column `sex` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sex" "UserSex" NOT NULL;
