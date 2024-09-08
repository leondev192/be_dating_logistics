// src/modules/user/dtos/update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Tên người đại diện',
    required: false,
  })
  @IsOptional()
  @IsString()
  representativeName?: string;

  @ApiProperty({
    example: 'Company Name',
    description: 'Tên công ty',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    example: '123 Street, City',
    description: 'Địa chỉ công ty',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã kinh doanh',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessCode?: string;

  @ApiProperty({
    example: '123456789',
    description: 'Mã số thuế',
    required: false,
  })
  @IsOptional()
  @IsString()
  taxCode?: string;

  @ApiProperty({
    example: 'profile.jpg',
    description: 'Ảnh đại diện công ty',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiProperty({
    example: 'representative.jpg',
    description: 'Ảnh CCCD của người đại diện',
    required: false,
  })
  @IsOptional()
  @IsString()
  representativeUrl?: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Số điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
