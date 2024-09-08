// src/modules/post/services/post.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { Post, PostStatus, PostType } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // List toàn bộ bài đăng, sắp xếp theo thời gian đăng gần nhất trước
  async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo thời gian đăng giảm dần
      },
    });
  }

  // Lấy chi tiết một bài đăng theo ID
  async getPostById(postId: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng.');
    }

    return post;
  }

  // Lọc bài đăng theo loại
  async filterPostsByType(postType: PostType): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        postType,
      },
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo thời gian đăng giảm dần
      },
    });
  }

  // Lấy tất cả bài đăng của user hiện tại
  async getUserPosts(userId: string, postType?: PostType): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        userId,
        postType: postType || undefined,
      },
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo thời gian đăng giảm dần
      },
    });
  }

  // Thêm bài đăng mới
  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    // Lấy thông tin người dùng từ userId để lấy profilePictureUrl
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng.');
    }

    // Lấy URL ảnh đại diện công ty từ user
    const companyImageUrl = user.profilePictureUrl || '';

    const postData = {
      ...createPostDto,
      status: PostStatus.active,
      companyImageUrl, // Thêm URL ảnh đại diện công ty vào bài đăng
      user: {
        connect: { id: userId },
      },
    };

    return this.prisma.post.create({
      data: postData,
    });
  }

  // Sửa bài đăng
  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      throw new NotFoundException(
        'Không tìm thấy bài đăng hoặc không có quyền sửa.',
      );
    }

    const postUpdateData = {
      ...updatePostDto,
    };

    return this.prisma.post.update({
      where: { id: postId },
      data: postUpdateData,
    });
  }

  // Xóa thông tin bài đăng
  async deletePost(userId: string, postId: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      throw new NotFoundException(
        'Không tìm thấy bài đăng hoặc không có quyền xóa.',
      );
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        origin: null,
        destination: null,
        transportTime: null,
        returnTrip: null,
        returnTime: null,
        hasVehicle: null,
        cargoType: null,
        cargoWeight: null,
        cargoVolume: null,
        specialRequirements: null,
        requiredVehicleType: null,
        cargoTypeRequest: null,
        vehicleType: null,
        vehicleCapacity: null,
        availableWeight: null,
        pricePerUnit: null,
        vehicleDetails: null,
      },
    });
  }
}
