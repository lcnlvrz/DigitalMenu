import { Injectable } from '@nestjs/common';
import { GetOrder } from 'src/modules/order/use-cases/get-order/get-order';
import { User } from 'src/modules/user/entities/user.entity';
import { GetSales } from '../get-sales/get-sales';
import { GetPlatesServed } from '../get-plates-served/get-plates-served';
import { GetAverageTicketSize } from '../get-average-ticket-size/get-average-ticket-size';
import { GetAverageTicketTime } from '../get-average-ticket-time/get-average-ticket-time';
import { GetRevenue } from '../get-revenue/get-revenue';
import { GetTopAndLowerViewsPlate } from '../get-top-and-lower-views-plate/get-top-and-lower-views-plate';
import { GetReportOuputDto } from './get-reports.dto';
import { ObjectWithKeys } from 'src/modules/survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { GetMenusPublished } from '../get-menus-published/get-menus-published';
import { GetOpenRunningCampaings } from '../get-open-running-campaings/get-open-running-campaings';
import { GetOpenSurveyForms } from '../get-open-survey-forms/get-open-survey-forms';
import { GetPlatesPublished } from '../get-plates-published/get-plates-published';
import { GetTablesCreated } from '../get-tables-created/get-tables-created';

@Injectable()
export class GetReport {
  constructor(
    private readonly getOrder: GetOrder,
    private readonly getSales: GetSales,
    private readonly getPlatesServed: GetPlatesServed,
    private readonly getAverageTicketSize: GetAverageTicketSize,
    private readonly getAverageTicketTime: GetAverageTicketTime,
    private readonly getRevenue: GetRevenue,
    private readonly getTopAndLowerViewsPlate: GetTopAndLowerViewsPlate,
    private readonly getMenusPublished: GetMenusPublished,
    private readonly getOpenRunningCampaings: GetOpenRunningCampaings,
    private readonly getOpenSurveyForms: GetOpenSurveyForms,
    private readonly getPlatesPublished: GetPlatesPublished,
    private readonly getTablesCreated: GetTablesCreated,
  ) {}

  async execute(
    owner: User,
    query: ObjectWithKeys,
  ): Promise<GetReportOuputDto> {
    const dailyOrders = await this.getOrder.manyDoneDailyAndOwner(owner);
    const dailySales = this.getSales.execute(dailyOrders);
    const ordersByQuery = await this.getOrder.manyDoneByOwnerAndQuery(
      owner,
      query,
    );
    const salesByQuery = this.getSales.execute(ordersByQuery);
    const doneOrDeliveredOrdesByQuery = await this.getOrder.manyDeliveredOrDoneAndOwner(
      owner,
      query,
    );
    const platesServed = this.getPlatesServed.execute(
      doneOrDeliveredOrdesByQuery,
    );
    const averageTicketSize = this.getAverageTicketSize.execute(salesByQuery);
    const averageTicketTime = this.getAverageTicketTime.execute(ordersByQuery);
    const revenue = this.getRevenue.execute(salesByQuery);
    const ticketsClosed = salesByQuery.length;

    const {
      lowerPlatesViews,
      topPlatesViews,
    } = await this.getTopAndLowerViewsPlate.execute(owner);

    const menusPublished = await this.getMenusPublished.execute(owner);
    const runningCampaings = await this.getOpenRunningCampaings.execute(owner);
    const openSurveyForms = await this.getOpenSurveyForms.execute(owner);
    const platesPublished = await this.getPlatesPublished.execute(owner);
    const tablesCreated = await this.getTablesCreated.execute(owner);

    return {
      dailySales,
      platesServed,
      averageTicketSize,
      averageTicketTime,
      ticketsClosed,
      revenue,
      lowerPlatesViews,
      topPlatesViews,
      menusPublished,
      openSurveyForms,
      platesPublished,
      runningCampaings,
      tablesCreated,
    };
  }
}
