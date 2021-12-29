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
}));

export default useStyles;
