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
  acadId: '',
  branchIds: [],
  gradeIds: [],
  sectionIds: [],
  subjectIds: [],
  selectedDate: moment(new Date()).format('YYYY-MM-DD'),
  selectedTime: new Date(),
  coHosts: [],
};

// export const isBetweenNonSchedulingTime = (value) => {
//   const nonSchedulingStartTime = '21:00:00';
//   const nonSchedulingEndTime = '05:59:00';
//   const hours = value.getHours();
//   const minutes = value.getMinutes();
//   const selectedTime = `${`00${hours}`.slice(-2)}:${`00${minutes}`.slice(-2)}:` + `00`;

//   if (selectedTime < nonSchedulingStartTime && selectedTime > nonSchedulingEndTime) {
//     return false;
//   }
//   return true;
// };

export const isBetweenNonSchedulingTime = (value) => {
  const nonSchedulingStartTime = '20:00:00';
  const nonSchedulingEndTime = '07:00:00';
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const selectedTime = `${`00${hours}`.slice(-2)}:${`00${minutes}`.slice(-2)}:` + `00`;
  if (selectedTime < nonSchedulingStartTime && selectedTime > nonSchedulingEndTime) {
    return false;
  }
  return true;
};


export const getPopup = () => { //This will work from 8:00PM (current day) to 7:00AM (next day)
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();
  const today = new Date(year, month, date, 20, 0, 0) // 20, 00, 00  
  const tomorrow = new Date(year, month, date , 7, 0, 0) // 07, 00, 00 
  if (time >= today || time <= tomorrow) {
    return true;
  }
  return false;
}