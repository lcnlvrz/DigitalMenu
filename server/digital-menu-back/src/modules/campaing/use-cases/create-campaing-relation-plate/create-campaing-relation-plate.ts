import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPlate } from 'src/modules/menu/use-cases/get-plate/get-plate';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { GetRestaurant } from 'src/modules/restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';
import { CreateCampaingWithRelationDto } from '../handle-create-campaing/handle-create-campaing.dto';

@Injectable()
export class CreateCampaingRelationPlate {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getPlate: GetPlate,
  ) {}

  async execute(
    dto: CreateCampaingWithRelationDto,
    owner: User,
    plateId: number,
    restaurant: Restaurant,
  ): Promise<Campaing> {
    const plate = await this.getPlate.oneByOwner(owner, { plateId });
    const campaing = this.campaingRepository.create(dto);
    campaing.startsWhenSelectedPlate = plate;
    campaing.restaurant = restaurant;
    return await this.campaingRepository.save(campaing);
  }
}
