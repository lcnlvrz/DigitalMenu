import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { User } from '../user/entities/user.entity';
import { Campaing } from './entities/campaing.entity';
import { DeleteCampaing } from './use-cases/delete-campaing/delete-campaing';
import { GetCampaing } from './use-cases/get-campaing/get-campaing';
import { HandleCreateCampaing } from './use-cases/handle-create-campaing/handle-create-campaing';
import { CreateCampaingDto } from './use-cases/handle-create-campaing/handle-create-campaing.dto';
import { HandleUpdateCampaing } from './use-cases/handle-update-campaing/handle-update-campaing';
import { UpdateCampaingDto } from './use-cases/handle-update-campaing/handle-update-campaing.dto';
import { UpdateStatusCampaing } from './use-cases/update-status-campaing/update-status-campaing';

@Controller('campaing')
export class CampaingController {
  constructor(
    private readonly getCamping: GetCampaing,
    private readonly handleCreateCampaing: HandleCreateCampaing,
    private readonly handleUpdateCampaing: HandleUpdateCampaing,
    private readonly updateStatusCampaing: UpdateStatusCampaing,
    private readonly deleteCampaing: DeleteCampaing,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Post()
  async executeHandleCreateCampaing(
    @ReqUser() owner: User,
    @Body() dto: CreateCampaingDto,
  ): Promise<Campaing> {
    return await this.handleCreateCampaing.execute(dto, owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeGetManyCampaing(@ReqUser() owner: User): Promise<Campaing[]> {
    return await this.getCamping.manyByOwner(owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Put(':campaingId')
  async executeHandleUpdateCampaing(
    @ReqUser() owner: User,
    @Body() dto: UpdateCampaingDto,
    @Param('campaingId', ParseIntPipe) campaingId: number,
  ): Promise<Campaing> {
    return await this.handleUpdateCampaing.execute(dto, owner, campaingId);
  }

  @UseGuards(JwtStrategyGuard)
  @Get('publish/:campaingId')
  async executeUpdateStatusCampaing(
    @ReqUser() owner: User,
    @Param('campaingId', ParseIntPipe) campaingId: number,
  ): Promise<Campaing> {
    return await this.updateStatusCampaing.execute(owner, campaingId);
  }

  @UseGuards(JwtStrategyGuard)
  @Delete(':campaingId')
  async executeDeleteCampaing(
    @ReqUser() owner: User,
    @Param('campaingId', ParseIntPipe) campaingId: number,
  ): Promise<Campaing> {
    return await this.deleteCampaing.execute(owner, campaingId);
  }
}
