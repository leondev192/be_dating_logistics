import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { SendMessageDto } from '../dtos/send-message.dto';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Tạo cuộc trò chuyện khi liên hệ với người dùng khác
  @UseGuards(JwtAuthGuard)
  @Post('contact')
  @ApiOperation({
    summary: 'Liên hệ với người dùng khác và tạo cuộc trò chuyện',
  })
  @ApiResponse({
    status: 201,
    description: 'Cuộc trò chuyện đã được tạo thành công.',
  })
  async createConversation(@Body() createChatDto: CreateChatDto, @Req() req) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.chatService.createConversation(createChatDto, userId);
  }

  // Gửi tin nhắn trong cuộc trò chuyện
  @UseGuards(JwtAuthGuard)
  @Post(':conversationId/send-message')
  @ApiOperation({ summary: 'Gửi tin nhắn trong cuộc trò chuyện' })
  @ApiResponse({
    status: 201,
    description: 'Tin nhắn đã được gửi thành công.',
  })
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Req() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.chatService.sendMessage(conversationId, userId, sendMessageDto);
  }

  // Liệt kê các cuộc trò chuyện của người dùng
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Liệt kê các cuộc trò chuyện của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các cuộc trò chuyện đã được lấy thành công.',
  })
  async getUserConversations(@Req() req) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.chatService.getUserConversations(userId);
  }

  // Liệt kê tin nhắn trong một cuộc trò chuyện
  @UseGuards(JwtAuthGuard)
  @Get(':conversationId/messages')
  @ApiOperation({ summary: 'Liệt kê tin nhắn trong một cuộc trò chuyện' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tin nhắn đã được lấy thành công.',
  })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Req() req, // Include the request object to access user information
  ) {
    const userId = req.user.userId; // Extract the user ID from the JWT token
    return this.chatService.getMessages(conversationId, userId); // Pass both conversationId and userId
  }
  // chat.controller.ts
  @Post('contact')
  @ApiOperation({
    summary: 'Liên hệ với người đăng bài và tạo cuộc trò chuyện',
  })
  @ApiResponse({
    status: 201,
    description: 'Cuộc trò chuyện đã được tạo thành công.',
  })
  async createChat(@Body() createChatDto: CreateChatDto, @Req() req) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.chatService.createChat(createChatDto, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':conversationId')
  @ApiOperation({ summary: 'Xóa cuộc trò chuyện' })
  @ApiResponse({
    status: 200,
    description: 'Cuộc trò chuyện đã được xóa thành công.',
  })
  async deleteConversation(
    @Param('conversationId') conversationId: string,
    @Req() req,
  ) {
    const userId = req.user.userId; // Lấy userId từ token JWT
    return this.chatService.deleteConversation(conversationId, userId);
  }
}
