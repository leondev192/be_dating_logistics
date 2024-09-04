// src/post/dto/update-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { PostStatus } from '@prisma/client';

export class UpdatePostDto {
  @ApiProperty({
    enum: PostStatus,
    description: 'Trạng thái bài đăng',
    required: false,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({ description: 'Loại hàng hóa', required: false })
  @IsOptional()
  @IsString()
  cargoType?: string;

  @ApiProperty({ description: 'Loại xe', required: false })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiProperty({ description: 'Số lượng hàng hóa', required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Nơi bắt đầu vận chuyển', required: false })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({ description: 'Nơi kết thúc vận chuyển', required: false })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({ description: 'Thời gian vận chuyển dự kiến', required: false })
  @IsOptional()
  transportTime?: Date;
}
