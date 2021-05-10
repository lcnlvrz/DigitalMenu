import { combineReducers } from 'redux';
import { RestaurantActions } from '../../interfaces/Restaurant/restaurant.interface';
import { UserActions } from '../../interfaces/User';
import { restaurantReducer } from './restaurant';
import { userReducer } from './user';
import { orderReducer } from './order';
import { OrderActions } from '../../interfaces/Order/order.interface';

export const RootStateReducer = combineReducers({
    user: userReducer,
    restaurant: restaurantReducer,
    order: orderReducer,
});

export type RootState = ReturnType<typeof RootStateReducer>;

export type AllActions = UserActions | RestaurantActions | OrderActions;
