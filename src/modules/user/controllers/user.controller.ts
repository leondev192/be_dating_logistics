// src/modules/user/controllers/user.controller.ts
import {
  Controller,
  Patch,
  Delete,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/information-company/update-company.dto';
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

  // Lấy thông tin người dùng
  @UseGuards(JwtAuthGuard)
  @Get('get-info')
  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng đã được lấy thành công.',
  })
  async getUserInfo(@Req() req) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.userService.getUserInfo(userId);
  }

  // Cập nhật thông tin người dùng, ngoại trừ email và password
  @UseGuards(JwtAuthGuard)
  @Patch('update-info')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng đã được cập nhật thành công.',
  })
  async updateUserInfo(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.userService.updateUser(userId, updateUserDto);
  }

  // Xóa thông tin người dùng (ngoại trừ email và password)
  @UseGuards(JwtAuthGuard)
  @Delete('delete-info')
  @ApiOperation({ summary: 'Xóa thông tin cá nhân của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng đã được xóa thành công.',
  })
  async deleteUserInfo(@Req() req) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.userService.deleteUserInfo(userId);
  }
}
