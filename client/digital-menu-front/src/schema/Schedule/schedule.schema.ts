import * as Yup from 'yup';
import { daysOfTheWeekArray } from '../../controllers/modal-create-restaurant';

export const ScheduleSchema = Yup.object().shape({
    schedule: Yup.array().of(
        Yup.object({
            day: Yup.string().oneOf(daysOfTheWeekArray, 'Invalid Day'),
            hour: Yup.array().of(Yup.string()).length(2, 'Two Dates!'),
        }),
    ),
});
