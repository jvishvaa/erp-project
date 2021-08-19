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
  paper: {
    borderRadius: '10px',
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
  cardWrapper: {
    display: 'flex',
    padding: '15px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
      background: '#FCEEEE',
      cursor: 'pointer',
    },
  },
  cardTitleHeading: {
    margin: 2,
    color: theme.palette.primary.main,
  },
  cardDescription: {
    margin: 2,
    color: theme.palette.secondary.main,
  },
  cardQuestionNumber: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginRight: '5px',
  },
  cardAttemptedTextRed: {
    color: theme.palette.primary.main,
  },
  cardAttemptedTextGreen: {
    color: '#168D00',
  },
  cardEasyWrapper: {
    fontWeight: 'bold',
    marginTop: 7,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStartButton: {
    // background: '#FF6B6B',
    // borderRadius: '10px',
    padding: '0.3rem 1.1rem',
    borderRadius: '0.6rem',
    fontSize: '0.8rem',
  },
}));

export default useStyles;
