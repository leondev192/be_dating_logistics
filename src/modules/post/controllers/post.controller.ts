// src/modules/post/controllers/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt-auth.guard';

@ApiTags('Posts')
@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Tạo bài đăng mới' })
  @ApiResponse({ status: 201, description: 'Bài đăng đã được tạo.' })
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.createPost(createPostDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:postId')
  @ApiOperation({ summary: 'Cập nhật bài đăng' })
  @ApiResponse({ status: 200, description: 'Bài đăng đã được cập nhật.' })
  update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postService.updatePost(postId, updatePostDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:postId')
  @ApiOperation({ summary: 'Xóa bài đăng' })
  @ApiResponse({ status: 200, description: 'Bài đăng đã được xóa.' })
  delete(@Param('postId') postId: string, @Req() req) {
    return this.postService.deletePost(postId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOperation({ summary: 'Lấy danh sách bài đăng' })
  @ApiResponse({ status: 200, description: 'Danh sách bài đăng được trả về.' })
  list(@Req() req) {
    return this.postService.listPosts(req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:postId')
  @ApiOperation({ summary: 'Lấy chi tiết bài đăng' })
  @ApiResponse({ status: 200, description: 'Chi tiết bài đăng được trả về.' })
  detail(@Param('postId') postId: string) {
    return this.postService.getPostDetail(postId);
  }
}
