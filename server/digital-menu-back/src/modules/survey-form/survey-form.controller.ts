import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { User } from '../user/entities/user.entity';
import { SurveyFormResponse } from './entities/survey-form-response.entity';
import { SurveyForm } from './entities/survey-form.entity';
import { CreateSurveyFormResponseDto } from './use-cases/create-survey-form-response/create-survey-form-response.dto';
import {
  GetSurveyFormResponse,
  ObjectWithKeys,
} from './use-cases/get-survey-form-response/get-survey-form-response';
import { GetSurveyForm } from './use-cases/get-survey-form/get-survey-form';
import { HandleCreateSurveyFormResponse } from './use-cases/handle-create-survey-form-response/handle-create-survey-form-response';
import { HandleCreateSurveyForm } from './use-cases/handle-create-survey-form/handle-create-survey-form';
import { HandleCreateSurveyFormDto } from './use-cases/handle-create-survey-form/handle-create-survey-form.dto';
import { HandleRemoveQuestion } from './use-cases/handle-remove-question/handle-remove-question';
import { HandleRemoveQuestionOutput } from './use-cases/handle-remove-question/handle-remove-question.dto';
import { HandleUpdateSurveyForm } from './use-cases/handle-update-survey-form/handle-update-survey-form';
import { HandleUpdateSurveyFormDto } from './use-cases/handle-update-survey-form/handle-update-survey-form.dto';
import { UpdateStatusSurveyFormResponse } from './use-cases/update-status-survey-form-response/update-status-survey-form-response';

@Controller('survey-form')
export class SurveyFormController {
  constructor(
    private readonly handleCreateSurveyForm: HandleCreateSurveyForm,
    private readonly handleUpdateSurveyForm: HandleUpdateSurveyForm,
    private readonly getSurveyForm: GetSurveyForm,
    private readonly handleRemoveQuestion: HandleRemoveQuestion,
    private readonly handleCreateSurveyFormResponse: HandleCreateSurveyFormResponse,
    private readonly getSurveyFormResponse: GetSurveyFormResponse,
    private readonly updateStatusSurveyFormResponse: UpdateStatusSurveyFormResponse,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Put('response/:surveyFormResponseId')
  async executeUpdateStatusSurveyFormResponse(
    @ReqUser() owner: User,
    @Param('surveyFormResponseId', ParseIntPipe) surveyFormResponseId: number,
  ): Promise<SurveyFormResponse> {
    const surveyFormResponse = await this.getSurveyFormResponse.onyByIdAndOwner(
      owner,
      surveyFormResponseId,
    );
    return await this.updateStatusSurveyFormResponse.execute(
      surveyFormResponse,
    );
  }

  @Post('response')
  async executeHandleCreateSurveyFormResponse(
    @Body() dto: CreateSurveyFormResponseDto,
  ): Promise<SurveyFormResponse> {
    return await this.handleCreateSurveyFormResponse.execute(dto);
  }

  @UseGuards(JwtStrategyGuard)
  @Get('response')
  async executeGetManyResponseSurveyForm(
    @ReqUser() owner: User,
    @Query() query: ObjectWithKeys,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<Pagination<SurveyFormResponse>> {
    return await this.getSurveyFormResponse.manyByOwnerAndQuery(
      owner,
      query,
      page,
      limit,
    );
  }

  @UseGuards(JwtStrategyGuard)
  @Post()
  async executeHandleCreateSurveyForm(
    @ReqUser() user: User,
    @Body() dto: HandleCreateSurveyFormDto,
  ): Promise<SurveyForm> {
    return await this.handleCreateSurveyForm.execute(dto, user);
  }

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeGetManySurveyForms(
    @ReqUser() owner: User,
  ): Promise<SurveyForm[]> {
    return await this.getSurveyForm.manyByOwner(owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Get(':id')
  async executeGetOneSurveyForm(
    @ReqUser() owner: User,
    @Param('id', ParseIntPipe) surveyFormId: number,
  ): Promise<SurveyForm> {
    const surveyForm = await this.getSurveyForm.oneByOwnerAndId(
      owner,
      surveyFormId,
    );
    if (!surveyForm) {
      throw new NotFoundException({
        code: 'not_found_survey_form',
        detail: "The survey form provided doesn't exist",
      });
    }
    return surveyForm;
  }

  @UseGuards(JwtStrategyGuard)
  @Put(':id')
  async executeUpdateOneSurveyForm(
    @ReqUser() owner: User,
    @Param('id', ParseIntPipe) surveyFormId: number,
    @Body() dto: HandleUpdateSurveyFormDto,
  ): Promise<SurveyForm> {
    return await this.handleUpdateSurveyForm.execute(dto, owner, surveyFormId);
  }

  @UseGuards(JwtStrategyGuard)
  @Delete('question/:id')
  async executeRemoveQuestion(
    @ReqUser() owner: User,
    @Param('id', ParseIntPipe) questionId: number,
  ): Promise<HandleRemoveQuestionOutput> {
    return await this.handleRemoveQuestion.execute(owner, questionId);
  }
}
