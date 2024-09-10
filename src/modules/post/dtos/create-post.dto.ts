import {
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PostType, PostStatus } from '@prisma/client';

export class CreatePostDto {
  @IsEnum(PostType)
  postType: PostType;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsDate()
  @IsOptional()
  transportGoes?: Date;

  @IsDate()
  @IsOptional()
  transportComes?: Date;

  @IsBoolean()
  @IsOptional()
  returnTrip?: boolean;

  @IsDate()
  @IsOptional()
  returnTime?: Date;

  @IsBoolean()
  @IsOptional()
  hasVehicle?: boolean;

  @IsString()
  @IsOptional()
  cargoType?: string;

  @IsNumber()
  @IsOptional()
  cargoWeight?: string;

  @IsNumber()
  @IsOptional()
  cargoVolume?: string;

  @IsString()
  @IsOptional()
  specialRequirements?: string;

  @IsString()
  @IsOptional()
  requiredVehicleType?: string;

  @IsString()
  @IsOptional()
  cargoTypeRequest?: string;

  @IsString()
  @IsOptional()
  vehicleType?: string;

  @IsNumber()
  @IsOptional()
  vehicleCapacity?: string;

  @IsNumber()
  @IsOptional()
  availableWeight?: string;

  @IsNumber()
  @IsOptional()
  pricePerUnit?: string;

  @IsString()
  @IsOptional()
  vehicleDetails?: string;
}
