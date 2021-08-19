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
  stepper: {
    backgroundColor: '#fafafa',
  },
  stepLabel: {
    color: `${theme.palette.primary.main} !important`,
  },
  phoneNumber:{
    backgroundColor:'transparent',
  },
  descriptionBorder:{
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    marginLeft: "2.3125rem",
    marginRight: "2.3125rem",
    opacity:1,
},  
acceptedfiles:{
  color: theme.palette.secondary.main,
  fontSize: '16px',
  marginLeft: '28px',
  marginTop: '8px',
},
attchmentbutton:{
  textTransform: "none",
  background: "white",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "10px",
  marginLeft: "1.75rem",
}
});

const useStyles = makeStyles(styles);

export { styles, useStyles };
