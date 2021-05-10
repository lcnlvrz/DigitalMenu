import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { PlateInterface } from '../interfaces/Restaurant/restaurant.interface';

export interface Sales {
    completeName: string;
    updatedAt: Date;
    total: number;
}

export interface PlateView {
    name: string;
    views: number;
    image: string;
}

export interface PlateViewsAndDescription {
    views: number;
    description: string;
}

export type PlateExtendedWithViews = PlateInterface & PlateViewsAndDescription;

export interface GetReportOuputDto {
    dailySales: Sales[];
    ticketsClosed: number;
    platesServed: number;
    revenue: number;
    averageTicketSize: number;
    averageTicketTime: number;
    topPlatesViews: PlateExtendedWithViews[];
    lowerPlatesViews: PlateExtendedWithViews[];
    openSurveyForms: number;
    runningCampaings: number;
    menusPublished: number;
    platesPublished: number;
    tablesCreated: number;
}

export class ReportService {
    async get(token: string, cancelToken: CancelToken): Promise<AxiosResponse<GetReportOuputDto>> {
        return await axiosAPI.get('/report', { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async getByRangeDate(
        start: string,
        end: string,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<GetReportOuputDto>> {
        return await axiosAPI.get('/report?rangeDate=true&start=' + start + '&end=' + end, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
}
