import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('foreks-exchanges')
  async getDataExchanges(): Promise<any> {
    const result = await this.scraperService.scrapeForeksExchanges();
    return result;
  }

  @Get('foreks-funds')
  async getDataFunds(): Promise<any> {
    const result = await this.scraperService.scrapeForeksFunds();
    return result;
  }
}
