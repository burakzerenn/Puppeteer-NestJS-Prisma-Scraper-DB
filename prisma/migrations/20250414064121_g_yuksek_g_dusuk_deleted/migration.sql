/*
  Warnings:

  - You are about to drop the column `gDusuk` on the `StockDataExchanges` table. All the data in the column will be lost.
  - You are about to drop the column `gYuksek` on the `StockDataExchanges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `StockDataExchanges` DROP COLUMN `gDusuk`,
    DROP COLUMN `gYuksek`;
