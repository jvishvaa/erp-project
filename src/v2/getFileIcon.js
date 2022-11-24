import pptFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pptFileIcon.svg';
import pdfFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pdfFileIcon.svg';
import videoFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/videoFileIcon.svg';
import audioFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/audiofile.svg';
import textFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/textfile.svg';
import excelFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/excelfile.svg';
import imageFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/imagefile.svg';
import defaultFileIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/defaultfile.svg';

export const getFileIcon = (type) => {
  switch (type) {
    case 'ppt':
      return pptFileIcon;
    case 'pptx':
      return pptFileIcon;
    case 'jpeg':
      return imageFileIcon;
    case 'jpg':
      return imageFileIcon;
    case 'png':
      return imageFileIcon;
    case 'xlsx':
      return excelFileIcon;
    case 'xls':
      return excelFileIcon;
    case 'pdf':
      return pdfFileIcon;
    case 'mp4':
      return videoFileIcon;
    case 'mp3':
      return audioFileIcon;
    case 'txt':
      return textFileIcon;
    default:
      return defaultFileIcon;
  }
};
