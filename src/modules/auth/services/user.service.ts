// src/modules/auth/services/user.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { User } from '.prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // Tạo người dùng mới
  async createUser(email: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  // Tìm người dùng theo email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Cập nhật mật khẩu người dùng
  async updatePassword(email: string, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}
