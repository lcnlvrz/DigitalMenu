import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ScheduleDto } from './create-restaurant.dto';

@ValidatorConstraint({ name: 'customText', async: false })
export class ValidateValuesNotRepeatedSchedule
  implements ValidatorConstraintInterface {
  validate(schedule: ScheduleDto[], args: ValidationArguments) {
    const daysInSchema = schedule.map((day) => day.day);
    const uniqueValues = new Set(daysInSchema);
    return daysInSchema.length === uniqueValues.size;
  }

  defaultMessage(args: ValidationArguments) {
    return 'You have days of the week repeated.';
  }
}
