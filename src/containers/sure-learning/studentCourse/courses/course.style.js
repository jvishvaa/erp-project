export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonPadding: {
    margin: '10px',
    padding: '10px',
  },
  typographyPadding: {
    margin: '15px',
    padding: '5px',
  },
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1, 2, 1),
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
    margin: '5px 0px',
    maxWidth: 'auto',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    marginTop: '5px',
  },
  image: {
    width: 128,
    height: 128,
    margin: '0px 10px',
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});
