import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('foreks')
  async getData(): Promise<any> {
    const result = await this.scraperService.scrapeForeks();
    return result;
  }
}
