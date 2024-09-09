import { Module } from '@nestjs/common';
// import { MatchService } from './services/match.service';
// import { MatchController } from './controllers/match.controller';
import { PrismaService } from '../../common/sprisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  // controllers: [MatchController],
  // providers: [MatchService, PrismaService],
  // exports: [MatchService],
})
export class MatchModule {}
