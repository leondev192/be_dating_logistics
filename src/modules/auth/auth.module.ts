// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { EmailService } from './services/email.service';
import { OtpService } from './services/otp.service';
import { PrismaService } from '../../common/sprisma/prisma.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    OtpService,
    UserService,
    PrismaService,
  ],
})
export class AuthModule {}
