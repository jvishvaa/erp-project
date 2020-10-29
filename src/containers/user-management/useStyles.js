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
});

const useStyles = makeStyles(styles);

export { styles, useStyles };
