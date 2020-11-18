import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    padding: '1rem',
    margin: '1rem 0',
  },
  title: {
    fontSize: '1.2rem',
  },
  content: {
    fontSize: '1rem',
  },
  textRight: {
    textAlign: 'right',
  },
}));

export default useStyles;
