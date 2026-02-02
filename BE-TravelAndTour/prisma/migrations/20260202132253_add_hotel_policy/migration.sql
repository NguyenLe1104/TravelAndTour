-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "checkInTime" TEXT NOT NULL DEFAULT '14:00',
ADD COLUMN     "checkOutTime" TEXT NOT NULL DEFAULT '12:00',
ADD COLUMN     "policy" TEXT;
