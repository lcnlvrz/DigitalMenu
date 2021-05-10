import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Plate } from '../../entities/plate.entity';
import { GetPlate } from '../get-plate/get-plate';
import { UpdatePlateDto } from './update-plate.dto';

@Injectable()
export class UpdatePlate {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
    private readonly getPlate: GetPlate,
  ) {}

  async execute(owner: User, dto: UpdatePlateDto): Promise<void> {
    const { platesIds, ...data } = dto;
    for (let i = 0; i < platesIds.length; i++) {
      const plateId = platesIds[i];
      const plate = await this.getPlate.oneByOwner(owner, { plateId });
      const plateUpdated = this.plateRepository.merge(plate, data);
      await this.plateRepository.save(plateUpdated);
    }
  }
}
