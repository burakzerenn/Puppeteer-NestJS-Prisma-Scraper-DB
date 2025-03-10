import { Module } from '@nestjs/common';
import { ScraperModule } from './puppeteer/scraper.module';

@Module({
  imports: [ScraperModule],
})
export class AppModule {}
