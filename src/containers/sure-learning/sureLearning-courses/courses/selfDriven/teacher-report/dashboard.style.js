export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
    width: '100%',
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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
