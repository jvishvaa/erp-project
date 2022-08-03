import moment from 'moment';
export const getTimeInterval = (date) => {
  let interval = '';
  if (moment(date).isSame(moment(), 'hour')) {
    interval = `${Math.trunc(moment.duration(moment() - moment(date)).asMinutes())}m ago`;
  } else {
    if (moment(date).isSame(moment(), 'day')) {
      interval =
        Math.trunc(moment.duration(moment() - moment(date)).asHours()) === 0
          ? `${Math.trunc(moment.duration(moment() - moment(date)).asMinutes())}m ago`
          : `${Math.trunc(moment.duration(moment() - moment(date)).asHours())}h ago`;
    } else {
      if (moment(date).isSame(moment(), 'week')) {
        interval =
          Math.trunc(moment.duration(moment() - moment(date)).asDays()) == 0
            ? `${Math.trunc(moment.duration(moment() - moment(date)).asHours())}h ago`
            : `${Math.trunc(moment.duration(moment() - moment(date)).asDays())}d ago`;
      } else {
        interval =
          Math.trunc(moment.duration(moment() - moment(date)).asWeeks()) == 0
            ? `${Math.trunc(moment.duration(moment() - moment(date)).asDays())}d ago`
            : `${Math.trunc(moment.duration(moment() - moment(date)).asWeeks())}w ago`;
      }
    }
  }
  return interval;
};
