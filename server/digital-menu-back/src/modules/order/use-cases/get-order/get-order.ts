import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { ObjectWithKeys } from 'src/modules/survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { OrderStatus } from '../create-order/create-order.dto';

@Injectable()
export class GetOrder {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async byId(id: number): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.review', 'review')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.surveyFormResponse', 'surveyFormResponse')
      .leftJoinAndSelect(
        'restaurant.surveyForms',
        'surveyForm',
        'surveyForm.isPublic = :status',
        { status: true },
      )
      .orderBy('RANDOM()')
      .limit(1)
      .where('order.id = :id', { id })
      .getOne();
  }

  async manyByOwner(owner: User, query: ObjectWithKeys): Promise<Order[]> {
    const queryBuilder = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id });

    if (query.status) {
      queryBuilder.andWhere('order.status = :status', { status: query.status });
    }

    if (query.rangeDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :start AND :end', {
        start: query.start,
        end: query.end,
      });
    }

    if (query.limit) {
      queryBuilder
        .limit(Number(query.limit))
        .orderBy('order.createdAt', 'DESC');
    }

    return await queryBuilder.getMany();
  }

  async byOwnerAndId(orderId: number, owner: User): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('order.id = :orderId', { orderId })
      .getOne();
  }

  async manyDoneDailyAndOwner(owner: User): Promise<Order[]> {
    const startOfDay = moment().startOf('day').toISOString();
    const endOfDay = moment().endOf('day').toISOString();

    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('order.status = :status', { status: OrderStatus.DONE })
      .andWhere('order.updatedAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getMany();
  }

  async manyDoneByOwnerAndQuery(
    owner: User,
    query: ObjectWithKeys,
  ): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('order.status = :status', { status: OrderStatus.DONE });

    if (query.rangeDate) {
      queryBuilder.andWhere('order.updatedAt BETWEEN :start AND :end', {
        start: query.start,
        end: query.end,
      });
    }

    return await queryBuilder.getMany();
  }

  async manyDeliveredOrDoneAndOwner(
    owner: User,
    query: ObjectWithKeys,
  ): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('order.status = :done OR order.status = :delivered', {
        done: OrderStatus.DONE,
        delivered: OrderStatus.DELIVERED,
      });

    if (query.rangeDate) {
      queryBuilder.andWhere('order.updatedAt BETWEEN :start AND :end', {
        start: query.start,
        end: query.end,
      });
    }

    return await queryBuilder.getMany();
  }
}
