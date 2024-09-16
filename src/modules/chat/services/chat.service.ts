import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/sprisma/prisma.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { CreateChatDto } from '../dtos/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo cuộc trò chuyện khi người dùng liên hệ với bài đăng
  async createConversation(createChatDto: CreateChatDto, userId: string) {
    const { postId, receiverId } = createChatDto;

    // Kiểm tra xem người dùng có tự tạo cuộc trò chuyện với chính mình không
    if (receiverId === userId) {
      throw new BadRequestException(
        'Bạn không thể tạo cuộc trò chuyện với chính mình.',
      );
    }

    // Kiểm tra bài đăng và lấy thông tin chủ bài đăng (receiver)
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng.');
    }

    // Tạo cuộc trò chuyện mới
    const conversation = await this.prisma.conversation.create({
      data: {
        post: { connect: { id: postId } },
        sender: { connect: { id: userId } },
        receiver: { connect: { id: receiverId } },
      },
    });

    return conversation;
  }

  // chat.service.ts
  async sendMessage(
    conversationId: string,
    senderId: string,
    sendMessageDto: SendMessageDto,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện.');
    }

    // Tạo tin nhắn mới trong cuộc trò chuyện
    const message = await this.prisma.message.create({
      data: {
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: senderId } },
        content: sendMessageDto.message,
      },
    });

    return message;
  }

  // Liệt kê các cuộc trò chuyện của người dùng
  async getUserConversations(userId: string) {
    // Lấy tất cả các cuộc trò chuyện liên quan đến người dùng
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            companyName: true,
            profilePictureUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            companyName: true,
            profilePictureUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            postType: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            content: true,
            createdAt: true,
            isRead: true,
            senderId: true,
          },
          take: 1, // Lấy tin nhắn mới nhất
        },
      },
    });

    // Sắp xếp cuộc trò chuyện theo các tin nhắn chưa đọc và tin nhắn mới nhất
    const sortedConversations = conversations.sort((a, b) => {
      const aUnread =
        a.messages[0]?.isRead === false && a.messages[0]?.senderId !== userId;
      const bUnread =
        b.messages[0]?.isRead === false && b.messages[0]?.senderId !== userId;

      if (aUnread && !bUnread) return -1; // Cuộc trò chuyện `a` có tin nhắn chưa đọc
      if (!aUnread && bUnread) return 1; // Cuộc trò chuyện `b` có tin nhắn chưa đọc
      return (
        b.messages[0]?.createdAt.getTime() - a.messages[0]?.createdAt.getTime()
      ); // Sắp xếp theo tin nhắn mới nhất
    });

    return sortedConversations;
  }

  // chat.service.ts
  async getMessages(conversationId: string, userId: string) {
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            companyName: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    // Cập nhật trạng thái `isRead` của những tin nhắn chưa đọc và không phải của người dùng hiện tại
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        isRead: false,
        senderId: { not: userId },
      },
      data: { isRead: true },
    });

    return messages;
  }

  // chat.service.ts
  async createChat(createChatDto: CreateChatDto, userId: string) {
    const { postId } = createChatDto;

    // Kiểm tra xem bài đăng có tồn tại không
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng.');
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        senderId: userId,
        receiverId: post.user.id,
        postId,
      },
    });

    if (existingConversation) {
      throw new BadRequestException('Cuộc trò chuyện đã tồn tại.');
    }

    // Tạo cuộc trò chuyện mới
    return this.prisma.conversation.create({
      data: {
        post: { connect: { id: postId } },
        sender: { connect: { id: userId } },
        receiver: { connect: { id: post.user.id } },
        messages: {
          create: {
            senderId: userId,
            content: 'Cuộc trò chuyện đã bắt đầu.',
          },
        },
      },
    });
  }
  // chat.service.ts
  async deleteConversation(conversationId: string, userId: string) {
    // Kiểm tra xem cuộc trò chuyện có tồn tại và thuộc về người dùng không
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ senderId: userId }, { receiverId: userId }], // Đảm bảo người dùng là người gửi hoặc người nhận
      },
    });

    if (!conversation) {
      throw new NotFoundException(
        'Không tìm thấy cuộc trò chuyện hoặc bạn không có quyền xóa.',
      );
    }

    try {
      // Xóa tất cả các tin nhắn liên quan đến cuộc trò chuyện trước
      await this.prisma.message.deleteMany({
        where: { conversationId },
      });

      // Sau khi đã xóa tin nhắn, tiến hành xóa cuộc trò chuyện
      await this.prisma.conversation.delete({
        where: { id: conversationId },
      });

      return { message: 'Cuộc trò chuyện đã được xóa thành công.' };
    } catch (error) {
      throw new Error('Lỗi khi xóa cuộc trò chuyện.');
    }
  }
}
