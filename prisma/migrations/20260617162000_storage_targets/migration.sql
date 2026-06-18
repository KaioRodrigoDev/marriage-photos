-- AlterTable
ALTER TABLE "PhotoGift" ADD COLUMN "storageTarget" TEXT NOT NULL DEFAULT 'oracle';

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- Seed active storage target.
INSERT INTO "AppSetting" ("key", "value", "updatedAt")
VALUES ('activeStorageTarget', 'oracle', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
