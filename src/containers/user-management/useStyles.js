import { makeStyles } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  divider: {
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  imageUploadBtn: {
    height: '30px',
    width: '50px',
    backgroundColor: '#ff6b6b',
    padding: '15px',
    fontSize: '16px',
    color: '#ffffff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  formActionButtonContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  formActionButton: {
    color: '#ffffff',
  },
});

const useStyles = makeStyles(styles);

export { styles, useStyles };
