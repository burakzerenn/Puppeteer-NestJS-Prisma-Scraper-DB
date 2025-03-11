-- CreateTable
CREATE TABLE `StockData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sembol` VARCHAR(191) NOT NULL,
    `son` VARCHAR(191) NOT NULL,
    `farkYuzde` VARCHAR(191) NOT NULL,
    `fark` VARCHAR(191) NOT NULL,
    `alis` VARCHAR(191) NOT NULL,
    `satis` VARCHAR(191) NOT NULL,
    `gYuksek` VARCHAR(191) NOT NULL,
    `gDusuk` VARCHAR(191) NOT NULL,
    `aOrt` VARCHAR(191) NOT NULL,
    `adet` VARCHAR(191) NOT NULL,
    `hacim` VARCHAR(191) NOT NULL,
    `süre` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
