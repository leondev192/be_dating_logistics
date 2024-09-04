// src/modules/auth/services/otp.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { Otp } from '.prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo hoặc cập nhật OTP cho người dùng
  async createOtp(
    email: string,
    hashedOtp: string,
    password?: string,
  ): Promise<Otp> {
    // Kiểm tra xem OTP đã tồn tại cho email chưa
    const existingOtp = await this.prisma.otp.findUnique({
      where: { email },
    });

    if (existingOtp) {
      // Cập nhật OTP và thời gian hết hạn nếu đã tồn tại
      return this.prisma.otp.update({
        where: { email },
        data: {
          otp: hashedOtp,
          password: password || existingOtp.password, // Giữ mật khẩu cũ nếu không được cung cấp mới
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Hạn OTP sau 5 phút
        },
      });
    }

    // Tạo mới OTP nếu không tồn tại
    return this.prisma.otp.create({
      data: {
        email,
        otp: hashedOtp,
        password: password || '', // Lưu mật khẩu nếu có hoặc để trống
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Hạn OTP sau 5 phút
      },
    });
  }

  // Tìm OTP theo email
  async findOtp(email: string): Promise<Otp | null> {
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      throw new NotFoundException('OTP không tồn tại cho email này.');
    }

    return otpRecord;
  }

  // Xóa OTP sau khi đã dùng hoặc hết hạn
  async deleteOtp(email: string): Promise<void> {
    try {
      await this.prisma.otp.delete({
        where: { email },
      });
    } catch (error) {
      console.error('Error deleting OTP:', error);
      throw new NotFoundException(
        'Không thể xóa OTP, có thể đã hết hạn hoặc không tồn tại.',
      );
    }
  }

  // Kiểm tra tính hợp lệ của OTP đã nhập
  async isOtpValid(inputOtp: string, storedOtp: string): Promise<boolean> {
    // So sánh mã OTP người dùng nhập với mã đã lưu (đã mã hóa)
    return bcrypt.compare(inputOtp, storedOtp);
  }

  // Kiểm tra xem OTP có hết hạn chưa
  isOtpExpired(expiresAt: Date): boolean {
    // So sánh thời gian hết hạn với thời gian hiện tại
    return new Date() > expiresAt;
  }
}
