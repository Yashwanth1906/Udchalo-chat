-- CreateEnum
CREATE TYPE "messageType" AS ENUM ('message', 'announcement');

-- CreateTable
CREATE TABLE "FlightRooms" (
    "id" SERIAL NOT NULL,
    "flightId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,

    CONSTRAINT "FlightRooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "type" "messageType" NOT NULL,
    "flightRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlightRooms" ADD CONSTRAINT "FlightRooms_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("flightNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_flightRoomId_fkey" FOREIGN KEY ("flightRoomId") REFERENCES "FlightRooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
