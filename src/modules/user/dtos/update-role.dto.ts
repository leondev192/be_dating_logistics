// src/modules/user/dtos/update-role.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client'; // Sử dụng enum Role từ Prisma hoặc định nghĩa enum của riêng bạn

export class UpdateRoleDto {
  @ApiProperty({
    example: 'logistics',
    description: 'Vai trò của người dùng',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
}
