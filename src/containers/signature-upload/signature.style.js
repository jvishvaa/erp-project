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
    color: '#ff6b6b',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  table: {
    minWidth: 650,
  },
  modal: {
    overflow: true,
    marginTop: '50px',
    padding: theme.spacing(1, 2, 1, 2),
  },
  paper1: {
    border: 'none',
    padding: theme.spacing(2, 4, 3),
  },
  textBox: {
    padding: theme.spacing(1, 2, 1),
    border: '1px solid white',
    width: '400px',
    maxHeight: '400px',
    overflow: 'auto',
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
});
