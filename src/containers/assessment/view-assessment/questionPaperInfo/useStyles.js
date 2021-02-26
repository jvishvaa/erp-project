import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: '15px',
    padding: 0,
    background: '#fafafa',
  },
  testInfo: {
    borderRadius: '15px',
  },
  testInfoHeader: {
    borderRadius: '15px 15px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fceeee',
  },
  cardTitleHeading: {
    margin: 0,
    marginTop: 2,
    color: '#FF6B6B',
  },
  cardDescription: {
    margin: 0,
    color: '#014B7E',
  },
  cardDate: {
    color: '#168D00',
    fontWeight: 'bold',
    whiteSpace: 'pre-line',
    textAlign: 'right',
    marginTop: 20,
  },
  // cardWrapper: {
  //   display: 'flex',
  //   padding: '15px',
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   '&:hover': {
  //     background: '#FCEEEE',
  //     cursor: 'pointer',
  //   },
  // },
  analysisWrapper: {
    padding: 5,
    [theme.breakpoints.up('md')]: {
      maxHeight: '50vh',
      overflowX: 'hidden',
      overflowY: 'auto',
      margin: '10px 0px',
    },
  },
  analysisContainer: {
    padding: 10,
    // #cfd5fe #f2c6ff
    backgroundImage: 'linear-gradient(to right, #cfd5fe , #f2c6ff)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // border: '1px solid red',
    alignItems: 'center',
    '& > *': {
      // border: '1px solid red',
      flex: 1,
    },
  },
  marksBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    // border: '1px solid green',
  },
  marksBar: {
    background: '#FEEFA9',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    margin: 4,
    padding: 0,
    color: '#004770',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    '& > div:first-child': {
      padding: '7px 5px',
      background: '#FEEFA9',
      border: '1px solid #FEEFA9',
      flexBasis: '75%',
      borderRadius: '5px 0 0 5px',
    },
    '& > div:last-child': {
      borderRadius: '0 5px 5px 0 ',
      paddingTop: '7px',
      paddingBottom: '7px',
      background: '#ffffff',
      border: '1px solid #ffffff',
      flexBasis: '25%',
      textAlign: 'center',
    },
  },
  toddlerContainer: {
    // border: '1px solid red',
    display: 'flex',
    // padding: 20,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  toddlerWrapper: {
    // border: '5px solid green',
    flex: 1,
    margin: 'auto',
    display: 'flex',
    '& > img': {
      width: '100%',
      height: 'auto',

      // minWidth: '70px',
      // minHeight: '100px',

      // maxWidth: '150px',
      // maxHeight: '208px',

      maxWidth: '200px',
      objectFit: 'contain',
      margin: 'auto',
      textAlign: 'center',
    },
  },
  scoreBoard: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  scoreContainer: {},
  scoreGain: {
    // letterSpacing: '0.2rem',
    fontWeight: 'bold',
    // fontSize: '2.5rem',
    fontSize: '2.3rem',
    color: '#004770',
    borderRadius: '10px 10px 0 0',
    border: '2px solid #004770',
    margin: '1.2rem',
    marginBottom: 0,
    borderBottom: 'none',
    textAlign: 'center',
  },
  scoreOutOf: {
    border: '1px solid #004770',
    background: '#004770',
    borderRadius: '4px',
    color: 'white',
    padding: '0.25rem 0.9rem',
    fontSize: '1.4rem',
  },
  timeTakenContainer: {
    marginTop: 4,
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  timeTakenLabel: {
    color: '#004770',
    fontSize: '1rem',
    fontWeight: 'normal',
  },
  timeTaken: {
    color: '#004770',
    fontSize: '1.4rem',
    // border: '1px solid red',
    borderRadius: '5px',
    // padding: 2,
    padding: '2px 5px',
    background: 'white',
  },
  timeUnits: {
    fontWeight: 'normal',
    fontSize: '0.9rem',
  },
}));

export default useStyles;
