import * as Yup from 'yup';
import { PaymentMethod } from '../../services/order.service';

export const ConfirmOrderSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Required!')
        .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]*$/, 'Only letters!'),
    lastName: Yup.string()
        .required('Required!')
        .matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]*$/, 'Only letters!'),
    tableId: Yup.number().typeError('Required!').positive('Positive number').required('Required!'),
    securityPassword: Yup.string().required('Required!'),
    paymentMethod: Yup.string().oneOf([PaymentMethod.EFFECTIVE, PaymentMethod.OTHER_METHOD]).optional(),
});
