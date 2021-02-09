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
  cardWrapper: {
    display: 'flex',
    padding: '15px',
    justifyContent: 'space-around',
    '&:hover': {
      background: '#FCEEEE',
      cursor: 'pointer',
    },
  },
  cardTitleHeading: {
    marginTop: '0px',
    color: '#FF6B6B',
  },
  cardQuestions: {
    marginTop: '0px',
    color: '#014B7E',
  },
  cardQuestionNumber: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginRight: '5px',
  },
  cardAttemptedText: {
    color: '#168D00',
  },
  cardEasyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDifficulty: {
    width: '40px',
    height: '40px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '50%',
    border: '3px solid #bebebe',
    color: '#fff',
    background: 'green',
  },
  cardStartButton: {
    // background: '#FF6B6B',
    borderRadius: '10px',
  },
}));

export default useStyles;
