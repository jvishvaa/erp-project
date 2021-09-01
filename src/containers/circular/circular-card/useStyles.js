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
  },
  content: {
    fontSize: '0.9rem',
  },
  textRight: {
    textAlign: 'right',
  },
  tooltiptext:theme.toolTipText,
  
  tooltip: {
    display: "flex",
    backgroundColor: "#F9F9F9",
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    marginBottom: "10%",
  }
}));

export default useStyles;
