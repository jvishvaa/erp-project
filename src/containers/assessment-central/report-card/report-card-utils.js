import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import RestoreIcon from '@material-ui/icons/Restore';

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
    case '4':
      return { status: 'reverted', color: '#383838', Icon: RestoreIcon };
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
