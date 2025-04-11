import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockDataExchanges, StockDataFunds } from 'src/types/stockData';

@Injectable()
export class ScraperService {
  constructor(private readonly prisma: PrismaService) { }

  @Cron('0 19 * * *', { timeZone: 'Europe/Istanbul' })
  async scrapeForeksExchanges(): Promise<any> {
    console.log('Scraping foreks.com...');

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 0,
        protocolTimeout: 1200000
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto('https://www.foreks.com/borsa/', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      await page.waitForSelector('.select', { timeout: 60000 });
      await page.select('.select', 'ALL');

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await page.waitForSelector('#definitionsTable', { timeout: 60000 });
      console.log('Table loaded successfully.');

      let data: StockDataExchanges[] = [];
      let pageCounter = 1;

      while (true) {
        console.log(`Scraping page ${pageCounter}...`);

        const currentPageData = await page.evaluate(() => {
          const rows = document.querySelectorAll('#definitionsTable tr');

          return Array.from(rows).map((row) => {
            const cells: StockDataExchanges = {
              sembol:
                row
                  .querySelector('td:nth-child(1)')
                  ?.textContent?.replace(/\s+/g, ' ')
                  .trim()
                  .replace(' ', ' - ') || '',
              son:
                row.querySelector('td:nth-child(2)')?.textContent?.trim() || '',
              farkYuzde:
                row.querySelector('td:nth-child(3)')?.textContent?.trim() || '',
              fark:
                row.querySelector('td:nth-child(4)')?.textContent?.trim() || '',
              alis:
                row.querySelector('td:nth-child(5)')?.textContent?.trim() || '',
              satis:
                row.querySelector('td:nth-child(6)')?.textContent?.trim() || '',
              gYuksek:
                row.querySelector('td:nth-child(7)')?.textContent?.trim() || '',
              gDusuk:
                row.querySelector('td:nth-child(8)')?.textContent?.trim() || '',
              aOrt:
                row.querySelector('td:nth-child(9)')?.textContent?.trim() || '',
              adet:
                row.querySelector('td:nth-child(10)')?.textContent?.trim() ||
                '',
              hacim:
                row.querySelector('td:nth-child(11)')?.textContent?.trim() ||
                '',
              sure:
                row.querySelector('td:nth-child(12)')?.textContent?.trim() ||
                '',
            };
            return cells;
          });
        });

        data.push(...currentPageData);
        console.log(
          `Page ${pageCounter} data extracted. Total records: ${data.length}`,
        );

        const nextButton = await page.$(
          'button.page-link[aria-label="Go to next page"]',
        );

        if (nextButton) {
          const isDisabled = await page.evaluate(
            (button) => button.hasAttribute('disabled'),
            nextButton,
          );

          if (!isDisabled) {
            console.log(`Clicking next page (${pageCounter + 1})...`);

            await page.evaluate((button) => button.click(), nextButton);

            await page.waitForSelector('#definitionsTable tr', {
              timeout: 30000,
            });

            await page.waitForResponse(
              (response) =>
                response.url().includes('foreks.com') &&
                response.status() === 200,
              { timeout: 30000 },
            );

            pageCounter++;
          } else {
            console.log('No more pages to scrape.');
            break;
          }
        } else {
          console.log('Next button not found.');
          break;
        }
      }

      await browser.close();

      const savedData = await Promise.all(
        data.map(async (stock) => {
          const existingStock = await this.prisma.stockDataExchanges.findFirst({
            where: { sembol: stock.sembol },
          });

          if (existingStock) {
            return this.prisma.stockDataExchanges.update({
              where: { id: existingStock.id },
              data: {
                son: stock.son,
                farkYuzde: stock.farkYuzde,
                fark: stock.fark,
                alis: stock.alis,
                satis: stock.satis,
                gYuksek: stock.gYuksek,
                gDusuk: stock.gDusuk,
                aOrt: stock.aOrt,
                adet: stock.adet,
                hacim: stock.hacim,
                sure: stock.sure,
                updatedAt: new Date(),
              },
            });
          } else {
            return this.prisma.stockDataExchanges.create({
              data: stock,
            });
          }
        }),
      );

      await this.prisma.stockDataExchangesHistory.createMany({
        data: data,
      });

      console.log('Scraping finished. Total records:', data.length);
      return data;
    } catch (error) {
      console.log('Error scraping Foreks.com:', error);
      throw new Error('Error scraping Foreks.com');
    }
  }

  @Cron('0 22 * * *', { timeZone: 'Europe/Istanbul' })
  async scrapeForeksFunds(): Promise<any> {
    console.log('Scraping foreks.com...');

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 0,
        protocolTimeout: 1200000
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto('https://www.foreks.com/borsa/tefas-fonlari/', {
        waitUntil: 'domcontentloaded',
        timeout: 120000,
      });

      //Below if needed for all tefas funds

      /*await page.waitForSelector('.select', { timeout: 60000 });
      await page.select('.select', 'ALL');
      */

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await page.waitForSelector('#definitionsTable', { timeout: 60000 });
      console.log('Table loaded successfully.');

      let data: StockDataFunds[] = [];
      let pageCounter = 1;

      while (true) {
        console.log(`Scraping page ${pageCounter}...`);

        const currentPageData = await page.evaluate(() => {
          const rows = document.querySelectorAll('#definitionsTable tr');

          return Array.from(rows).map((row) => {
            const cells: StockDataFunds = {
              sembol:
                row
                  .querySelector('td:nth-child(1)')
                  ?.textContent?.replace(/\s+/g, ' ')
                  .trim()
                  .replace(' ', ' - ') || '',
              son:
                row.querySelector('td:nth-child(2)')?.textContent?.trim() || '',
              farkYuzde:
                row.querySelector('td:nth-child(3)')?.textContent?.trim() || '',
              haftaBasiYuzde:
                row.querySelector('td:nth-child(4)')?.textContent?.trim() || '',
              ayBasiYuzde:
                row.querySelector('td:nth-child(5)')?.textContent?.trim() || '',
              yilBasiYuzde:
                row.querySelector('td:nth-child(6)')?.textContent?.trim() || '',
              tedAdet:
                row.querySelector('td:nth-child(7)')?.textContent?.trim() || '',
              yatirimciSayisi:
                row.querySelector('td:nth-child(8)')?.textContent?.trim() || '',
              toplamDeger:
                row.querySelector('td:nth-child(9)')?.textContent?.trim() || '',
              portfoyDegeri:
                row.querySelector('td:nth-child(10)')?.textContent?.trim() ||
                '',
              sure:
                row.querySelector('td:nth-child(11)')?.textContent?.trim() ||
                '',
            };
            return cells;
          });
        });

        data.push(...currentPageData);
        console.log(
          `Page ${pageCounter} data extracted. Total records: ${data.length}`,
        );

        const nextButton = await page.$(
          'button.page-link[aria-label="Go to next page"]',
        );

        if (nextButton) {
          const isDisabled = await page.evaluate(
            (button) => button.hasAttribute('disabled'),
            nextButton,
          );

          if (!isDisabled) {
            console.log(`Clicking next page (${pageCounter + 1})...`);

            await page.evaluate((button) => button.click(), nextButton);

            await page.waitForSelector('#definitionsTable tr', {
              timeout: 30000,
            });

            await page.waitForResponse(
              (response) =>
                response.url().includes('foreks.com') &&
                response.status() === 200,
              { timeout: 30000 },
            );

            pageCounter++;
          } else {
            console.log('No more pages to scrape.');
            break;
          }
        } else {
          console.log('Next button not found.');
          break;
        }
      }

      await browser.close();

      const savedData = await Promise.all(
        data.map(async (stock) => {
          const existingStock = await this.prisma.stockDataFunds.findFirst({
            where: { sembol: stock.sembol },
          });

          if (existingStock) {
            return this.prisma.stockDataFunds.update({
              where: { id: existingStock.id },
              data: {
                son: stock.son,
                farkYuzde: stock.farkYuzde,
                haftaBasiYuzde: stock.haftaBasiYuzde,
                ayBasiYuzde: stock.ayBasiYuzde,
                yilBasiYuzde: stock.yilBasiYuzde,
                tedAdet: stock.tedAdet,
                yatirimciSayisi: stock.yatirimciSayisi,
                toplamDeger: stock.toplamDeger,
                portfoyDegeri: stock.portfoyDegeri,
                sure: stock.sure,
                updatedAt: new Date(),
              },
            });
          } else {
            return this.prisma.stockDataFunds.create({
              data: stock,
            });
          }
        }),
      );


      await this.prisma.stockDataFundsHistory.createMany({
        data: data,
      });

      console.log('Scraping finished. Total records:', data.length);
      return data;
    } catch (error) {
      console.log('Error scraping Foreks.com:', error);
      throw new Error('Error scraping Foreks.com');
    }
  }
}
