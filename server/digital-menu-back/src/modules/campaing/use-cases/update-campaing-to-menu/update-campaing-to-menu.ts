import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPlate } from 'src/modules/menu/use-cases/get-plate/get-plate';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';

@Injectable()
export class UpdateCampaingToMenu {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getPlate: GetPlate,
  ) {}

  async execute(
    owner: User,
    campaingMerged: Campaing,
    plateId: number,
  ): Promise<Campaing> {
    const plate = await this.getPlate.oneByOwner(owner, {
      plateId,
    });
    campaingMerged.startsWhenSelectedPlate = plate;
    campaingMerged.startsWhenSelectedMenu = undefined;
    campaingMerged.startsAfterSeconds = undefined;
    return await this.campaingRepository.save(campaingMerged);
  }
}
