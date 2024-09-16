// src/gateways/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/services/chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { conversationId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.auth.userId;

    if (!data.conversationId || !data.message) {
      console.error('Invalid data received for sending message:', data);
      return;
    }

    // Lưu tin nhắn vào cơ sở dữ liệu
    const newMessage = await this.chatService.sendMessage(
      data.conversationId,
      userId,
      { message: data.message },
    );

    if (newMessage) {
      // Phát tin nhắn mới tới tất cả người dùng trong phòng
      this.server.to(data.conversationId).emit('newMessage', newMessage);
    } else {
      console.error('Failed to create new message.');
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
    console.log(`Client ${client.id} joined conversation ${conversationId}`);
  }
}
