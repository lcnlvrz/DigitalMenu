import { OrderInterface, SurveyFormResponse } from '../../services/order.service';
import { ReviewResponse } from '../../services/restaurant.service';

export type OrderReducerInterface = Partial<OrderInterface> & { isLoading: boolean };

export enum OrderActionsTypes {
    SET_ORDER = 'SET_ORDER',
    CLEAR_ORDER = 'CLEAR_ORDER',
    SET_IS_LOADING = 'SET_IS_LOADING',
    SET_REVIEW = 'SET_REVIEW',
    SET_SURVEY_FORM_RESPONSE = 'SET_SURVEY_FORM_RESPONSE',
}

export type OrderActions =
    | { type: OrderActionsTypes.SET_ORDER; payload: OrderInterface }
    | { type: OrderActionsTypes.CLEAR_ORDER }
    | { type: OrderActionsTypes.SET_IS_LOADING }
    | { type: OrderActionsTypes.SET_REVIEW; payload: ReviewResponse }
    | { type: OrderActionsTypes.SET_SURVEY_FORM_RESPONSE; payload: SurveyFormResponse };
