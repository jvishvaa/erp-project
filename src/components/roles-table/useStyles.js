import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  columnHeader: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: '1rem',
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
}));

export default useStyles;
