// src/modules/match/match.module.ts
import { Module } from '@nestjs/common';
import { MatchService } from './services/match.service';
import { MatchController } from './controllers/match.controller';
import { PrismaService } from '../../common/sprisma/prisma.service';

@Module({
  controllers: [MatchController],
  providers: [MatchService, PrismaService],
  exports: [MatchService],
})
export class MatchModule {}
