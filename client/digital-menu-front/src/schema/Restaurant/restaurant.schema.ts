import * as Yup from 'yup';
import { daysOfTheWeekArray } from '../../controllers/modal-create-restaurant';

export const RestaurantSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().min(50, 'Too short!').max(1000, 'Too long!').required('Required!'),
    location: Yup.string().required('Required!'),
    cellphone: Yup.number()
        .typeError('Required!')
        .required('Required!')
        .test('digits', 'Invalid Cellphone Number!', (val) => (val && val.toString().length > 5 ? true : false)),
    schedule: Yup.array().of(
        Yup.object({
            day: Yup.string().oneOf(daysOfTheWeekArray, 'Invalid Day'),
            hour: Yup.array().of(Yup.string()).length(2, 'Two Dates!'),
        }),
    ),
    isDelivery: Yup.boolean(),
    hasOtherPaymentMethod: Yup.boolean(),
    hasTableOrderingSystem: Yup.boolean(),
});
