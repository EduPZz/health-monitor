-- CreateTable
CREATE TABLE "consultation" (
    "id" SERIAL NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "doctorName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "consultation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
