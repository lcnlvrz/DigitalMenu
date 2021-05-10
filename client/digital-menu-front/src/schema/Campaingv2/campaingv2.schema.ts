import * as Yup from 'yup';
import { CampaingTriggered } from '../../controllers/campaings-v2.controller';

export interface TriggeredWhen {
    value: CampaingTriggered;
    label: string;
    key: string;
}

export const CampaingV2Schema = Yup.object().shape({
    title: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    willTriggeredWhen: Yup.object({
        label: Yup.string().required('Required!'),
        value: Yup.string().oneOf(['MENU_SELECTED', 'PLATE_SELECTED', 'CERTAIN_TIME']),
    }),
    startsWhenSelectedMenu: Yup.object().when('willTriggeredWhen', (willTriggeredWhen: TriggeredWhen, schema: any) => {
        switch (willTriggeredWhen.value) {
            case CampaingTriggered.MENU_SELECTED:
                return schema.required('Required!');

            default:
                return schema.optional();
        }
    }),
    startsWhenSelectedPlate: Yup.object().when('willTriggeredWhen', (willTriggeredWhen: TriggeredWhen, schema: any) => {
        switch (willTriggeredWhen.value) {
            case CampaingTriggered.PLATE_SELECTED:
                return schema.required('Required!');

            default:
                return schema.optional();
        }
    }),
    startsAfterSeconds: Yup.number()
        .typeError('Invalid Number!')
        .when('willTriggeredWhen', (willTriggeredWhen: TriggeredWhen, schema: any) => {
            switch (willTriggeredWhen.value) {
                case CampaingTriggered.CERTAIN_TIME:
                    return schema.positive('Positive number!').required('Required!');

                default:
                    return schema.nullable(true).optional('Optional!');
            }
        }),
    banner: Yup.mixed().required('Required!'),
    content: Yup.mixed().required('Required!'),
    publish: Yup.boolean().required('Required!'),
});
