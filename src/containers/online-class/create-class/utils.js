import moment from 'moment';

export const getFormatedTime = (time) => {
  const date = time;
  const dateStr =
    `${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(-2)}:` + `00`;
  return dateStr;
};

export const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const initialFormStructure = {
  title: '',
  subject: [],
  duration: '',
  joinLimit: '',
  startDate: '',
  startTime: '',
  tutorEmail: '',
  branchIds: [],
  gradeIds: [],
  sectionIds: [],
  subjectIds: [],
  selectedDate: moment(new Date()).format('YYYY-MM-DD'),
  selectedTime: new Date(), 
  coHosts: [],
};

export const isBetweenNonSchedulingTime = (value) => {
  const nonSchedulingStartTime = '21:00:00';
  const nonSchedulingEndTime = '05:59:00';
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const selectedTime = `${`00${hours}`.slice(-2)}:${`00${minutes}`.slice(-2)}:` + `00`;

  if (selectedTime < nonSchedulingStartTime && selectedTime > nonSchedulingEndTime) {
    return false;
  }
  return true;
};
