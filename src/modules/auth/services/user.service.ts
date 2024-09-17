// src/modules/auth/services/user.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { User } from '.prisma/client';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // Tạo người dùng mới
  async createUser(
    email: string,
    password: string,
    profilePictureUrl: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        profilePictureUrl,
      },
    });
  }

  // Tìm người dùng theo email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Cập nhật mật khẩu người dùng
  async updatePasswordByEmail(
    email: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });
  }

  // Tìm hoặc tạo người dùng từ Google
  async findOrCreateUser(googleUser: any) {
    const { email, name, picture } = googleUser;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Sử dụng một chuỗi mật khẩu mặc định cho người dùng từ Google
      const defaultPassword = await bcrypt.hash('defaultPassword', 8); // Bạn có thể thay thế với chuỗi ngẫu nhiên hoặc null nếu không cần thiết
      user = await this.prisma.user.create({
        data: {
          email,
          password: defaultPassword, // Thêm trường password với giá trị mặc định
          companyName: name, // Tên công ty từ Google
          profilePictureUrl: picture, // Ảnh đại diện từ Google
        },
      });
    }

    return user;
  }
}
