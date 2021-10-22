export default (theme) => ({
  root: {
    flexGrow: 1,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  mcqmodal: {
    maxHeight: 700,
    overflow: 'auto',
    paddingTop: '50px',
  },
  paper: {
    overflow: true,
    padding: theme.spacing(1, 2, 1),
    backgroundColor: 'blue',
    color: 'white',
    marginTop: '10%',
  },
  paperr: {
    overflow: true,
    marginTop: '20px',
    padding: theme.spacing(1, 2, 1),
    backgroundColor: 'snow',
  },
  paperrr: {
    overflow: true,
    marginTop: '20px',
    backgroundColor: 'snow',
  },
  Typography: {
    marginTop: '15px',
    fontFamily: 'Charter Bd BT',
    color: 'darkslategray',
  },
  title: {
    fontFamily: 'Charter Bd BT',
    color: 'darkslategray',
    marginBottom: '10px',
  },
  box: {
    padding: theme.spacing(1, 2, 1),
    color: 'lavender',
  },
  TypographyText: {
    fontFamily: 'Charter Bd BT',
    color: 'darkslategray',
  },
  Mcqgrid: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    float: 'right',
  },
  mtfDiv: {
    width: '80%',
    margin: '0 auto',
    // border: "1px solid red",
    height: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3 , 1fr)',
    gridGap: '1rem',
  },
  mtfRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0.7rem',
  },
  stepBtn: {
    color: '#a200ff',
    // backgroundColor: 'transparent',
    // borderBottom: '4px solid #4055b5',
    // borderRadius: '4px',
  },
  rootS: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: 'green',
    zIndex: 1,
    fontSize: 35,
  },
  wrong: {
    color: 'red',
    zIndex: 1,
    fontSize: 35,
  },
  contentStyle: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper2: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
});
