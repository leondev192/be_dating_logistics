// src/modules/match/controllers/match.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MatchService } from '../services/match.service';
import { ConfirmMatchDto } from '../dtos/confirm-match.dto';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt-auth.guard';

@ApiTags('Match')
@Controller('match') // Đảm bảo route gốc là đúng: '/api/v1/match'
export class MatchController {
  private readonly logger = new Logger(MatchController.name);

  constructor(private readonly matchService: MatchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/search/posts') // Đảm bảo đường dẫn này phải đúng
  @ApiOperation({ summary: 'Tìm kiếm bài đăng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài đăng được tìm thấy.',
  })
  async searchPosts(@Query() query: any) {
    this.logger.log('Received search posts request', { query });
    try {
      const result = await this.matchService.searchPosts(query);
      this.logger.log('Search posts result', { result });
      return result;
    } catch (error) {
      this.logger.error('Error during search posts', { error });
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/confirm')
  @ApiOperation({ summary: 'Xác nhận ghép đôi' })
  @ApiResponse({ status: 201, description: 'Ghép đôi đã được xác nhận.' })
  async confirmMatch(
    @Body() confirmMatchDto: ConfirmMatchDto,
    @Req() req: any,
  ) {
    this.logger.log('Received confirm match request', {
      confirmMatchDto,
      user: req.user,
    });
    try {
      const result = await this.matchService.confirmMatch(
        confirmMatchDto,
        req.user,
      );
      this.logger.log('Confirm match result', { result });
      return result;
    } catch (error) {
      this.logger.error('Error during confirm match', { error });
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  @ApiOperation({ summary: 'Lấy danh sách ghép đôi' })
  @ApiResponse({ status: 200, description: 'Danh sách ghép đôi được trả về.' })
  async getMatchList(@Req() req: any) {
    this.logger.log('Received get match list request', { user: req.user });
    try {
      const result = await this.matchService.getMatchList(req.user);
      this.logger.log('Get match list result', { result });
      return result;
    } catch (error) {
      this.logger.error('Error during get match list', { error });
      throw error;
    }
  }
}
