// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from './services/user.service';
import { OtpService } from './services/otp.service';
import { EmailService } from './services/email.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/strategies/jwt.strategy'; // Import JwtStrategy
import { PrismaService } from '../../common/sprisma/prisma.service';
import { OtpForgotPasswordService } from './services/otp-forgot-password.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    OtpService,
    EmailService,
    PrismaService,
    JwtStrategy, // Thêm JwtStrategy vào providers
    OtpForgotPasswordService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
