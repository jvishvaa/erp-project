import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: '10px',
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
    minHeight: '60vh',
    maxHeight: '80vh',
  },
  containerGenerated: {
    minHeight: '43vh',
    maxHeight: '60vh',
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
  mappingTag: {
    height: '43vh',
    color: theme.palette.secondary.main,
    fontSize: 'medium',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default useStyles;
