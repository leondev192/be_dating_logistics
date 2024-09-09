// import {
//   Controller,
//   Post,
//   Patch,
//   Delete,
//   Get,
//   Body,
//   Param,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { MatchService } from '../services/match.service';
// import { JwtAuthGuard } from '../../auth/utils/guards/jwt-auth.guard';
// import {
//   CreateMatchDto,
//   UpdateMatchDto,
//   SendMessageDto,
// } from '../dtos/match.dto';
// import {
//   ApiTags,
//   ApiBearerAuth,
//   ApiOperation,
//   ApiResponse,
// } from '@nestjs/swagger';

// @ApiTags('Match')
// @ApiBearerAuth()
// @Controller('matches')
// export class MatchController {
//   constructor(private readonly matchService: MatchService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post()
//   @ApiOperation({ summary: 'Tạo ghép đôi mới' })
//   @ApiResponse({ status: 201, description: 'Ghép đôi đã được tạo thành công.' })
//   async createMatch(@Req() req, @Body() createMatchDto: CreateMatchDto) {
//     const userId = req.user.userId;
//     return this.matchService.createMatch(userId, createMatchDto);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Patch(':id')
//   @ApiOperation({ summary: 'Cập nhật thông tin ghép đôi' })
//   @ApiResponse({
//     status: 200,
//     description: 'Thông tin ghép đôi đã được cập nhật thành công.',
//   })
//   async updateMatch(
//     @Req() req,
//     @Param('id') id: string,
//     @Body() updateMatchDto: UpdateMatchDto,
//   ) {
//     const userId = req.user.userId;
//     return this.matchService.updateMatch(id, userId, updateMatchDto);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   @ApiOperation({ summary: 'Xóa ghép đôi' })
//   @ApiResponse({ status: 200, description: 'Ghép đôi đã được xóa thành công.' })
//   async deleteMatch(@Req() req, @Param('id') id: string) {
//     const userId = req.user.userId;
//     return this.matchService.deleteMatch(id, userId);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('user/:userId')
//   @ApiOperation({ summary: 'Lấy danh sách các ghép đôi của người dùng' })
//   @ApiResponse({
//     status: 200,
//     description: 'Danh sách ghép đôi của người dùng.',
//   })
//   async getUserMatches(@Param('userId') userId: string) {
//     return this.matchService.getUserMatches(userId);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Post('chat')
//   @ApiOperation({ summary: 'Gửi tin nhắn trong ghép đôi' })
//   @ApiResponse({ status: 201, description: 'Tin nhắn đã được gửi thành công.' })
//   async sendMessage(@Req() req, @Body() sendMessageDto: SendMessageDto) {
//     const userId = req.user.userId;
//     return this.matchService.sendMessage(userId, sendMessageDto);
//   }
// }
