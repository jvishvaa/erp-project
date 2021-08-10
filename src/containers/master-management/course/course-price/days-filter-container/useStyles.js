import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  daysFilterWrapper: {
    display: 'flex',
    flexDirection: 'column',
    '& .daysTag': {
      color: theme.palette.secondary.main,
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'center',
    },
    '& .daysDisplayWrapper': {
      marginTop: '20px',
      borderRadius: '10px',
      minHeight: '49vh',
      maxHeight: 'auto',
      boxShadow: `0 4px 10px 0px rgba(1, 75, 126, 0.2)`,

      '& .daysDisplayContainer': {
        width: '100%',
        margin: '5% 0 0 1%',
        '& .dayDisplay': {
          margin: '20px',
          fontSize: '16px',
          fontWeight: 600,
          color: theme.palette.secondary.main,
          textAlign: 'left',
          '&::before': {
            content: ' ',
            display: 'inline-block',
            width: 0,
            height: 0,
            borderTop: `5px solid ${theme.palette.secondary.main}`,
            borderBottom: `5px solid ${theme.palette.primary.main}`,
            borderRight: `5px solid ${theme.palette.secondary.main}`,
            borderLeft: `5px solid ${theme.palette.primary.main}`,
            marginRight: '5%',
          },
        },
      },
    },
    '& .filterContainer': {
      marginTop: '20px',
      borderRadius: '10px',
      minHeight: '49vh',
      maxHeight: 'auto',
      boxShadow: `0 4px 10px 0px rgba(1, 75, 126, 0.2)`,
      '& .comboDaysContainer': {
        padding: '20px 20px 60px 20px',
      },
      '& .otherDaysContainer': {
        padding: '20px',
      },
    },
  },
}));

export default useStyles;
