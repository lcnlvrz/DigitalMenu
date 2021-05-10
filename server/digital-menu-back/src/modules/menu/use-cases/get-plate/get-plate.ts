import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Plate, PlateStatus } from '../../entities/plate.entity';
import { GetPlateDto } from './get-plate.dto';

@Injectable()
export class GetPlate {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
  ) {}

  async oneByOwner(owner: User, dto: GetPlateDto): Promise<Plate> {
    return await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('plate.id = :plateId', { plateId: dto.plateId })
      .getOne();
  }

  async oneByOwnerWithRelation(owner: User, dto: GetPlateDto): Promise<Plate> {
    return await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoinAndSelect('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('plate.id = :plateId', { plateId: dto.plateId })
      .getOne();
  }

  async byId(id: number): Promise<Plate> {
    return await this.plateRepository.findOne({ where: { id } });
  }

  async manyByNameAndOwner(owner: User, plateName: string): Promise<Plate[]> {
    return await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('LOWER(plate.title) like :plateName', {
        plateName: `%${plateName.toLowerCase()}%`,
      })
      .getMany();
  }

  async manyByOwner(owner: User): Promise<Plate[]> {
    return await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .getMany();
  }

  async manyByQuery(
    owner: User,
    menuId: number,
    title: string,
    status: PlateStatus | string,
  ): Promise<Plate[]> {
    const queryBuilder = await this.plateRepository
      .createQueryBuilder('plate')
      .leftJoin('plate.menu', 'menu')
      .leftJoin('menu.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('LOWER(plate.title) like :title', {
        title: `%${title.toLowerCase()}%`,
      })
      .andWhere('menu.id = :menuId', { menuId });

    if (status) {
      queryBuilder.andWhere('plate.status = :status', { status });
    }

    return queryBuilder.getMany();
  }
}
