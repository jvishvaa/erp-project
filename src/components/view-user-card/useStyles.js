import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    padding: '1rem',
    margin: '20px 0',
    '&:last-child': {
      marginBottom: '60px',
    },
  },
  title: {
    fontSize: '1.2rem',
  },
  content: {
    fontSize: '1rem',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
  },
  textRight: {
    textAlign: 'right',
  },
}));

export default useStyles;
