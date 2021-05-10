import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/order/entities/order.entity';

@Injectable()
export class GetPlatesServed {
  execute(doneOrDeliveredOrders: Order[]): number {
    return doneOrDeliveredOrders
      .map((order) =>
        order.plates
          .map((plate) => plate.quantity)
          .reduce((prev, current) => {
            return prev + current;
          }, 0),
      )
      .reduce((prev, current) => {
        return prev + current;
      }, 0);
  }
}
