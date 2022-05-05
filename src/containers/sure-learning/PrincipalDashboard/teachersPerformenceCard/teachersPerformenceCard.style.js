export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1, 2, 1),
    backgroundColor: theme.palette.background.paper,
  },
  mcqmodal: {
    padding: theme.spacing(1, 2, 1),
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    marginTop: '24px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    float: 'right',
  },
});
