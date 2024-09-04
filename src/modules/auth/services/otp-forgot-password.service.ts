// src/modules/auth/services/otp-forgot-password.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { OtpForgotPassword } from '.prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpForgotPasswordService {
  private readonly logger = new Logger(OtpForgotPasswordService.name);

  constructor(private prisma: PrismaService) {}

  // Tạo hoặc cập nhật OTP và mã hóa trước khi lưu
  async createOtp(email: string, otp: string): Promise<OtpForgotPassword> {
    const hashedOtp = await bcrypt.hash(otp, 8);
    const existingOtp = await this.prisma.otpForgotPassword.findUnique({
      where: { email },
    });

    if (existingOtp) {
      this.logger.log(`Updating existing OTP for email: ${email}`);
      return this.prisma.otpForgotPassword.update({
        where: { email },
        data: {
          otp: hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP hết hạn sau 5 phút
        },
      });
    }

    this.logger.log(`Creating new OTP for email: ${email}`);
    // Tạo mới OTP nếu không tồn tại
    return this.prisma.otpForgotPassword.create({
      data: {
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  }

  // Tìm OTP theo email
  async findOtp(email: string): Promise<OtpForgotPassword | null> {
    return this.prisma.otpForgotPassword.findUnique({ where: { email } });
  }

  // Kiểm tra xem OTP nhập vào có khớp với OTP đã lưu không
  async isOtpValid(inputOtp: string, storedOtp: string): Promise<boolean> {
    this.logger.log(`Comparing OTP: input=${inputOtp}, stored=${storedOtp}`);
    return bcrypt.compare(inputOtp, storedOtp);
  }

  // Kiểm tra xem OTP có hết hạn chưa
  isOtpExpired(expiresAt: Date): boolean {
    const currentTime = new Date();
    this.logger.log(
      `Current time: ${currentTime.toISOString()}, OTP expires at: ${expiresAt.toISOString()}`,
    );

    // So sánh thời gian hiện tại với thời gian hết hạn
    return expiresAt.getTime() <= currentTime.getTime();
  }

  // Xóa OTP sau khi xác thực thành công
  async deleteOtp(email: string): Promise<void> {
    await this.prisma.otpForgotPassword.delete({ where: { email } });
  }
}
