import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Campaing } from '../../entities/campaing.entity';
import { GetCampaing } from '../get-campaing/get-campaing';

@Injectable()
export class DeleteCampaing {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
    private readonly getCampaing: GetCampaing,
  ) {}

  async execute(owner: User, campaingId: number): Promise<Campaing> {
    const campaing = await this.getCampaing.oneByOwner(owner, campaingId);
    return await this.campaingRepository.remove(campaing);
  }
}
