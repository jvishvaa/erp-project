import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  btn: {
    width: '100%',
    background: '#ECECEC',
    color: theme.palette.secondary.main,
    margin: 4,
  },
  closeBtn: {
    padding: '0.3rem 1.1rem',
    borderRadius: '0.6rem',
    fontSize: '0.8rem',
  },
  questionCotainer: {
    color: theme.palette.secondary.main,
    margin: '10px 0px',
    '& *': {
      //   border: '1px solid red',
    },
  },
  questionText: {
    background: '#ECECEC',
    padding: 4,
    display: 'flex',
    alignItems: 'top',
  },
  answersContainer: {
    padding: 2,
    width: '90%',
    margin: 'auto',
  },
}));
export default useStyles;
