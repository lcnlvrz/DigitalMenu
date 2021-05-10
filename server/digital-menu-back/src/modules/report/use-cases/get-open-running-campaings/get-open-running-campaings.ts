import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaing } from 'src/modules/campaing/entities/campaing.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetOpenRunningCampaings {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
  ) {}

  async execute(owner: User): Promise<number> {
    return await this.campaingRepository
      .createQueryBuilder('campaing')
      .leftJoin('campaing.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('campaing.publish = true')
      .getCount();
  }
}
