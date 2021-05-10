import { Reducer } from 'redux';
import { UserInitialValue } from '../../../initial-values/User';
import { UserActions, UserActionsTypes, UserReducerInterface } from '../../../interfaces/User';

export const userReducer: Reducer<UserReducerInterface, UserActions> = (
    state = { ...UserInitialValue, isLoading: true },
    action,
): UserReducerInterface => {
    switch (action.type) {
        case UserActionsTypes.SET_USER:
            return { ...action.payload, isLoading: false, isLogged: true };

        case UserActionsTypes.CLEAR_USER:
            return { isLoading: false, isLogged: false };

        case UserActionsTypes.UPDATE_USER:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};
