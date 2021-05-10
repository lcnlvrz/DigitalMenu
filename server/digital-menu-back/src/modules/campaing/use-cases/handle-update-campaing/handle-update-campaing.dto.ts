import { PartialType } from '@nestjs/swagger';
import { CreateCampaingDto } from '../handle-create-campaing/handle-create-campaing.dto';

export class UpdateCampaingDto extends PartialType(CreateCampaingDto) {}
