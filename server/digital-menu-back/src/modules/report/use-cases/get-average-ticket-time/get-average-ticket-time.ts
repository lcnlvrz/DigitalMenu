import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Order } from 'src/modules/order/entities/order.entity';

@Injectable()
export class GetAverageTicketTime {
  execute(dailyOrders: Order[]): number {
    const avgMinutes =
      dailyOrders
        .map((order) => {
          const { createdAt, updatedAt } = order;
          const startParsed = moment(createdAt);
          const endParsed = moment(updatedAt);
          const timeTakedToPleaseOrder = moment
            .duration(endParsed.diff(startParsed))
            .asMinutes();
          return timeTakedToPleaseOrder;
        })
        .reduce((prev, current) => {
          return prev + current;
        }, 0) / dailyOrders.length;

    return Number(avgMinutes.toFixed(2));
  }
}
