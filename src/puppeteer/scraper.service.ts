import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  async scrapeForeks(): Promise<any> {
    console.log('Scraping foreks.com...');

    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('https://www.foreks.com/borsa/', { waitUntil: 'networkidle2', timeout: 60000 });

      await page.waitForSelector('.select', { timeout: 60000 });
      await page.select('.select', 'ALL');

      await page.waitForSelector('#definitionsTable', { timeout: 60000 });
      
      await page.waitForSelector('#definitionsTable', { timeout: 60000 });
      console.log('Table loaded successfully.');

      let data: string[][] = [];
      let pageCounter = 1;

      while (true) {
        console.log(`Scraping page ${pageCounter}...`);

        const currentPageData = await page.evaluate(() => {
          const rows = document.querySelectorAll('#definitionsTable tr');
          return Array.from(rows).map(row =>
            Array.from(row.querySelectorAll('td')).map(col => col.textContent?.trim() || '')
          );
        });

        data.push(...currentPageData); 
        console.log(`Page ${pageCounter} data extracted. Total records: ${data.length}`);

        const nextButton = await page.$('button.page-link[aria-label="Go to next page"]');

        if (nextButton) {
          const isDisabled = await page.evaluate(button => button.hasAttribute('disabled'), nextButton);

          if (!isDisabled) {
            console.log(`Clicking next page (${pageCounter + 1})...`);
            
            await page.evaluate(button => button.click(), nextButton);

            await page.waitForSelector('#definitionsTable tr', { timeout: 30000 });

            await page.waitForResponse(response => response.url().includes('foreks.com') && response.status() === 200, { timeout: 30000 });

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
      console.log('Scraping finished. Total records:', data.length);
      return data;
    } catch (error) {
      console.log('Error scraping Foreks.com:', error);
      throw new Error('Error scraping Foreks.com');
    }
  }
}
