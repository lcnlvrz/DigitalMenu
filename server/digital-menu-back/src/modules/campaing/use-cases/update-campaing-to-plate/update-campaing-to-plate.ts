import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMenu } from 'src/modules/menu/use-cases/get-menu/get-menu';
import { GetPlate } from 'src/modules/menu/use-cases/get-plate/get-plate';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';

@Injectable()
export class UpdateCampaingToPlate {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getMenu: GetMenu,
  ) {}
  async execute(
    campaingMerged: Campaing,
    owner: User,
    menuId: number,
  ): Promise<Campaing> {
    const menu = await this.getMenu.oneByOwner(owner, menuId);
    campaingMerged.startsWhenSelectedMenu = menu;
    campaingMerged.startsWhenSelectedPlate = undefined;
    campaingMerged.startsAfterSeconds = undefined;
    return await this.campaingRepository.save(campaingMerged);
  }
}
