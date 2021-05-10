import { Injectable, NotFoundException } from '@nestjs/common';
import { GetQuestion } from 'src/modules/survey-form/use-cases/get-question/get-question';
import { Order } from '../../entities/order.entity';
import { GetOrder } from '../get-order/get-order';

@Injectable()
export class HandleGetOrder {
  constructor(
    private readonly getQuestion: GetQuestion,
    private readonly getOrder: GetOrder,
  ) {}

  async execute(id: number): Promise<Order> {
    const order = await this.getOrder.byId(id);
    if (!order) {
      throw new NotFoundException({
        code: 'order_not_found',
        detail: "The order doesn't exist",
      });
    }
    if (order.restaurant.surveyForms.length) {
      const questions = await this.getQuestion.manyBySurveyFormId(
        order.restaurant.surveyForms[0].id,
      );
      order.restaurant.surveyForms[0].questions = questions;
    }

    return order;
  }
}
