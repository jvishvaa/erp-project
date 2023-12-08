import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #E2E2E2',
    padding: '0.9rem',
    borderRadius: '10px',
    width: '100%',
    boxShadow: 'none',
  },
  backgroundColor: {
    backgroundColor: theme.palette.primary.primarylightest
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
    fontSize: '0.9rem',
  },
  textRight: {
    textAlign: 'right',
  },
  tooltiptext: theme.toolTipText,
  verifiedColor: {
    background: theme.palette.primary.primarylightest
  },
  notverified: {
    background: "#fff"
  },
  checkCentral: {
    // color: theme.palette.primary.primarylightest,
    color: 'lightestprimary',
    fontSize: "0.99rem"
  },
  checkCentralNot: {
    // color: theme.palette.primary.main,
    color: 'primarytemp',
    fontSize: "0.99rem"
  },
  identifier_icon:{
    marginRight:"30px",
    height:"25px",
    width:"25px"
  },
  "@media screen":{

    printContent:{
      display:"none"
    }
  }
}));

export default useStyles;
