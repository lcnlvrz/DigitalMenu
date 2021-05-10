import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';

@Injectable()
export class RemoveQuestion {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async execute(question: Question): Promise<Question> {
    return await this.questionRepository.remove(question);
  }
}
