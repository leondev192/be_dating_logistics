// src/modules/post/controllers/post.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PostType } from '@prisma/client';

@ApiTags('Post')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // List toàn bộ bài đăng
  @Get()
  @ApiOperation({ summary: 'List toàn bộ bài đăng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài đăng đã được lấy thành công.',
  })
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  // Lấy chi tiết một bài đăng
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bài đăng' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài đăng đã được lấy thành công.',
  })
  async getPostById(@Param('id') postId: string) {
    return this.postService.getPostById(postId);
  }

  // Lọc bài đăng theo loại
  @UseGuards(JwtAuthGuard)
  @Get('filter')
  @ApiOperation({ summary: 'Lọc bài đăng theo loại' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài đăng được lọc thành công.',
  })
  async filterPostsByType(@Query('postType') postType: PostType) {
    return this.postService.filterPostsByType(postType);
  }

  // Lấy tất cả bài đăng của user hiện tại
  @UseGuards(JwtAuthGuard)
  @Get('user/posts')
  @ApiOperation({ summary: 'Lấy tất cả bài đăng của user hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài đăng của user đã được lấy thành công.',
  })
  async getUserPosts(@Req() req, @Query('postType') postType?: PostType) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.postService.getUserPosts(userId, postType);
  }

  // Thêm bài đăng mới
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Thêm bài đăng mới' })
  @ApiResponse({
    status: 201,
    description: 'Bài đăng đã được tạo thành công.',
  })
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.postService.createPost(userId, createPostDto);
  }

  // Sửa bài đăng
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Sửa bài đăng' })
  @ApiResponse({
    status: 200,
    description: 'Bài đăng đã được cập nhật thành công.',
  })
  async updatePost(
    @Param('id') postId: string,
    @Req() req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  // Xóa bài đăng
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài đăng' })
  @ApiResponse({
    status: 200,
    description: 'Bài đăng đã được xóa thành công.',
  })
  async deletePost(@Param('id') postId: string, @Req() req) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.postService.deletePost(userId, postId);
  }
}
