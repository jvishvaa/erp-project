export default (theme) => ({
  root: {
    flexGrow: 1,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paper: {
    overflow: true,
    padding: theme.spacing(1, 2, 1),
    backgroundColor: 'snow',
  },
  paperr: {
    overflow: true,
    marginTop: '20px',
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
});
