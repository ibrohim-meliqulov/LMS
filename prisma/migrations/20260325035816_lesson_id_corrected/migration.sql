/*
  Warnings:

  - The `lessonId` column on the `LastActivity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `LessonView` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `lessonId` on the `Homework` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lessonId` on the `LessonFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lessonId` on the `LessonView` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Homework" DROP CONSTRAINT "Homework_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LastActivity" DROP CONSTRAINT "LastActivity_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonFile" DROP CONSTRAINT "LessonFile_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonView" DROP CONSTRAINT "LessonView_lessonId_fkey";

-- AlterTable
ALTER TABLE "Homework" DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LastActivity" DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER;

-- AlterTable
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LessonFile" DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LessonView" DROP CONSTRAINT "LessonView_pkey",
DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER NOT NULL,
ADD CONSTRAINT "LessonView_pkey" PRIMARY KEY ("lessonId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_lessonId_key" ON "Homework"("lessonId");

-- AddForeignKey
ALTER TABLE "LastActivity" ADD CONSTRAINT "LastActivity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonView" ADD CONSTRAINT "LessonView_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonFile" ADD CONSTRAINT "LessonFile_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
