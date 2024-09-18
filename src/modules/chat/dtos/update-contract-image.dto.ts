// update-contract-image.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateContractImageDto {
  @ApiProperty({ description: 'URL của ảnh hợp đồng.' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
