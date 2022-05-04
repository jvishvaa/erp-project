export default (theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paper: {
    marginTop: '10px',
    padding: theme.spacing(1, 2, 1),
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    color: 'lightgray',
    padding: theme.spacing(1, 2, 1),
  },
  avatar: {
    fontSize: '50px',
    width: '90px',
    height: '90px',
  },
  typography: {
    color: 'black',
    marginTop: '10px',
  },
  textField: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  roott: {
    margin: 0,
    padding: theme.spacing(2),
  },
});
