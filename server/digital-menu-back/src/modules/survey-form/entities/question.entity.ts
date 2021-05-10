import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SurveyForm } from './survey-form.entity';

export enum TypesQuestion {
  SMILEY = 'Smiley',
  RATING = 'Rating',
  TEXT = 'Text',
  YES_OR_NO = 'Yes/No',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  isMandatoryQuestion: boolean;

  @Column({ type: 'enum', enum: TypesQuestion })
  type: TypesQuestion;

  @Column()
  value: string;

  @ManyToOne(() => SurveyForm, (surveyForm) => surveyForm.questions, {
    onDelete: 'CASCADE',
  })
  surveyForm: SurveyForm;
}
