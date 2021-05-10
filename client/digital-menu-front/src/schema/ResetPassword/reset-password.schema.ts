import * as Yup from 'yup';

export const SendMailPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Not valid!').required('Required!'),
});

export const ChangePasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Required!'),
    repeatNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Must match with password')
        .required('Required!'),
});
