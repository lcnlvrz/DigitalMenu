import * as Yup from 'yup';

export const PlateSchema = Yup.object().shape({
    title: Yup.string().required('Required!').max(50, 'Too long!'),
    description: Yup.string().required('Required!').max(400, 'Too long!'),
    ingredients: Yup.array().of(Yup.string()).required('Required!').min(1, 'At least one ingredient!'),
    price: Yup.string().matches(/^\d+$/, 'Only digits!').required('Required!'),
    preparationTime: Yup.number().typeError('Required!').positive('Positive Number!').required('Required!'),
    image: Yup.mixed().required('Required!'),
    weight: Yup.number().required('Required!'),
});
