// src/modules/auth/services/otp.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { Otp } from '.prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  async createOtp(email: string, otp: string, password: string): Promise<Otp> {
    // Kiểm tra và cập nhật OTP nếu đã tồn tại
    const existingOtp = await this.prisma.otp.findUnique({ where: { email } });
    if (existingOtp) {
      return this.prisma.otp.update({
        where: { email },
        data: {
          otp,
          password,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    }

    // Tạo mới OTP nếu không tồn tại
    return this.prisma.otp.create({
      data: {
        email,
        otp,
        password,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  }

  async findOtp(email: string): Promise<Otp | null> {
    return this.prisma.otp.findUnique({ where: { email } });
  }

  async deleteOtp(email: string): Promise<void> {
    await this.prisma.otp.delete({ where: { email } });
  }

  async isOtpValid(inputOtp: string, storedOtp: string): Promise<boolean> {
    return bcrypt.compare(inputOtp, storedOtp);
  }

  isOtpExpired(expiresAt: Date): boolean {
    return expiresAt < new Date();
  }
}
