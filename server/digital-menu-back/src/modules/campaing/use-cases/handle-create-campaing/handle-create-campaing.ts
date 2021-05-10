import { ConflictException, Injectable } from '@nestjs/common';
import { GetRestaurant } from 'src/modules/restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from 'src/modules/user/entities/user.entity';
import { Campaing } from '../../entities/campaing.entity';
import { CreateCampaingRelationMenu } from '../create-campaing-relation-menu/create-campaing-relation-menu';
import { CreateCampaingRelationPlate } from '../create-campaing-relation-plate/create-campaing-relation-plate';
import { CreateCampaingWithoutRelation } from '../create-campaing-without-relation/create-campaing-without-relation';
import { GetCampaing } from '../get-campaing/get-campaing';
import { CreateCampaingDto } from './handle-create-campaing.dto';

@Injectable()
export class HandleCreateCampaing {
  constructor(
    private readonly createCampaingRelationMenu: CreateCampaingRelationMenu,
    private readonly createCampaingRelationPlate: CreateCampaingRelationPlate,
    private readonly createCampaingWithoutRelation: CreateCampaingWithoutRelation,
    private readonly getRestaurant: GetRestaurant,
    private readonly getCampaing: GetCampaing,
  ) {}

  async execute(dto: CreateCampaingDto, owner: User): Promise<Campaing> {
    const {
      startsAfterSeconds,
      startsWhenSelectedMenu,
      startsWhenSelectedPlate,
      ...rest
    } = dto;
    const restaurant = await this.getRestaurant.byOwner(owner);
    if (startsWhenSelectedMenu) {
      const campaingWithMenuAlreadyStored = await this.getCampaing.oneByMenuRelation(
        owner,
        startsWhenSelectedMenu,
      );
      if (campaingWithMenuAlreadyStored) {
        throw new ConflictException({
          code: 'menu_already_has_campaing',
          detail: 'This menu already has a campaing assigned',
        });
      }
      return await this.createCampaingRelationMenu.execute(
        rest,
        owner,
        startsWhenSelectedMenu,
        restaurant,
      );
    } else if (startsWhenSelectedPlate) {
      const campaingWithPlateAlreadyStored = await this.getCampaing.oneByPlateRelation(
        owner,
        startsWhenSelectedPlate,
      );
      if (campaingWithPlateAlreadyStored) {
        throw new ConflictException({
          code: 'plate_already_has_campaing',
          detail: 'This plate already has a campaing assigned',
        });
      }
      return await this.createCampaingRelationPlate.execute(
        rest,
        owner,
        startsWhenSelectedPlate,
        restaurant,
      );
    } else {
      return await this.createCampaingWithoutRelation.execute(
        rest,
        startsAfterSeconds,
        restaurant,
      );
    }
  }
}
