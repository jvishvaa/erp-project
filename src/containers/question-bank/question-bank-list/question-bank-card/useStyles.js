import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',
    borderColor: '#E2E2E2',
    padding: '0.9rem',
    borderRadius: '10px',
    width: '105%',
    boxShadow: 'none',
  },
  selectedRoot: {
    border: '1px solid',
    borderColor: '#ff6b6b',
    background: '#FCEEEE',
    padding: '0.9rem',
    borderRadius: '10px',
    width: '105%',
  },
  title: {
    fontSize: '1.1rem',
  },
  content: {
    fontSize: '0.9rem',
  },
  textRight: {
    textAlign: 'right',
  },
  dailog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogPaper: {
    minHeight: '45vh',
    maxHeight: '45vh',
  },
  dgsize: {
    width: '100%',
  },
}));

export default useStyles;
