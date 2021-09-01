import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  joinLimitWrapper: {
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    '& .joinLimitTag': {
      color: theme.palette.secondary.main,
      fontSize: '18px',
      fontWeight: '600',
      textAlign: 'center',
    },
    '& .joinLimitContainer': {
      marginTop: '20px',
      borderRadius: '10px',
      boxShadow: `0px 4px 10px 0px rgba(1, 75, 126, 0.2)`,

      '& .singleJoinLimit': {
        padding: '20px',
        cursor: 'pointer',
        fontSize: '16px',
        color: theme.palette.secondary.main,
        textAlign: 'center',
        background: '#ffffff',
        '&:first-child': {
          borderRadius: '10px 10px 0px 0px',
        },
        '&:last-child': {
          borderRadius: ' 0px 0px 10px 10px',
        },
      },

      '& .singleJoinLimitSelected': {
        padding: '20px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: '600',
        color: theme.palette.primary.main,
        textAlign: 'center',
        background: '#f3f3f3',
        '&:first-child': {
          borderRadius: '10px 10px 0px 0px',
        },
        '&:last-child': {
          borderRadius: ' 0px 0px 10px 10px',
        },
      },
    },
  },
}));

export default useStyles;
