import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    padding: '1rem',
    borderRadius: '10px',
    width: '94%',
    margin: '1.5rem auto',
  },
  title: {
    fontSize: '1.1rem',
  },
  content: {
    fontSize: '0.9rem',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
  },
  textRight: {
    textAlign: 'right',
  },
}));

export default useStyles;
