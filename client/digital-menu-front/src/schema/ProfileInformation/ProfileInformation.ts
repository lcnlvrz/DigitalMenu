import * as Yup from 'yup';

export const ProfileInformationSchema = Yup.object().shape({
    firstName: Yup.string().required('Required!').matches(/^\S*$/, 'No Spaces!'),
    lastName: Yup.string().required('Required!').matches(/^\S*$/, 'No Spaces!'),
    email: Yup.string().email('Invalid!').required('Required!'),
});
