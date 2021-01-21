export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(1, 2, 1)
  },
  paperr: {
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(1, 2, 1),
    maxHeight: 500,
    overflow: 'auto'
  },
  root: {
    flexGrow: 1,
    overflow: 'auto'
  },
  paperrr: {
    paddingTop: 20,
    height: 150,
    width: 120,
    backgroundColor: theme.palette.background.paper
  },
  control: {
    padding: theme.spacing(2)
  },
  largeIcon: {
    width: 60,
    height: 60
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 500
  }
})
