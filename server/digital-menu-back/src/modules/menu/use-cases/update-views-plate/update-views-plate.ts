import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Plate } from '../../entities/plate.entity';
import { GetPlate } from '../get-plate/get-plate';

@Injectable()
export class UpdateViewsPlate {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
    private readonly getPlate: GetPlate,
  ) {}

  async execute(plateId: number): Promise<Plate> {
    const plate = await this.getPlate.byId(plateId);
    plate.views = plate.views + 1;
    return await this.plateRepository.save(plate);
  }
}
