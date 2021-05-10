import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaing } from '../campaing/entities/campaing.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Plate } from '../menu/entities/plate.entity';
import { MenuModule } from '../menu/menu.module';
import { OrderModule } from '../order/order.module';
import { SurveyForm } from '../survey-form/entities/survey-form.entity';
import { Table } from '../table/entities/table.entity';
import { ReportController } from './report.controller';
import { GetAverageTicketSize } from './use-cases/get-average-ticket-size/get-average-ticket-size';
import { GetAverageTicketTime } from './use-cases/get-average-ticket-time/get-average-ticket-time';
import { GetMenusPublished } from './use-cases/get-menus-published/get-menus-published';
import { GetOpenRunningCampaings } from './use-cases/get-open-running-campaings/get-open-running-campaings';
import { GetOpenSurveyForms } from './use-cases/get-open-survey-forms/get-open-survey-forms';
import { GetPlatesPublished } from './use-cases/get-plates-published/get-plates-published';
import { GetPlatesServed } from './use-cases/get-plates-served/get-plates-served';
import { GetReport } from './use-cases/get-reports/get-reports';
import { GetRevenue } from './use-cases/get-revenue/get-revenue';
import { GetSales } from './use-cases/get-sales/get-sales';
import { GetTablesCreated } from './use-cases/get-tables-created/get-tables-created';
import { GetTopAndLowerViewsPlate } from './use-cases/get-top-and-lower-views-plate/get-top-and-lower-views-plate';

@Module({
  imports: [
    MenuModule,
    OrderModule,
    TypeOrmModule.forFeature([Plate, Menu, Table, SurveyForm, Campaing]),
  ],
  providers: [
    GetReport,
    GetAverageTicketTime,
    GetAverageTicketSize,
    GetPlatesServed,
    GetRevenue,
    GetSales,
    GetTopAndLowerViewsPlate,
    GetMenusPublished,
    GetOpenRunningCampaings,
    GetOpenSurveyForms,
    GetPlatesPublished,
    GetTablesCreated,
  ],
  controllers: [ReportController],
})
export class ReportModule {}
