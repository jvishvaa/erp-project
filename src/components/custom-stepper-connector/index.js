import StepConnector from '@material-ui/core/StepConnector';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';

const CustomStepperConnector = withStyles((theme) => ({
  root: {
    left: 'calc(-50% + 50px)',
    right: 'calc(50% + 50px)',
  },
  line: {
    '&::after': {
      content: '""',
      width: 15,
      height: 15,
      border: `2px solid ${theme.palette.primary.main}`,
      borderLeft: 0,
      borderBottom: 0,
      transform: 'rotate(45deg)',
      position: 'absolute',
      left: '45%',
      transformOrigin: '100% 0',
    },
  },
}))(StepConnector);

export default CustomStepperConnector;
