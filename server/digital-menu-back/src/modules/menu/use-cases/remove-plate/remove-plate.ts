import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { Repository } from 'typeorm';
import { Plate } from '../../entities/plate.entity';
import { GetPlate } from '../get-plate/get-plate';
import { PlateIdArray } from '../update-plate/update-plate.dto';

@Injectable()
export class DeletePlate {
  constructor(
    private readonly getPlate: GetPlate,
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
  ) {}

  async execute(owner: User, dto: PlateIdArray) {
    for (let i = 0; i < dto.platesIds.length; i++) {
      const plateId = dto.platesIds[i];
      const plate = await this.getPlate.oneByOwner(owner, { plateId });
      await this.plateRepository.remove(plate);
    }
  }
}
