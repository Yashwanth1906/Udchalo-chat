/*
  Warnings:

  - You are about to drop the `Bookings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[flightNo]` on the table `Flight` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_flightId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_bookingId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bookingId" DROP NOT NULL;

-- DropTable
DROP TABLE "Bookings";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "flightId" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flightNo_key" ON "Flight"("flightNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
