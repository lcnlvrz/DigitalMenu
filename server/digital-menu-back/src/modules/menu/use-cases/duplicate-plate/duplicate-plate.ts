import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { Plate } from '../../entities/plate.entity';
import { CreatePlate } from '../create-plate/create-plate';
import { GetPlate } from '../get-plate/get-plate';

@Injectable()
export class DuplicatePlate {
  constructor(
    private readonly createPlate: CreatePlate,
    private readonly getPlate: GetPlate,
  ) {}

  async execute(owner: User, plateId: number): Promise<Plate> {
    const plateToDuplicate = await this.getPlate.oneByOwnerWithRelation(owner, {
      plateId,
    });
    const { createdAt, updatedAt, id, menu, ...rest } = plateToDuplicate;
    return await this.createPlate.execute(rest, menu);
  }
}
