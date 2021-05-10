import * as Yup from 'yup';

export const ReviewSchema = Yup.object().shape({
    comment: Yup.string().required('Required!').min(20, 'Too short!').max(200, 'Too long!'),
    stars: Yup.number().positive('Minimum 1 star!'),
});
