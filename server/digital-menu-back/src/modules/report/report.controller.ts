import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ObjectWithKeys } from '../survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { User } from '../user/entities/user.entity';
import { GetReport } from './use-cases/get-reports/get-reports';

@Controller('report')
export class ReportController {
  constructor(private readonly getReport: GetReport) {}

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeGetReport(
    @ReqUser() owner: User,
    @Query() query: ObjectWithKeys,
  ) {
    return await this.getReport.execute(owner, query);
  }
}
