import {
  millisecondsInDay,
  millisecondsInHour,
  millisecondsInMinute,
  millisecondsInSecond,
  minutesInDay,
  minutesInHour,
} from "date-fns/constants";

export const milliseconds = {
  second: millisecondsInSecond,
  minute: millisecondsInMinute,
  hour: millisecondsInHour,
  day: millisecondsInDay,
};

export const minutes = {
  hour: minutesInHour,
  day: minutesInDay,
};
