import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

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
      return { status: 'd-pending', color: '#ab6100', Icon: DeleteOutlineIcon };
    case '5':
      return { status: 'd-running', color: '#1f75cb', Icon: DeleteOutlineIcon };
    case '6':
      return { status: 'deleted', color: '#808080', Icon: DeleteOutlineIcon };
    case '7':
      return { status: 'd-failed', color: '#dd2b0e', Icon: DeleteOutlineIcon };
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
