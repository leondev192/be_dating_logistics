// src/modules/auth/services/token.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo mã token để đặt lại mật khẩu
  async createResetToken(email: string) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token hết hạn sau 1 giờ

    await this.prisma.token.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });

    return token;
  }

  // Tìm token trong cơ sở dữ liệu
  async findToken(token: string) {
    return this.prisma.token.findUnique({
      where: { token },
    });
  }

  // Kiểm tra xem token có hết hạn không
  isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  // Xóa token sau khi sử dụng
  async deleteToken(token: string) {
    await this.prisma.token.delete({
      where: { token },
    });
  }
}
