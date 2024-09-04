// src/modules/post/services/post.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostType, PostStatus, Role } from '@prisma/client'; // Thêm PostStatus từ Prisma

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, user: any) {
    console.log('Received create post request', { createPostDto, user });

    const { userId, companyId, role } = user;

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    console.log('Fetched user data', { userData });

    if (!userData || userData.company.id !== companyId) {
      console.error('User or associated company not found', {
        userId,
        companyId,
      });
      throw new NotFoundException({
        statusCode: 404,
        message: 'User or associated company not found',
        error: 'Not Found',
      });
    }

    // Kiểm tra vai trò và loại bài đăng để phân biệt
    if (
      (role === Role.customer && createPostDto.postType !== PostType.request) ||
      (role === Role.carrier && createPostDto.postType !== PostType.offer)
    ) {
      console.error('Invalid post type for user role', {
        role,
        postType: createPostDto.postType,
      });
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Invalid post type for your role',
        error: 'Forbidden',
      });
    }

    // Tạo bài đăng mới với connect và thêm status đúng
    const newPost = await this.prisma.post.create({
      data: {
        postType: createPostDto.postType,
        cargoType: createPostDto.cargoType,
        vehicleType: createPostDto.vehicleType,
        quantity: createPostDto.quantity,
        origin: createPostDto.origin,
        destination: createPostDto.destination,
        transportTime: createPostDto.transportTime,
        status: PostStatus.active, // Thêm status mặc định hoặc phù hợp
        company: {
          connect: { id: companyId }, // Sử dụng connect để liên kết với Company
        },
        user: {
          connect: { id: userId }, // Sử dụng connect để liên kết với User
        },
      },
    });

    console.log('Post created successfully', { newPost });

    return {
      status: 'success',
      message: 'Post created successfully',
      data: newPost,
    };
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto, user: any) {
    console.log('Received update post request', {
      postId,
      updatePostDto,
      user,
    });

    const { userId } = user;

    // Lấy thông tin bài đăng từ cơ sở dữ liệu
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    console.log('Fetched post data', { post });

    if (!post || post.userId !== userId) {
      console.error('Post not found or permission denied', { postId, userId });
      throw new NotFoundException({
        statusCode: 404,
        message: 'Post not found or you do not have permission to update',
        error: 'Not Found',
      });
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: updatePostDto,
    });

    console.log('Post updated successfully', { updatedPost });

    return {
      status: 'success',
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  async deletePost(postId: string, user: any) {
    console.log('Received delete post request', { postId, user });

    const { userId } = user;

    // Lấy thông tin bài đăng từ cơ sở dữ liệu
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    console.log('Fetched post data', { post });

    if (!post || post.userId !== userId) {
      console.error('Post not found or permission denied', { postId, userId });
      throw new NotFoundException({
        statusCode: 404,
        message: 'Post not found or you do not have permission to delete',
        error: 'Not Found',
      });
    }

    await this.prisma.post.delete({ where: { id: postId } });

    console.log('Post deleted successfully', { postId });

    return {
      status: 'success',
      message: 'Post deleted successfully',
      data: null,
    };
  }

  async listPosts(user: any) {
    console.log('Received list posts request', { user });

    const { userId, role } = user;

    // Lấy tất cả bài đăng của người dùng hiện tại theo userId
    const posts = await this.prisma.post.findMany({
      where: {
        userId: userId, // Lọc bài đăng theo userId của người dùng đã đăng nhập
        postType: role === Role.customer ? PostType.offer : PostType.request, // Phân loại bài đăng theo vai trò
      },
    });

    console.log('Fetched posts data', { posts });

    return {
      status: 'success',
      message: 'Posts retrieved successfully',
      data: posts,
    };
  }

  async getPostDetail(postId: string) {
    console.log('Received get post detail request', { postId });

    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    console.log('Fetched post data', { post });

    if (!post) {
      console.error('Post not found', { postId });
      throw new NotFoundException({
        statusCode: 404,
        message: 'Post not found',
        error: 'Not Found',
      });
    }

    return {
      status: 'success',
      message: 'Post detail retrieved successfully',
      data: post,
    };
  }
}
