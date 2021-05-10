import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';

@Injectable()
export class UpdateCampaingToSeconds {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
  ) {}

  async execute(
    campaingMerged: Campaing,
    startsAfterSeconds: number,
  ): Promise<Campaing> {
    campaingMerged.startsAfterSeconds = startsAfterSeconds;
    campaingMerged.startsWhenSelectedMenu = undefined;
    campaingMerged.startsWhenSelectedPlate = undefined;
    return await this.campaingRepository.save(campaingMerged);
  }
}
