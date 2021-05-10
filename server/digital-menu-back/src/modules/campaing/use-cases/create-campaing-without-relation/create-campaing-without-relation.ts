import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';
import { CreateCampaingWithoutRelationDto } from '../handle-create-campaing/handle-create-campaing.dto';

@Injectable()
export class CreateCampaingWithoutRelation {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
  ) {}

  async execute(
    dto: CreateCampaingWithoutRelationDto,
    startsAfterSeconds: number,
    restaurant: Restaurant,
  ): Promise<Campaing> {
    const campaing = this.campaingRepository.create(dto);
    campaing.startsAfterSeconds = startsAfterSeconds;
    campaing.restaurant = restaurant;
    return await this.campaingRepository.save(campaing);
  }
}
