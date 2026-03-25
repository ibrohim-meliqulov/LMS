/*
  Warnings:

  - The primary key for the `PurchasedCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PurchasedCourse" DROP CONSTRAINT "PurchasedCourse_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PurchasedCourse_pkey" PRIMARY KEY ("id");
