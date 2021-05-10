import * as Yup from 'yup';

export const TableSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    securityPassword: Yup.string().required('Required!'),
});

export const UpdateTableSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    securityPassword: Yup.string().optional(),
});
