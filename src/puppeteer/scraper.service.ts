import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockData } from 'src/types/stockData';

@Injectable()
export class ScraperService {
  constructor(private readonly prisma: PrismaService) {}
  async scrapeForeks(): Promise<any> {
    console.log('Scraping foreks.com...');

    try {
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
          width: 925,
          height: 998,
        },
      });
      const page = await browser.newPage();
      await page.goto('https://www.foreks.com/borsa/', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      await page.waitForSelector('.select', { timeout: 60000 });
      await page.select('.select', 'ALL');

      await new Promise(resolve => setTimeout(resolve, 3000));

      await page.waitForSelector('#definitionsTable', { timeout: 60000 });
      console.log('Table loaded successfully.');

      let data: StockData[] = [];
      let pageCounter = 1;

      while (true) {
        console.log(`Scraping page ${pageCounter}...`);

        const currentPageData = await page.evaluate(() => {
          const rows = document.querySelectorAll('#definitionsTable tr');

          return Array.from(rows).map((row) => {
            const cells: StockData = {
              sembol:
                row.querySelector('td:nth-child(1)')?.textContent?.replace(/\s+/g, ' ').trim().replace(' ', ' - ') || '',
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
              süre:
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
      const savedData = await this.prisma.stockData.createMany({
        data: data,
        skipDuplicates: true, 
      });

      console.log(`Saved ${savedData.count} records to the database.`);
      console.log('Scraping finished. Total records:', data.length);
      return data;
    } catch (error) {
      console.log('Error scraping Foreks.com:', error);
      throw new Error('Error scraping Foreks.com');
    }
  }
}
