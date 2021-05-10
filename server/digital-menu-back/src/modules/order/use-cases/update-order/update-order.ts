import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { GetOrder } from '../get-order/get-order';
import { UpdateOrderDto } from './update-order.dto';

@Injectable()
export class UpdateOrder {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly getOrder: GetOrder,
  ) {}

  async execute(
    owner: User,
    dto: UpdateOrderDto,
    orderId: number,
  ): Promise<Order[]> {
    const order = await this.getOrder.byOwnerAndId(orderId, owner);
    order.status = dto.newStatus;
    await this.orderRepository.save(order);

    const queryBuilder = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id });

    if (dto.sortBy) {
      queryBuilder.andWhere('order.status = :sortBy', { sortBy: dto.sortBy });
    }

    return await queryBuilder.getMany();
  }
}
