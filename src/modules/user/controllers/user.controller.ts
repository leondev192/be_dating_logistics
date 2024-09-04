// src/modules/user/controllers/user.controller.ts
import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateCompanyDto } from '../dtos/information-company/create-company.dto';
import { UpdateCompanyDto } from '../dtos/information-company/update-company.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Thêm thông tin công ty mới
  @UseGuards(JwtAuthGuard)
  @Post('add-company-info')
  @ApiOperation({ summary: 'Thêm thông tin công ty mới của người dùng' })
  @ApiResponse({
    status: 201,
    description: 'Thông tin công ty đã được thêm thành công.',
  })
  async addCompanyInfo(@Req() req, @Body() createCompanyDto: CreateCompanyDto) {
    const userId = req.user?.userId; // Lấy userId từ token
    if (!userId) {
      throw new Error('User ID is required to add company info.');
    }
    return this.userService.addCompanyInfo(userId, createCompanyDto);
  }

  // Cập nhật thông tin công ty
  @UseGuards(JwtAuthGuard)
  @Patch('update-company-info')
  @ApiOperation({ summary: 'Cập nhật thông tin công ty của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin công ty đã được cập nhật thành công.',
  })
  async updateCompanyInfo(
    @Req() req,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const userId = req.user?.userId; // Lấy userId từ token
    if (!userId) {
      throw new Error('User ID is required to update company info.');
    }
    return this.userService.updateCompanyInfo(userId, updateCompanyDto);
  }

  // Lấy thông tin công ty
  @UseGuards(JwtAuthGuard)
  @Get('get-company-info')
  @ApiOperation({ summary: 'Lấy thông tin công ty của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin công ty của người dùng đã được lấy thành công.',
  })
  async getCompanyInfo(@Req() req) {
    const userId = req.user?.userId; // Lấy userId từ token
    if (!userId) {
      throw new Error('User ID is required to get company info.');
    }
    return this.userService.getCompanyInfo(userId);
  }

  // Cập nhật vai trò người dùng
  @UseGuards(JwtAuthGuard)
  @Patch('update-role')
  @ApiOperation({ summary: 'Cập nhật vai trò người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Vai trò người dùng đã được cập nhật.',
  })
  async updateUserRole(@Req() req, @Body() updateRoleDto: UpdateRoleDto) {
    const userId = req.user?.userId; // Lấy userId từ req.user
    if (!userId) {
      throw new Error('User ID is required to update role.');
    }
    return this.userService.updateUserRole(userId, updateRoleDto.role);
  }
}
