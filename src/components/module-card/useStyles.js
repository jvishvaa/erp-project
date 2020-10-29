import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardHeader: {
    fontSize: '1.3rem',
    color: theme.palette.secondary.main,
  },
  columnHeader: {
    fontSize: '1rem',
    color: theme.palette.secondary.main,
    fontWeight: 600,
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
  tableCell: {
    padding: 0,
  },
}));

export default useStyles;
