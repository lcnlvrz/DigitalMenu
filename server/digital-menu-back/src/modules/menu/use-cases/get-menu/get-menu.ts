import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';

@Injectable()
export class GetMenu {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async oneById(menuId: number): Promise<Menu> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.plates', 'plate')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('menu.id = :menuId', { menuId })
      .getOne();
  }

  async oneByOwner(owner: User, menuId: number): Promise<Menu> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.plates', 'plate')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('menu.id = :menuId', { menuId })
      .getOne();
  }

  async oneByOwnerWithRelations(owner: User, menuId: number): Promise<Menu> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.plates', 'plate')
      .leftJoinAndSelect('menu.restaurant', 'restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('menu.id = :menuId', { menuId })
      .getOne();
  }

  async manyByOwner(owner: User): Promise<Menu[]> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .leftJoinAndSelect('menu.plates', 'plate')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .getMany();
  }

  async manyByNameAndQuery(owner: User, query: string): Promise<Menu[]> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .leftJoinAndSelect('menu.plates', 'plate')
      .where('LOWER(menu.name) like :query OR LOWER(plate.title) like :query', {
        query: `%${query.toLowerCase()}%`,
      })
      .andWhere('owner.id = :ownerId', { ownerId: owner.id })
      .getMany();
  }
}
