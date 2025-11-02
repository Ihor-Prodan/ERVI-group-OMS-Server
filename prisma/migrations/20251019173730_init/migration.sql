-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "psc" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pickupType" TEXT NOT NULL,
    "pickupDate" TIMESTAMP(3),
    "services" TEXT[],
    "gdpr" BOOLEAN NOT NULL,
    "deliveryNote" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "products" TEXT[],
    "weight" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "receiverStreet" TEXT NOT NULL,
    "receiverPsc" TEXT NOT NULL,
    "receiverCity" TEXT NOT NULL,
    "receiverCountry" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "receiverEmail" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
