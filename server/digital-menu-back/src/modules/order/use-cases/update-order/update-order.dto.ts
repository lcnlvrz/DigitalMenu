import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../create-order/create-order.dto';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsString()
  @IsNotEmpty()
  newStatus: OrderStatus;
  @IsOptional()
  @IsString()
  @IsEnum(OrderStatus)
  sortBy?: OrderStatus;
}
