export const handleTexttoWeekDay = (day) => {
  switch (day.toLowerCase()) {
    case 'monday':
      return '0';
    case 'tuesday':
      return '1';
    case 'wednesday':
      return '2';
    case 'thursday':
      return '3';
    case 'friday':
      return '4';
    case 'saturday':
      return '5';
    default:
      return '6';
  }
};
export const handleDaytoText = (day) => {
  switch (day) {
    case 0:
      return 'Monday';
    case 1:
      return 'Tuesday';
    case 2:
      return 'Wednesday';
    case 3:
      return 'Thursday';
    case 4:
      return 'Friday';
    case 5:
      return 'Saturday';
    default:
      return 'Sunday';
  }
};
