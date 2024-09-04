import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from './services/match.service';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
