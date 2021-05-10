import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/order/entities/order.entity';
import { Sales } from '../get-reports/get-reports.dto';

@Injectable()
export class GetAverageTicketSize {
  execute(sales: Sales[]): number {
    const avgTicketSize =
      sales
        .map((sale) => sale.total)
        .reduce((prev, current) => {
          return prev + current;
        }, 0) / sales.length;

    return Number(avgTicketSize.toFixed(2));
  }
}
