import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';

@Injectable()
export class GetMenuPagination {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async execute(
    owner: User,
    search: string,
    limit: number,
    page: number,
    status: string,
  ): Promise<Pagination<Menu>> {
    const queryBuilder = this.menuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .leftJoinAndSelect('menu.plates', 'plate')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('LOWER(menu.name) like :search', {
        search: `%${search.toLowerCase()}%`,
      });

    if (status) {
      queryBuilder.andWhere('menu.status = :status', { status });
    }
    return await paginate<Menu>(queryBuilder, {
      limit,
      page,
      route: process.env.APP_BASE_URL,
    });
  }
}
