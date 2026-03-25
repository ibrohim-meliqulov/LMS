/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_courseId_key" ON "Rating"("userId", "courseId");
