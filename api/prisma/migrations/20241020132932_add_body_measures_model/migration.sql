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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BodyMeasure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BodyMeasure" ADD CONSTRAINT "BodyMeasure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
