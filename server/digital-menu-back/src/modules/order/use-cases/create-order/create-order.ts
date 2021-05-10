import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPlate } from 'src/modules/menu/use-cases/get-plate/get-plate';
import { SearchRestaurant } from 'src/modules/restaurant/use-cases/search-restaurants/search-restaurants';
import { GetTable } from 'src/modules/table/use-cases/get-table/get-table';
import { ValidateTable } from 'src/modules/table/use-cases/validate-table/validate-table';
import { Repository } from 'typeorm';
import { Order, PlateInOrderDto } from '../../entities/order.entity';
import { GetTotal } from '../get-total/get-total';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class CreateOrder {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly searchRestaurant: SearchRestaurant,
    private readonly getTable: GetTable,
    private readonly validateTable: ValidateTable,
    private readonly getTotal: GetTotal,
    private readonly getPlate: GetPlate,
  ) {}

  async execute(dto: CreateOrderDto, restaurantId: number): Promise<Order> {
    const table = await this.getTable.oneById(dto.tableId);

    const isPasswordValid = await this.validateTable.execute(
      table,
      dto.securityPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        type: 'invalid_security_password',
        detail: 'The security password provided is not valid.',
      });
    }

    const restaurant = await this.searchRestaurant.oneById(restaurantId);
    const order = await this.orderRepository.create(dto);
    const plates: PlateInOrderDto[] = await Promise.all(
      dto.plates.map(async (plate) => {
        const plateStored = await this.getPlate.byId(plate.id);
        return {
          quantity: plate.quantity,
          subtotal: plateStored.price * plate.quantity,
          title: plateStored.title,
          weight: plateStored.weight,
        } as PlateInOrderDto;
      }),
    );
    const total = this.getTotal.execute(plates);
    order.restaurant = restaurant;
    order.plates = plates;
    order.tableName = table.name;
    order.total = total;
    const orderStored = await this.orderRepository.save(order);
    return orderStored;
  }
}
