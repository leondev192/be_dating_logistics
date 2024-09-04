// src/modules/user/dtos/create-company.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Tên công ty', example: 'ABC Company' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ description: 'Địa chỉ công ty', example: '123 Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Mã kinh doanh', example: '123456' })
  @IsString()
  @IsOptional()
  businessCode?: string;

  @ApiProperty({ description: 'Mã số thuế', example: '123456789' })
  @IsString()
  @IsOptional()
  taxCode?: string;

  @ApiProperty({ description: 'Tên người đại diện', example: 'John Doe' })
  @IsString()
  @IsOptional()
  representativeName?: string;

  @ApiProperty({
    description: 'Số CCCD của người đại diện',
    example: '123456789',
  })
  @IsString()
  @IsOptional()
  representativeId?: string;

  @ApiProperty({
    description: 'Ảnh đại diện công ty',
    example: 'https://example.com/image.png',
  })
  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}
