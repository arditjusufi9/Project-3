/*
  Warnings:

  - You are about to drop the column `imagePath` on the `product` table. All the data in the column will be lost.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `imagePath`,
    ADD COLUMN `image` LONGBLOB NOT NULL;
