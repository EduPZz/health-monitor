-- CreateTable
CREATE TABLE "smartwatch" (
    "code" TEXT NOT NULL,
    "bloodGlucose" INTEGER NOT NULL,
    "heartbeat" INTEGER NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,

    CONSTRAINT "smartwatch_pkey" PRIMARY KEY ("code")
);
