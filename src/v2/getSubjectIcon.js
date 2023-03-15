import mathsIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/Maths.png';
import danceIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/dance.png';
import languageIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/Language.png';
import musicIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/music.png';
import scienceIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/science.png';
import sportIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/Sport.png';
import evsIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/evs.png';
import sstIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/sst.png';
import artIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/art.png';
import computerIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/computer.png';
import otherSubjectIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/othersubjects.png';

const getSubject = (value) => {
  if (['maths', 'mathematics', 'numeracy', 'math'].includes(value)) {
    return 'maths';
  } else if (
    [
      'english',
      'hindi',
      'french',
      'literacy',
      'marathi',
      'kannada',
      'sanskrit',
      'bengali',
      'tamil',
      'telugu',
      'english reading',
      'rhymes',
      'story telling',
    ].includes(value)
  ) {
    return 'language';
  } else if (
    [
      'sst',
      'social science',
      'geography',
      'history',
      'social studies',
      'economic',
      'business studies',
    ].includes(value)
  ) {
    return 'sst';
  } else if (['evs', 'environmental studies'].includes(value)) {
    return 'evs';
  } else if (['music', 'music & rhymes'].includes(value)) {
    return 'music';
  } else if (['dance'].includes(value)) {
    return 'dance';
  } else if (
    [
      'pe',
      'physical education',
      'skating',
      'team sport',
      'taekwondo',
      'swimming',
      'karate',
      'chess',
    ].includes(value)
  ) {
    return 'sports';
  } else if (
    [
      'science',
      'natural science',
      'physics',
      'chemistry',
      'biology',
      'robotics',
    ].includes(value)
  ) {
    return 'science';
  } else if (['visual arts', 'arts education'].includes(value)) {
    return 'art';
  } else if (['computer', 'computer science', 'robotics'].includes(value)) {
    return 'computer';
  } else {
    return;
  }
};
export const getSubjectIcon = (value) => {
  const subject = getSubject(value);

  switch (subject) {
    case 'maths':
      return mathsIcon;
    case 'language':
      return languageIcon;
    case 'sports':
      return sportIcon;
    case 'music':
      return musicIcon;
    case 'evs':
      return evsIcon;
    case 'sst':
      return sstIcon;
    case 'dance':
      return danceIcon;
    case 'science':
      return scienceIcon;
    case 'art':
      return artIcon;
    case 'computer':
      return computerIcon;
    default:
      return otherSubjectIcon;
  }
};
