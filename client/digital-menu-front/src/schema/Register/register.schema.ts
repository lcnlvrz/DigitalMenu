import * as Yup from 'yup';

export const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required!'),
    email: Yup.string().email('Invalid!').required('Required!'),
    password: Yup.string().min(5, 'Too short!').max(100, 'Too long!').required('Required!'),
});
