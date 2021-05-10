import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { Question, TypesQuestion } from '../controllers/create-survey-form.controller';
import { IPaginationLinks, IPaginationMeta, SurveyFormResponse } from './order.service';

export interface CreateSurveyFormInput {
    name: string;
    header: string;
    questions: Question[];
}

export enum SurveyFormStatus {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
}

export type SurveyForm = CreateSurveyFormInput & {
    createdAt: string;
    updatedAt: string;
    id: number;
    isPublic: boolean;
    isChangedStatus?: boolean;
};

export interface AnswerDto {
    type: TypesQuestion;
    question: string;
    answer: any;
    value?: any;
}

export interface CreateSurveyFormResponseInput {
    answers: AnswerDto[];
    surveyFormId: number;
    orderId: number;
}

export interface CreateSurveyFormResponseOutput {
    surveyFormResponse: SurveyFormResponse;
}

export interface GetSurveyFormResponsesPagination {
    meta: IPaginationMeta;
    links: IPaginationLinks;
    items: SurveyFormResponse[];
}

export class SurveyFormService {
    async create(
        input: CreateSurveyFormInput,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<SurveyForm>> {
        return axiosAPI.post('/survey-form', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async getMany(token: string, cancelToken: CancelToken): Promise<AxiosResponse<SurveyForm[]>> {
        return await axiosAPI.get('/survey-form', { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async getOneById(id: number, token: string, cancelToken: CancelToken): Promise<AxiosResponse<SurveyForm>> {
        return await axiosAPI.get('/survey-form/' + id, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async updateSurveyForm(
        input: Partial<SurveyForm>,
        token: string,
        surveyFormId: number,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<SurveyForm>> {
        return await axiosAPI.put('/survey-form/' + surveyFormId, input, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async removeQuestion(
        questionId: number,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<SurveyForm>> {
        return await axiosAPI.delete('/survey-form/question/' + questionId, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async createSurveyFormResponse(
        input: CreateSurveyFormResponseInput,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<SurveyFormResponse>> {
        return await axiosAPI.post('/survey-form/response', input, { cancelToken });
    }

    async getManySurveyFormResponses(
        token: string,
        cancelToken: CancelToken,
        query?: string,
    ): Promise<AxiosResponse<GetSurveyFormResponsesPagination>> {
        return await axiosAPI.get('/survey-form/response' + query, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async updateSurveyFormResponseStatus(
        surveyFormResponseId: number,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<SurveyFormResponse>> {
        return await axiosAPI.put(
            '/survey-form/response/' + surveyFormResponseId,
            {},
            { headers: { Authorization: 'Bearer ' + token }, cancelToken },
        );
    }
}
