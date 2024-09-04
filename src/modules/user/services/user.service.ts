// src/modules/user/services/user.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { Company, Role, User } from '.prisma/client';
import { CreateCompanyDto } from '../dtos/information-company/create-company.dto';
import { UpdateCompanyDto } from '../dtos/information-company/update-company.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Thêm thông tin công ty mới cho người dùng
  async addCompanyInfo(
    userId: string,
    data: CreateCompanyDto,
  ): Promise<Company> {
    // Kiểm tra nếu người dùng đã có thông tin công ty chưa
    const existingCompany = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (existingCompany) {
      throw new BadRequestException('User already has company information.');
    }

    // Thêm thông tin mới vào bảng Company với userId liên kết
    return this.prisma.company.create({
      data: {
        ...data,
        userId, // Liên kết với userId từ token
      },
    });
  }

  // Cập nhật thông tin công ty
  async updateCompanyInfo(
    userId: string,
    data: UpdateCompanyDto,
  ): Promise<Company> {
    // Kiểm tra nếu thông tin công ty có tồn tại
    const existingCompany = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!existingCompany) {
      throw new BadRequestException('Company information not found.');
    }

    // Cập nhật thông tin công ty với userId liên kết
    return this.prisma.company.update({
      where: { userId },
      data: {
        ...data,
      },
    });
  }

  // Lấy thông tin công ty
  async getCompanyInfo(userId: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new NotFoundException('Company information not found.');
    }

    return company;
  }

  // Cập nhật vai trò của người dùng
  async updateUserRole(userId: string, role: Role): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required to update role.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role }, // Cập nhật vai trò mới cho người dùng
    });
  }
}
