// src/modules/match/services/match.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { ConfirmMatchDto } from '../dtos/confirm-match.dto';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  // Tìm kiếm bài đăng phù hợp
  async searchPosts(query: any) {
    console.log('Received search query:', query);
    const { postType, location, cargoType } = query;

    try {
      const posts = await this.prisma.post.findMany({
        where: {
          postType,
          origin: { contains: location, mode: 'insensitive' },
          cargoType: { contains: cargoType, mode: 'insensitive' },
        },
      });

      if (!posts.length) {
        console.error('No posts found with the given criteria', query);
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No posts found with the given criteria',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Found posts:', posts);
      return {
        status: 'success',
        message: 'Posts retrieved successfully',
        data: posts,
      };
    } catch (error) {
      console.error('Error during search:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error during post search',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Xác nhận ghép đôi
  async confirmMatch(confirmMatchDto: ConfirmMatchDto, user: any) {
    console.log('Received confirm match request:', { confirmMatchDto, user });
    const { postId, matchedPostId } = confirmMatchDto;
    const { userId } = user;

    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post || post.userId !== userId) {
        console.error('Post not found or not owned by user:', {
          postId,
          userId,
        });
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Post not found or not owned by user',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const matchedPost = await this.prisma.post.findUnique({
        where: { id: matchedPostId },
      });

      if (!matchedPost) {
        console.error('Matched post not found:', matchedPostId);
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Matched post not found',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const match = await this.prisma.match.create({
        data: {
          post: { connect: { id: postId } },
          matchedPost: { connect: { id: matchedPostId } },
          status: MatchStatus.confirmed,
          user: { connect: { id: userId } },
        },
      });

      console.log('Match confirmed successfully:', match);
      return {
        status: 'success',
        message: 'Match confirmed successfully',
        data: match,
      };
    } catch (error) {
      console.error('Error during match confirmation:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error during match confirmation',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Lấy danh sách ghép đôi của người dùng
  async getMatchList(user: any) {
    console.log('Received get match list request:', { user });
    const { userId } = user;

    try {
      const matches = await this.prisma.match.findMany({
        where: { userId },
        include: {
          post: true,
          matchedPost: true,
        },
      });

      if (!matches.length) {
        console.error('No matches found for user:', userId);
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No matches found',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Matches retrieved successfully:', matches);
      return {
        status: 'success',
        message: 'Matches retrieved successfully',
        data: matches,
      };
    } catch (error) {
      console.error('Error during fetching match list:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error during fetching match list',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
