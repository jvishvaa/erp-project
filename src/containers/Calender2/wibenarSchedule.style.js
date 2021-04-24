export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  firstHead: {
    display: '-webkit-box',
    maxWidth: '200px',
    '-webkit-line-clamp': '2',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  square: {
    color: '#fff',
    // borderRadius: 0,
    width: '150px',
    height: '150px',
    marginTop: theme.spacing(1),
    alignItems: 'center',
    display: 'inline-block',
  },
  paper: {
    border: 'none',
    padding: theme.spacing(2, 4, 3),
    '&:hover': {
      boxShadow: '5px 5px 10px 10px grey',
      transition: 'all 1s ease',
      borderRadius: '10px',
      // transitionDelay: "1s"
    },
  },
  updateButton: {
    marginTop: '12px',
  },
  tableMargin: {
    marginBottom: '10px',
  },
  textField: {
    width: '100%',
  },
  imageAlignment: {
    textAlign: 'center',
    padding: '20px',
    float: 'center',
    alignItems: 'center',
    display: 'inline-block',
  },
});
