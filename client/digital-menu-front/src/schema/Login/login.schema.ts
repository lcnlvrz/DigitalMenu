import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid!').required('Required!'),
    password: Yup.string().required('Required!'),
});
