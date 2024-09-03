// src/modules/auth/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        verified: true,
        username: 'default_username', // Thay đổi giá trị phù hợp
        phone: 'default_phone', // Thay đổi giá trị phù hợp
        role: 'customer', // Thay đổi role phù hợp
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
