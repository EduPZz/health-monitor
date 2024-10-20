export const isCompareDate = (date1: Date, date2: Date) => {
  if (typeof date1 === 'string') {
    date1 = new Date(date1);
  }

  if (typeof date2 === 'string') {
    date2 = new Date(date2);
  }

  return date2.getTime() > date1.getTime();
};

const DateValidationUtil = {
  isCompareDate,
};

export default DateValidationUtil;
