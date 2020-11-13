import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#ffffff',
    padding: '10px',
    backgroundColor: theme.palette.primary.main,
  },
  profileImg: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
  },
  title: {
    fontSize: '1.2rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    margin: '2px 0',
  },
  subTitle: {
    fontSize: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    margin: '2px 0',
  },
}));

export default useStyles;
