import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import { RestaurantActionsTypes } from '../../interfaces/Restaurant/restaurant.interface';
import { UserActionsTypes } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { AllActions } from '../reducers/root-state.reducer';

export const authFetch = (dispatch: Dispatch<AllActions>): void => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        dispatch({ type: UserActionsTypes.CLEAR_USER });
        dispatch({ type: RestaurantActionsTypes.CLEAR_RESTAURANT });
    } else {
        const authService = new AuthService();
        authService
            .me(token)
            .then((res) => {
                const user = res.data;
                dispatch({ type: UserActionsTypes.SET_USER, payload: user });
            })
            .catch((err: AxiosError) => {
                localStorage.removeItem('accessToken');
                dispatch({ type: UserActionsTypes.CLEAR_USER });
                dispatch({ type: RestaurantActionsTypes.CLEAR_RESTAURANT });
                throw err;
            })
            .finally(() => {
                const restaurantService = new RestaurantService();
                restaurantService
                    .getRestaurant(token)
                    .then((res) => {
                        dispatch({ type: RestaurantActionsTypes.SET_RESTAURANT, payload: res.data });
                    })
                    .catch((err: AxiosError) => {
                        dispatch({ type: UserActionsTypes.CLEAR_USER });
                        throw err;
                    });
            });
    }
};
