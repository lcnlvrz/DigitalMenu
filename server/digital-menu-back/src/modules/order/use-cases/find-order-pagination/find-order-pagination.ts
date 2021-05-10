import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { ObjectWithKeys } from 'src/modules/survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { User } from 'src/modules/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';

@Injectable()
export class FindOrderPagination {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(
    options: IPaginationOptions,
    owner: User,
    query: ObjectWithKeys,
  ): Promise<Pagination<Order>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .select([
        'order.status',
        'order.plates',
        'order.paymentMethod',
        'order.clarifications',
        'order.createdAt',
        'order.firstName',
        'order.id',
        'order.lastName',
        'order.total',
        'order.tableName',
      ])
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

    if (query.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'LOWER(order.firstName) like :search OR LOWER(order.lastName) like :search OR LOWER(order.tableName) like :search',
            {
              search: `%${query.search.toString().toLowerCase()}%`,
            },
          );
        }),
      );
    }

    if (typeof query.order === 'string') {
      const orderParsed = query.order === 'ASCEND' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`order.${query.field}`, orderParsed);
    }

    if (query.table) {
      queryBuilder.andWhere('order.tableName = :tableName', {
        tableName: query.table,
      });
    }

    return paginate<Order>(queryBuilder, options);
  }
}
