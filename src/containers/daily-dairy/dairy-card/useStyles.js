import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #E2E2E2',
    padding: '0.9rem',
    borderRadius: '10px',
    width: '105%',
    boxShadow: 'none',
    backgroundColor: '#FFFDE8',
  },
  selectedRoot: {
    border: `1px solid ${theme.palette.primary.main}`,
    background: theme.palette.primary.primarylightest,
    padding: '0.9rem',
    borderRadius: '10px',
    width: '105%',
  },
  title: {
    fontSize: '1.1rem',
    color: theme.palette.secondary.main,
  },
  content: {
    fontSize: '0.9rem',
  },
  textRight: {
    textAlign: 'right',
  },
    toolTipText : theme.toolTipText,
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
