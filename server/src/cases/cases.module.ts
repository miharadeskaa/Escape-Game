import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller.js';
import { CasesService } from './cases.service.js';
import { StoryGeneratorService } from './story-generator.service.js';

@Module({
  controllers: [CasesController],
  providers: [CasesService, StoryGeneratorService],
})
export class CasesModule {}