import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMenu } from 'src/modules/menu/use-cases/get-menu/get-menu';
import { GetPlate } from 'src/modules/menu/use-cases/get-plate/get-plate';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';
import { GetCampaing } from '../get-campaing/get-campaing';
import { UpdateCampaingToMenu } from '../update-campaing-to-menu/update-campaing-to-menu';
import { UpdateCampaingToPlate } from '../update-campaing-to-plate/update-campaing-to-plate';
import { UpdateCampaingToSeconds } from '../update-campaing-to-seconds/update-campaing-to-seconds';
import { UpdateCampaingDto } from './handle-update-campaing.dto';

@Injectable()
export class HandleUpdateCampaing {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getCampaing: GetCampaing,
    private readonly updateCampaingToSeconds: UpdateCampaingToSeconds,
    private readonly updateCampaingToPlate: UpdateCampaingToPlate,
    private readonly updateCampaingToMenu: UpdateCampaingToMenu,
  ) {}

  async execute(
    dto: UpdateCampaingDto,
    owner: User,
    campaingId: number,
  ): Promise<Campaing> {
    const {
      startsAfterSeconds,
      startsWhenSelectedPlate,
      startsWhenSelectedMenu,
      ...rest
    } = dto;
    const campaing = await this.getCampaing.oneByOwner(owner, campaingId);
    const campaingMerged = this.campaingRepository.merge(campaing, rest);
    if (dto.startsWhenSelectedMenu && !campaing.startsWhenSelectedMenu) {
      return await this.updateCampaingToMenu.execute(
        owner,
        campaingMerged,
        dto.startsWhenSelectedMenu,
      );
    } else if (
      dto.startsWhenSelectedPlate &&
      !campaingMerged.startsWhenSelectedPlate
    ) {
      return await this.updateCampaingToPlate.execute(
        campaingMerged,
        owner,
        dto.startsWhenSelectedPlate,
      );
    } else {
      return await this.updateCampaingToSeconds.execute(
        campaingMerged,
        dto.startsAfterSeconds,
      );
    }
  }
}
