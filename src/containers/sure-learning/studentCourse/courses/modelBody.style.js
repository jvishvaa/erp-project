export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paper: {
    overflow: true,
    // backgroundColor: 'snow',
    padding: theme.spacing(1, 2, 1),
    backgroundColor: 'white',
    boxShadow: '1px 1px 5px 4px #ddd',
  },
  paperr: {
    overflow: true,
    marginTop: '20px',
    marginBottom: '20px',
    backgroundColor: 'snow',
    padding: theme.spacing(1, 2, 1),
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
  Box: {
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
  stepBtn: {
    color: '#a200ff',
    // backgroundColor: 'transparent',
    // borderBottom: '4px solid #4055b5',
    // borderRadius: '4px',
  },
  // stepBtn: {
  //   backgroundColor: 'transparent',
  //   paddingBottom: '20px',
  //   borderBottom: '4px solid #4055b5',
  //   borderRadius: '4px',
  // },
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
  card: {
    minWidth: 180,
    overflowX: 'scroll',
    marginBottom: 20,
  },
});
