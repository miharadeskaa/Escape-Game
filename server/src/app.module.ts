import { Module } from '@nestjs/common';
import { CasesModule } from './cases/cases.module.js'; 

@Module({
  imports: [CasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}