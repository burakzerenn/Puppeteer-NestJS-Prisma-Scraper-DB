import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scrapper.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService, PrismaService,ConfigService],
  exports: [ScraperService],
})
export class ScraperModule {}
