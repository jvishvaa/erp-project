import publicspeakingImage from '../assets/images/gp1.png';
import blogActivityImage from '../assets/images/gp2.png';
import visualArtImage from '../assets/images/visual art.jpg';
import physicalActivityImage from '../assets/images/physical activity.jpg';
import musicImage from '../assets/images/music-01.jpg';
import theaterImage from '../assets/images/theater-02.jpg';
import danceImage from '../assets/images/dance-02.jpg';

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
