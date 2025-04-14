/*
  Warnings:

  - You are about to drop the column `portfoyDegeri` on the `StockDataFunds` table. All the data in the column will be lost.
  - You are about to drop the column `yatirimciSayisi` on the `StockDataFunds` table. All the data in the column will be lost.
  - You are about to drop the column `portfoyDegeri` on the `StockDataFundsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yatirimciSayisi` on the `StockDataFundsHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `StockDataFunds` DROP COLUMN `portfoyDegeri`,
    DROP COLUMN `yatirimciSayisi`;

-- AlterTable
ALTER TABLE `StockDataFundsHistory` DROP COLUMN `portfoyDegeri`,
    DROP COLUMN `yatirimciSayisi`;
