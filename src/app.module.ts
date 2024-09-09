import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PostModule } from './modules/post/post.module';
import { RatingModule } from './modules/rating/rating.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ChatModule,
    NotificationModule,
    PostModule,
    RatingModule,
  ],
})
export class AppModule {}
