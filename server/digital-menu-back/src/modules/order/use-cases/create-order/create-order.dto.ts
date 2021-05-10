import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export enum PaymentMethod {
  EFFECTIVE = 'EFFECTIVE',
  OTHER_METHOD = 'OTHER_METHOD',
}

export enum OrderStatus {
  IN_QUEUE = 'IN_QUEUE',
  COOKING = 'COOKING',
  WITH_DELAY = 'WITH_DELAY',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
  DELIVERED = 'DELIVERED',
}

export class PlateMinimizedDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]*$/, { message: 'Only letters!' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]*$/, { message: 'Only letters!' })
  lastName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlateMinimizedDto)
  plates: PlateMinimizedDto[];

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  tableId: number;

  @IsString()
  @IsNotEmpty()
  securityPassword: string;

  @IsString()
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  clarifications: string;
}
