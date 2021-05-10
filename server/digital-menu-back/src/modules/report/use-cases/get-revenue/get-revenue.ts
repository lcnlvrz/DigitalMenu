import { Injectable } from '@nestjs/common';
import { Sales } from '../get-reports/get-reports.dto';

@Injectable()
export class GetRevenue {
  execute(sales: Sales[]) {
    return sales
      .map((sale) => sale.total)
      .reduce((prev, current) => {
        return prev + current;
      }, 0);
  }
}
