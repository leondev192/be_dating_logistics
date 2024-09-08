import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { PrismaService } from '../../common/sprisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PrismaService],
  exports: [PostService],
})
export class PostModule {}
