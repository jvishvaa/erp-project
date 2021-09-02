import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',
    padding: '0.9rem',
    borderRadius: '10px',
    // width: '100%',
    boxShadow: 'none',
    marginLeft: 20,
  },
  selectedRoot: {
    border: `1px solid ${theme.palette.primary.main}`,
    background: theme.palette.primary.primarylightest,
    padding: '0.9rem',
    borderRadius: '10px',
    width: '100%',
  },
  title: {
    fontSize: '1.1rem',
  },
  content: {
    marginTop: '15px',
    fontSize: '0.9rem',
  },
  textRight: {
    textAlign: 'right',
  },
  gridLayout: {
    display: 'flex',
  },
  tooltiptext: theme.toolTipText,
  duplicate: {
    minWidth: "90px",
    fontWeight: 600,
    background: theme.palette.primary.main,
    color: "white"
  }

}));

export default useStyles;
