import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';

@Injectable()
export class GetCampaing {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
  ) {}

  async manyByOwner(owner: User): Promise<Campaing[]> {
    return await this.campaingRepository
      .createQueryBuilder('campaing')
      .leftJoinAndSelect('campaing.startsWhenSelectedMenu', 'menu')
      .leftJoinAndSelect('campaing.startsWhenSelectedPlate', 'plate')
      .leftJoin('campaing.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .getMany();
  }

  async oneByOwner(owner: User, campaingId: number): Promise<Campaing> {
    return await this.campaingRepository
      .createQueryBuilder('campaing')
      .leftJoin('campaing.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('campaing.id = :campaingId', { campaingId })
      .getOne();
  }
  async oneByMenuRelation(owner: User, menuId: number): Promise<Campaing> {
    return await this.campaingRepository
      .createQueryBuilder('campaing')
      .leftJoin('campaing.startsWhenSelectedMenu', 'menu')
      .leftJoin('campaing.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('menu.id = :menuId', { menuId })
      .getOne();
  }

  async oneByPlateRelation(owner: User, plateId: number): Promise<Campaing> {
    return await this.campaingRepository
      .createQueryBuilder('campaing')
      .leftJoin('campaing.startsWhenSelectedPlate', 'plate')
      .leftJoin('campaing.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('plate.id = :plateId', { plateId })
      .getOne();
  }
}
