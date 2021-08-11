import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #E2E2E2',
    padding: '0.9rem',
    borderRadius: '10px',
    width: '105%',
    boxShadow: 'none',
  },
  selectedRoot: {
    border: `1px solid ${theme.palette.primary.main}`,
    background: '#FCEEEE',
    padding: '0.9rem',
    borderRadius: '10px',
    width: '105%',
  },
  title: {
    fontSize: '1.1rem',
    color: '#014B7E',
  },
  content: {
    fontSize: '0.9rem',
  },
  textRight: {
    textAlign: 'right',
  },
}));

export default useStyles;
