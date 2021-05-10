import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';
import { GetCampaing } from '../get-campaing/get-campaing';

@Injectable()
export class UpdateStatusCampaing {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getCampaing: GetCampaing,
  ) {}

  async execute(owner: User, campaingId): Promise<Campaing> {
    const campaing = await this.getCampaing.oneByOwner(owner, campaingId);
    if (campaing.publish) {
      campaing.publish = false;
    } else {
      campaing.publish = true;
    }
    return await this.campaingRepository.save(campaing);
  }
}
