import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      margin: theme.spacing(1, 'auto'),
    },
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  otpButton: {
    margin: theme.spacing(2, 0, 2),
    '& .MuiButton-label': {
      postion: 'relative',
    },
  },
  timerCover: {
    position: 'absolute',
    textAlign: 'center',
    width: '0%',
    height: '90%',
    borderRadius: '10px 0px 0px 10px',
    left: '0',
    marginLeft: '0.5%',
    // top: '0',
    // bottom: '0',
  },
  timerText: {
    zIndex: 1,
  },
  resendOtpButton: {
    '&:hover': {
      cursor: 'pointer',
      // textDecoration: 'underline',
    },
  },
  forgot: {
    fontSize: '1.1428571428571428rem',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    fontWeight: '400',
    lineHeight: '1.5',
    letterSpacing: '0.00938em',
    color: theme.palette.secondary.main,
    textAlign: 'center',
    cursor: 'pointer',
  },
}));
