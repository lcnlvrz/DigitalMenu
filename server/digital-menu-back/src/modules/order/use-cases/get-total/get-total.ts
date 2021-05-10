import { Injectable } from '@nestjs/common';
import { PlateInOrderDto } from '../../entities/order.entity';
import { PlateMinimizedDto } from '../create-order/create-order.dto';

@Injectable()
export class GetTotal {
  execute(plates: PlateInOrderDto[]): number {
    return plates
      .map((plate) => plate.subtotal)
      .reduce((prev, current) => {
        return prev + current;
      }, 0);
  }
}
