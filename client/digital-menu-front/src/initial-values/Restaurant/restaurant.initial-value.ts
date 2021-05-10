import { Schedule } from '../../interfaces/Restaurant/restaurant.interface';

export const RestaurantInitialValue = {
    name: '',
    description: '',
    location: '',
    cellphone: '',
    hasOtherPaymentMethod: false,
    hasTableOrderingSystem: true,
    isDelivery: false,
    schedule: [{ day: 'Sunday', hour: ['08:00', '20:00'] }] as Schedule[],
};
