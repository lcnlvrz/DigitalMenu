import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plate } from 'src/modules/menu/entities/plate.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetTopAndLowerViewsPlate {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
  ) {}

  async execute(owner: User) {
    const topPlatesViews = await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .orderBy('plate.views', 'DESC')
      .select([
        'plate.title',
        'plate.image',
        'plate.views',
        'plate.description',
      ])
      .where('plate.views > 1')
      .limit(5)
      .getMany();

    const lowerPlatesViews = await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .orderBy('plate.views', 'ASC')
      .select([
        'plate.title',
        'plate.image',
        'plate.views',
        'plate.description',
      ])
      .limit(5)
      .getMany();

    topPlatesViews.filter(
      (plateTop) =>
        lowerPlatesViews.findIndex(
          (plateLower) => plateLower.id == plateTop.id,
        ) !== -1,
    );

    return { topPlatesViews, lowerPlatesViews };
  }

  indexOfMax(arr: number[]) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  }

  indexOfMin(arr: number[]) {
    if (arr.length === 0) {
      return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] < min) {
        minIndex = i;
        min = arr[i];
      }
    }

    return minIndex;
  }
}
