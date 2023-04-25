import { Pipe, PipeTransform } from '@angular/core';

const SECONDS_IN_YEAR = 31536000;
const SECONDS_IN_MONTH = 2592000;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date) {
    if (!(value instanceof Date)) {
      value = new Date(value);
    }

    const now = new Date();
    const seconds: number = Math.floor((now.getTime() - value.getTime()) / 1000);

    let interval: number;
    let unit: string;

    if (seconds >= SECONDS_IN_YEAR) {
      interval = Math.floor(seconds / SECONDS_IN_YEAR);
      unit = 'year';
    } else if (seconds >= SECONDS_IN_MONTH) {
      interval = Math.floor(seconds / SECONDS_IN_MONTH);
      unit = 'month';
    } else if (seconds >= SECONDS_IN_DAY) {
      interval = Math.floor(seconds / SECONDS_IN_DAY);
      unit = 'day';
    } else if (seconds >= SECONDS_IN_HOUR) {
      interval = Math.floor(seconds / SECONDS_IN_HOUR);
      unit = 'hour';
    } else if (seconds >= SECONDS_IN_MINUTE) {
      interval = Math.floor(seconds / SECONDS_IN_MINUTE);
      unit = 'minute';
    } else {
      return 'just now';
    }

    if (interval > 1) {
      unit += 's';
    }

    return `${interval} ${unit} ago`;
  }
}
