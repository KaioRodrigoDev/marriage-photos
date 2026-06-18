-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoGift" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoGift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoTag" (
    "id" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_name_key" ON "Person"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoTag_photoId_personId_key" ON "PhotoTag"("photoId", "personId");

-- AddForeignKey
ALTER TABLE "PhotoGift" ADD CONSTRAINT "PhotoGift_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoTag" ADD CONSTRAINT "PhotoTag_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "PhotoGift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoTag" ADD CONSTRAINT "PhotoTag_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
