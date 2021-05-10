import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Dispatch } from 'redux';
import { useToken } from '../hooks/useToken';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { UserActionsTypes } from '../interfaces/User';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';

export const useHeader = () => {
    const [visibleDrawer, setVisibleDrawer] = useState(false);

    const dispatch: Dispatch<AllActions> = useDispatch();
    const tokenController = useToken();
    const history = useHistory();

    const restaurant = useSelector((state: RootState) => state.restaurant);
    const user = useSelector((state: RootState) => state.user);

    const logout = () => {
        tokenController.tokenHelper.delete();
        dispatch({ type: UserActionsTypes.CLEAR_USER });
        dispatch({ type: RestaurantActionsTypes.CLEAR_RESTAURANT });
    };

    return { logout, restaurant, user, setVisibleDrawer, visibleDrawer, history };
};
