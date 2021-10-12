import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

export const getPipelineConfig = (pipelineStatusId) => {
  switch (pipelineStatusId) {
    case '0':
      return { status: 'pending', color: '#ab6100', Icon: PauseCircleOutlineIcon };
    case '1':
      return { status: 'running', color: '#1f75cb', Icon: PlayCircleOutlineIcon };
    case '2':
      return { status: 'complete', color: '#108548', Icon: CheckCircleOutlineIcon };
    case '3':
      return { status: 'failed', color: '#dd2b0e', Icon: HighlightOffIcon };
  }
};

export const isSuccess = (status) => status > 199 && status < 299;

export const getStatusLabel = (status) => {
  switch (status) {
    case '1':
      return 'Generated';
    case '2':
      return 'Published';
  }
};

export const getTimeDiff = (updatedAt) => {
  const timeDiff = new Date(new Date() - new Date(updatedAt));
  const hours = timeDiff.getHours();
  const minutes = timeDiff.getMinutes();
  const exactHours = hours > 0 ? `${hours}h ` : '';
  const exactMinutes = minutes > 0 ? `${minutes}m ` : '';
  const timeDiffString = exactHours + exactMinutes + 'ago';
  return timeDiffString;
};
