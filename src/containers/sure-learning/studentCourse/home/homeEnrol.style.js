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
  Box: {
    padding: theme.spacing(1, 2, 1),
    color: 'lavender',
  },
  TypographyText: {
    fontFamily: 'Charter Bd BT',
    color: 'darkslategray',
  },
  video: {
    objectFit: 'inherit',
    // : "cover"
  },
});
