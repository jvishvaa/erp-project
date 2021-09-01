import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
    '& th': {
      '&:not(:last-child)': {
        '&:after': {
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
  },
  container: {
    maxHeight: '70vh',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  teacherNameParent: {
    height: '6rem',
    overflowY: 'auto',
  },
  teacherNameChild: {
    width: '100%',
    '&::before': {
      content: '.',
      height: '6px',
      width: '6px',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '5px',
      verticalAlign: 'middle',
    },
    '&:hover': {
      transform: 'scale(1.1)',
      transitionDuration: '200ms',
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      '&::before': {
        transform: 'scale(1.3)',
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
}));

export default useStyles;
