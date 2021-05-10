import * as Yup from 'yup';

export const MenuSchema = Yup.object().shape({
    name: Yup.string().required('Required!').max(50, 'Too Long!'),
    description: Yup.string().required('Required!').min(25, 'Too short!').max(200, 'Too long!'),
});
