import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/modules/order/entities/order.entity';
import { Repository } from 'typeorm';
import { Answer } from '../../entities/answer.entity';
import { AnswerDto } from '../create-survey-form-response/create-survey-form-response.dto';

@Injectable()
export class CreateAnswer {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async execute(order: Order, dto: AnswerDto): Promise<Answer> {
    const { answer: value, ...rest } = dto;
    const answer = await this.answerRepository.create({ ...rest, value });
    answer.order = order;
    return await this.answerRepository.save(answer);
  }
}
