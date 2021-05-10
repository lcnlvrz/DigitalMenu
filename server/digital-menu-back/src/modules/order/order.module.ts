import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from '../menu/menu.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { SurveyFormModule } from '../survey-form/survey-form.module';
import { TableModule } from '../table/table.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { CreateOrder } from './use-cases/create-order/create-order';
import { FindOrderPagination } from './use-cases/find-order-pagination/find-order-pagination';
import { GetOrder } from './use-cases/get-order/get-order';
import { GetTotal } from './use-cases/get-total/get-total';
import { HandleGetOrder } from './use-cases/handle-get-order/handle-get-order';
import { UpdateOrder } from './use-cases/update-order/update-order';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => RestaurantModule),
    forwardRef(() => SurveyFormModule),
    forwardRef(() => TableModule),
    forwardRef(() => MenuModule),
  ],
  providers: [
    CreateOrder,
    GetOrder,
    UpdateOrder,
    HandleGetOrder,
    FindOrderPagination,
    GetTotal,
  ],
  controllers: [OrderController],
  exports: [GetOrder, GetTotal],
})
export class OrderModule {}
