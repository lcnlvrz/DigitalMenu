import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from '../menu/menu.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { CampaingController } from './campaing.controller';
import { Campaing } from './entities/campaing.entity';
import { CreateCampaingRelationMenu } from './use-cases/create-campaing-relation-menu/create-campaing-relation-menu';
import { CreateCampaingRelationPlate } from './use-cases/create-campaing-relation-plate/create-campaing-relation-plate';
import { CreateCampaingWithoutRelation } from './use-cases/create-campaing-without-relation/create-campaing-without-relation';
import { DeleteCampaing } from './use-cases/delete-campaing/delete-campaing';
import { GetCampaing } from './use-cases/get-campaing/get-campaing';
import { HandleCreateCampaing } from './use-cases/handle-create-campaing/handle-create-campaing';
import { HandleUpdateCampaing } from './use-cases/handle-update-campaing/handle-update-campaing';
import { UpdateCampaingToMenu } from './use-cases/update-campaing-to-menu/update-campaing-to-menu';
import { UpdateCampaingToPlate } from './use-cases/update-campaing-to-plate/update-campaing-to-plate';
import { UpdateCampaingToSeconds } from './use-cases/update-campaing-to-seconds/update-campaing-to-seconds';
import { UpdateStatusCampaing } from './use-cases/update-status-campaing/update-status-campaing';

@Module({
  imports: [TypeOrmModule.forFeature([Campaing]), MenuModule, RestaurantModule],
  providers: [
    CreateCampaingRelationMenu,
    CreateCampaingRelationPlate,
    CreateCampaingWithoutRelation,
    UpdateCampaingToMenu,
    UpdateCampaingToPlate,
    UpdateCampaingToSeconds,
    UpdateStatusCampaing,
    DeleteCampaing,
    GetCampaing,
    HandleCreateCampaing,
    HandleUpdateCampaing,
  ],
  controllers: [CampaingController],
})
export class CampaingModule {}
