import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { ObjectWithKeys } from '../survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { User } from '../user/entities/user.entity';
import { Order } from './entities/order.entity';
import { CreateOrder } from './use-cases/create-order/create-order';
import { CreateOrderDto } from './use-cases/create-order/create-order.dto';
import { FindOrderPagination } from './use-cases/find-order-pagination/find-order-pagination';
import { GetOrder } from './use-cases/get-order/get-order';
import { HandleGetOrder } from './use-cases/handle-get-order/handle-get-order';
import { UpdateOrder } from './use-cases/update-order/update-order';
import { UpdateOrderDto } from './use-cases/update-order/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrder: CreateOrder,
    private readonly handleGetOrder: HandleGetOrder,
    private readonly updateOrder: UpdateOrder,
    private readonly getOrder: GetOrder,
    private readonly findOrderPagination: FindOrderPagination,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Get('paginate')
  async executeFindOrderPagination(
    @ReqUser() owner: User,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query() query: ObjectWithKeys,
  ) {
    return await this.findOrderPagination.execute(
      {
        page,
        limit,
        route: process.env.APP_BASE_URL,
      },
      owner,
      query,
    );
  }

  @Post(':restaurantId')
  async executeCreateOrder(
    @Body() dto: CreateOrderDto,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<Order> {
    return await this.createOrder.execute(dto, restaurantId);
  }

  @Get(':orderId')
  async executeGetOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<Order> {
    const order = await this.handleGetOrder.execute(orderId);
    return order;
  }

  @UseGuards(JwtStrategyGuard)
  @Put(':orderId')
  async executeUpdateOrder(
    @ReqUser() owner: User,
    @Body() dto: UpdateOrderDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<Order[]> {
    return await this.updateOrder.execute(owner, dto, orderId);
  }

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeGetOrderManyByOwner(
    @ReqUser() owner: User,
    @Query() query: ObjectWithKeys,
  ): Promise<Order[]> {
    return await this.getOrder.manyByOwner(owner, query);
  }
}
