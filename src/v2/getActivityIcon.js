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
    case 'Theater':
      return theaterImage;
    default:
      return '';
  }
};
