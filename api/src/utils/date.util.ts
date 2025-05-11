const utc = (date: Date | string = new Date()) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );

  return new Date(utc);
};

const DateUtil = {
  utc,
};

export default DateUtil;
