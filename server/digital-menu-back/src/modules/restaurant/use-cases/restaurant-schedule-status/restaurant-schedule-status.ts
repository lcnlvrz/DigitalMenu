import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { ScheduleDto } from '../create-restaurant/create-restaurant.dto';

@Injectable()
export class RestaurantScheduleStatus {
  execute(schedule: ScheduleDto[]) {
    const currentDay = moment().format('dddd');
    const dayMatched = schedule.find(
      (day) => day.day.toLowerCase() === currentDay.toLowerCase(),
    );
    let closesAt: string = '';
    let opensAt: string = '';
    let isDayMatched: boolean = true;
    let nextNearDay: string = '';
    if (dayMatched) {
      isDayMatched = true;
      const currentTime = moment();
      const start = moment(dayMatched.hour[0], 'HH:mm');
      const end = moment(dayMatched.hour[1], 'HH:mm');
      if (currentTime.isBetween(start, end)) {
        closesAt = dayMatched.hour[1];
      } else {
        opensAt = dayMatched.hour[0];
      }
    } else {
      isDayMatched = false;
      nextNearDay = schedule
        .map((day) => moment(day.day, 'dddd'))
        .sort((day) => {
          return day.valueOf();
        })
        .find((day) => day.isAfter())
        ?.format('dddd');
    }
    return {
      closesAt,
      opensAt,
      nextNearDay,
      isDayMatched,
    };
  }
}
