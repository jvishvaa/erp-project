import publicspeakingImage from '../assets/images/gp1.png';
import blogActivityImage from '../assets/images/gp2.png';
import visualArtImage from '../assets/images/visual art.jpg';
import physicalActivityImage from '../assets/images/physical activity.jpg';
import musicImage from '../assets/images/music-01.jpg';
import theaterImage from '../assets/images/theater-02.jpg';
import danceImage from '../assets/images/dance-02.jpg';
import swimIcon from 'v2/Assets/dashboardIcons/activityIcons/swim.png';
import skatingIcon from 'v2/Assets/dashboardIcons/activityIcons/skating.png';
import runningIcon from 'v2/Assets/dashboardIcons/activityIcons/running.png';
import jumpingIcon from 'v2/Assets/dashboardIcons/activityIcons/jumping.png';
import throwingIcon from 'v2/Assets/dashboardIcons/activityIcons/throwing.png';

export const getActivityIcon = (value) => {
  switch (value) {
    case 'Blog Activity':
      return blogActivityImage;
    case 'Public Speaking':
      return publicspeakingImage;
    case 'Physical Activity':
      return physicalActivityImage;
    case 'Visual Art':
      return visualArtImage;
    case 'Music':
      return musicImage;
    case 'Dance':
      return danceImage;
    case 'Theatre':
      return theaterImage;
    default:
      return '';
  }
};

export const getActivityColor = (value) => {
  switch (value) {
    case 'Blog Activity':
      return '#7931C0';
    case 'Posts':
      return '#6C6C6C';
    case 'Public Speaking':
      return '#1A8EBF';
    case 'Physical Activity':
      return '#23993D';
    case 'Visual Art':
      return '#F0C52E';
    case 'Music':
      return '#15B9C3';
    case 'Dance':
      return '#FD620B';
    case 'Theatre':
      return '#B90037';
    default:
      return '';
  }
};

export const ActivityTypes = [
  'Physical Activity',
  'Music',
  'Dance',
  'Theatre',
  'Visual Art',
  'Blog Activity',
  'Posts',
];

export const getActivitySportsIcon = (value) => {
  if (['swimming', 'swim'].includes(value)) {
    return swimIcon;
  } else if (['skating', 'skate', 'skates'].includes(value)) {
    return skatingIcon;
  } else if (['running', 'sprinting', 'run', 'sprint'].includes(value)) {
    return runningIcon;
  } else if (['jumping', 'jump'].includes(value)) {
    return jumpingIcon;
  } else if (['throwing', 'throw'].includes(value)) {
    return throwingIcon;
  } else {
    return physicalActivityImage;
  }
};
