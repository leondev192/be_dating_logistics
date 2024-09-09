// import {
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { PrismaService } from '../../../common/sprisma/prisma.service';
// import { Match, Post, Chat } from '.prisma/client';
// import {
//   CreateMatchDto,
//   UpdateMatchDto,
//   SendMessageDto,
// } from '../dtos/match.dto';

// @Injectable()
// export class MatchService {
//   constructor(private readonly prisma: PrismaService) {}

//   async createMatch(
//     userId: string,
//     createMatchDto: CreateMatchDto,
//   ): Promise<Match> {
//     const { postId, matchedPostId } = createMatchDto;

//     // Kiểm tra sự tồn tại của các bài đăng
//     const post = await this.prisma.post.findUnique({ where: { id: postId } });
//     const matchedPost = await this.prisma.post.findUnique({
//       where: { id: matchedPostId },
//     });

//     if (!post || !matchedPost) {
//       throw new NotFoundException('Bài đăng không tồn tại.');
//     }

//     return this.prisma.match.create({
//       data: {
//         userId,
//         postId,
//         matchedPostId,
//         status: 'pending',
//       },
//     });
//   }

//   async updateMatch(
//     id: string,
//     userId: string,
//     updateMatchDto: UpdateMatchDto,
//   ): Promise<Match> {
//     const match = await this.prisma.match.findUnique({ where: { id } });

//     if (!match) {
//       throw new NotFoundException('Ghép đôi không tồn tại.');
//     }

//     if (match.userId !== userId) {
//       throw new UnauthorizedException(
//         'Bạn không có quyền cập nhật ghép đôi này.',
//       );
//     }

//     return this.prisma.match.update({
//       where: { id },
//       data: updateMatchDto,
//     });
//   }

//   async deleteMatch(id: string, userId: string): Promise<void> {
//     const match = await this.prisma.match.findUnique({ where: { id } });

//     if (!match) {
//       throw new NotFoundException('Ghép đôi không tồn tại.');
//     }

//     if (match.userId !== userId) {
//       throw new UnauthorizedException('Bạn không có quyền xóa ghép đôi này.');
//     }

//     await this.prisma.match.delete({ where: { id } });
//   }

//   async getUserMatches(userId: string): Promise<Match[]> {
//     return this.prisma.match.findMany({
//       where: { userId },
//       include: {
//         post: true,
//         matchedPost: true,
//         chats: true,
//         ratings: true,
//       },
//     });
//   }

//   async sendMessage(
//     userId: string,
//     sendMessageDto: SendMessageDto,
//   ): Promise<Chat> {
//     const { matchId, message } = sendMessageDto;

//     // Kiểm tra sự tồn tại của ghép đôi
//     const match = await this.prisma.match.findUnique({
//       where: { id: matchId },
//     });

//     if (!match) {
//       throw new NotFoundException('Ghép đôi không tồn tại.');
//     }

//     return this.prisma.chat.create({
//       data: {
//         matchId,
//         message,
//         senderId: userId,
//       },
//     });
//   }
// }
