-- CreateEnum
CREATE TYPE "CompanionRequestStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "MeasurementTypes" AS ENUM ('scale', 'form');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "birthdate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCompanion" (
    "id" SERIAL NOT NULL,
    "accompaniedById" INTEGER NOT NULL,
    "accompanyingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCompanion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanionRequest" (
    "id" SERIAL NOT NULL,
    "status" "CompanionRequestStatus" NOT NULL DEFAULT 'pending',
    "message" TEXT NOT NULL,
    "inviterId" INTEGER NOT NULL,
    "invitedId" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "beginTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyMeasure" (
    "id" SERIAL NOT NULL,
    "chest" INTEGER NOT NULL,
    "arm" INTEGER NOT NULL,
    "waist" INTEGER NOT NULL,
    "thigh" INTEGER NOT NULL,
    "hip" INTEGER NOT NULL,
    "calf" INTEGER NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" SERIAL NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementEvents" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementSession" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER,
    "executerId" INTEGER NOT NULL,
    "measuredUserId" INTEGER NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "measurementType" "MeasurementTypes" NOT NULL DEFAULT 'scale',
    "bluetoothScaleId" INTEGER,

    CONSTRAINT "MeasurementSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BioimpedanceMeasurement" (
    "id" SERIAL NOT NULL,
    "measurementSessionId" INTEGER NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "bodyFatPercentage" DECIMAL(65,30) NOT NULL,
    "muscleMass" DECIMAL(65,30) NOT NULL,
    "boneMass" DECIMAL(65,30) NOT NULL,
    "waterPercentage" DECIMAL(65,30) NOT NULL,
    "visceralFat" INTEGER NOT NULL,
    "metabolicAge" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BioimpedanceMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BluetoothScales" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "macAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "supportsImpedance" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BluetoothScales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BioimpedanceMeasurement_measurementSessionId_key" ON "BioimpedanceMeasurement"("measurementSessionId");

-- AddForeignKey
ALTER TABLE "UserCompanion" ADD CONSTRAINT "UserCompanion_accompaniedById_fkey" FOREIGN KEY ("accompaniedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompanion" ADD CONSTRAINT "UserCompanion_accompanyingId_fkey" FOREIGN KEY ("accompanyingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionRequest" ADD CONSTRAINT "CompanionRequest_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionRequest" ADD CONSTRAINT "CompanionRequest_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyMeasure" ADD CONSTRAINT "BodyMeasure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementEvents" ADD CONSTRAINT "MeasurementEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementSession" ADD CONSTRAINT "MeasurementSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "MeasurementEvents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementSession" ADD CONSTRAINT "MeasurementSession_executerId_fkey" FOREIGN KEY ("executerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementSession" ADD CONSTRAINT "MeasurementSession_measuredUserId_fkey" FOREIGN KEY ("measuredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementSession" ADD CONSTRAINT "MeasurementSession_bluetoothScaleId_fkey" FOREIGN KEY ("bluetoothScaleId") REFERENCES "BluetoothScales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BioimpedanceMeasurement" ADD CONSTRAINT "BioimpedanceMeasurement_measurementSessionId_fkey" FOREIGN KEY ("measurementSessionId") REFERENCES "MeasurementSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BluetoothScales" ADD CONSTRAINT "BluetoothScales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
