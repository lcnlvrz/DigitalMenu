import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plate, PlateStatus } from 'src/modules/menu/entities/plate.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetPlatesPublished {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
  ) {}

  async execute(owner: User): Promise<number> {
    return await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('plate.status = :status', { status: PlateStatus.PUBLIC })
      .getCount();
  }
}
