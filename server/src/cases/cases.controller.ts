import { Controller, Get, Post, Body } from '@nestjs/common';
import { CasesService } from './cases.service.js';

export class AccuseDto {
  culpritId: string;
  clueId: string;
}

export class SearchDto {
  roomId: string;
  spotId: string;
}

export class NewGameDto {
  theme?: string;
}

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get('current')
  getCurrentCase() {
    return this.casesService.getClientState();
  }

  @Post('new-game')
  async startNewGame(@Body() body: NewGameDto) {
    return this.casesService.createNewInvestigation(body.theme);
  }

  @Post('search')
  searchHotspot(@Body() body: SearchDto) {
    return this.casesService.searchHotspot(body.roomId, body.spotId);
  }

  @Post('accuse')
  accuse(@Body() body: AccuseDto) {
    return this.casesService.solveCase(body.culpritId, body.clueId);
  }
}