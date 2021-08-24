import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  timeSlotWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    '& .timeSlotTag': {
      width: '15%',
      color: theme.palette.secondary.main,
      fontSize: '18px',
      fontWeight: '600',
      textAlign: 'center',
      alignSelf: 'center',
      marginRight: '2%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: '2%',
      },
      '& .timeSlotValue': {
        margin: '1%',
        fontSize: '16px',
        fontWeight: '600',
        color: theme.palette.secondary.main,
        textAlign: 'left',
        width: '10%',
        '&::before': {
          content: ' ',
          display: 'inline-block',
          width: 0,
          height: 0,
          borderTop: `5px solid ${theme.palette.secondary.main}`,
          borderBottom: `5px solid ${theme.palette.primary.main}`,
          borderRight: `5px solid ${theme.palette.secondary.main}`,
          borderLeft: `5px solid ${theme.palette.primary.main}`,
          marginRight: '10%',
        },
        [theme.breakpoints.down('sm')]: {
          width: '30%',
        },
      },
    },
  },
}));

export default useStyles;
