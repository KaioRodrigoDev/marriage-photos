-- CreateTable
CREATE TABLE "PixGeneration" (
    "id" TEXT NOT NULL,
    "senderName" TEXT,
    "amount" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PixGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PixGeneration_transactionId_key" ON "PixGeneration"("transactionId");
