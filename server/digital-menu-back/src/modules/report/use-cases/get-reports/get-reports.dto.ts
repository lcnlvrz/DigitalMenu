import { Plate } from 'src/modules/menu/entities/plate.entity';

export class Sales {
  completeName: string;
  updatedAt: Date;
  total: number;
}

export class PlateView {
  name: string;
  views: number;
  image: string;
  description: string;
}

export class GetReportOuputDto {
  dailySales: Sales[];
  ticketsClosed: number;
  platesServed: number;
  revenue: number;
  averageTicketSize: number;
  averageTicketTime: number;
  topPlatesViews: Plate[];
  lowerPlatesViews: Plate[];
  openSurveyForms: number;
  runningCampaings: number;
  menusPublished: number;
  platesPublished: number;
  tablesCreated: number;
}
