// src/modules/auth/services/user.service.ts
import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
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

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

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
}
