import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMenu } from 'src/modules/menu/use-cases/get-menu/get-menu';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';
import { CreateCampaingWithRelationDto } from '../handle-create-campaing/handle-create-campaing.dto';

@Injectable()
export class CreateCampaingRelationMenu {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getMenu: GetMenu,
  ) {}

  async execute(
    dto: CreateCampaingWithRelationDto,
    owner: User,
    menuId: number,
    restaurant: Restaurant,
  ): Promise<Campaing> {
    const menu = await this.getMenu.oneByOwner(owner, menuId);
    const campaing = await this.campaingRepository.create(dto);
    campaing.startsWhenSelectedMenu = menu;
    campaing.restaurant = restaurant;
    return await this.campaingRepository.save(campaing);
  }
}
