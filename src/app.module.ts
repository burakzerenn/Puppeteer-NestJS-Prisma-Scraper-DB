import { Module } from '@nestjs/common';
import { ScraperModule } from './puppeteer/scraper.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScraperModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
