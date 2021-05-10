import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { UpdateQuestionDto } from './update-question.dto';

@Injectable()
export class UpdateQuestion {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async execute(question: Question, dto: UpdateQuestionDto): Promise<Question> {
    const questionStored = this.questionRepository.merge(question, dto);
    return await this.questionRepository.save(questionStored);
  }
}
