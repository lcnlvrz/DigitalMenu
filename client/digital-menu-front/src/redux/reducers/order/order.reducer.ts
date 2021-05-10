import { OrderActions, OrderActionsTypes, OrderReducerInterface } from '../../../interfaces/Order/order.interface';
import { Reducer } from 'redux';

export const initialStateOrder: OrderReducerInterface = {
    isLoading: false,
};

export const orderReducer: Reducer<OrderReducerInterface, OrderActions> = (
    state = initialStateOrder,
    action,
): OrderReducerInterface => {
    switch (action.type) {
        case OrderActionsTypes.SET_ORDER:
            return { ...action.payload, isLoading: false };

        case OrderActionsTypes.CLEAR_ORDER:
            return { isLoading: false };

        case OrderActionsTypes.SET_IS_LOADING:
            return { isLoading: true };

        case OrderActionsTypes.SET_REVIEW:
            return { ...state, review: action.payload };

        case OrderActionsTypes.SET_SURVEY_FORM_RESPONSE:
            return { ...state, surveyFormResponse: action.payload };

        default:
            return state;
    }
};
