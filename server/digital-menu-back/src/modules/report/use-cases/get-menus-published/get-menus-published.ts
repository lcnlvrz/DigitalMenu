import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, MenuStatus } from 'src/modules/menu/entities/menu.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetMenusPublished {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async execute(owner: User): Promise<number> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('menu.status = :status', { status: MenuStatus.PUBLIC })
      .getCount();
  }
}
