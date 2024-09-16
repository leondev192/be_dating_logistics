import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { PrismaService } from '../../common/sprisma/prisma.service';
import { ChatGateway } from '../gateways/chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
