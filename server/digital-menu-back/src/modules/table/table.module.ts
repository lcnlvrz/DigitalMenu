import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Table } from './entities/table.entity';
import { TableController } from './table.controller';
import { CreateTable } from './use-cases/create-table/create-table';
import { GetTable } from './use-cases/get-table/get-table';
import { RemoveTable } from './use-cases/remove-table/remove-table';
import { SendSecurityPasswords } from './use-cases/send-security-passwords/send-security-passwords';
import { UpdateTable } from './use-cases/update-table/update-table';
import { ValidateTable } from './use-cases/validate-table/validate-table';

@Module({
  imports: [
    TypeOrmModule.forFeature([Table]),
    forwardRef(() => RestaurantModule),
  ],
  providers: [
    CreateTable,
    GetTable,
    UpdateTable,
    RemoveTable,
    ValidateTable,
    SendSecurityPasswords,
  ],
  controllers: [TableController],
  exports: [GetTable, ValidateTable],
})
export class TableModule {}
