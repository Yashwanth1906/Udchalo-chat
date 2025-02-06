-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_flightId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "flightId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("flightNo") ON DELETE RESTRICT ON UPDATE CASCADE;
