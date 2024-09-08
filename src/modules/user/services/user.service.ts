// src/modules/user/services/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { User } from '.prisma/client';
import { UpdateUserDto } from '../dtos/information-company/update-company.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy thông tin người dùng từ cơ sở dữ liệu
  async getUserInfo(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    return user;
  }

  // Cập nhật thông tin người dùng, ngoại trừ email và password
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    // Cập nhật thông tin người dùng với các trường trong UpdateUserDto
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  // Xóa thông tin người dùng, ngoại trừ email và password
  async deleteUserInfo(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    // Xóa thông tin của người dùng nhưng giữ lại email và password
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        phone: null,
        companyName: null,
        address: null,
        businessCode: null,
        taxCode: null,
        representativeName: null,
        representativeUrl: null,
        profilePictureUrl: null,
      },
    });
  }
}
