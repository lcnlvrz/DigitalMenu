import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/order/entities/order.entity';
import { Sales } from '../get-reports/get-reports.dto';

@Injectable()
export class GetSales {
  execute(orders: Order[]): Sales[] {
    return orders.map((order) => {
      const completeName = order.firstName + ' ' + order.lastName;
      return { total: order.total, completeName, updatedAt: order.updatedAt };
    });
  }
}
