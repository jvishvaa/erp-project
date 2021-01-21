export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  text: {
    padding: theme.spacing(1, 2, 1)
  },
  paper: {
    padding: theme.spacing(1, 2, 1),
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper
  },
  postpaper: {
    padding: theme.spacing(1, 2, 1),
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      boxShadow: '5px 5px 10px 10px grey',
      transition: 'all 1s ease',
      borderRadius: '10px'
      // transitionDelay: "1s"
    }
  },
  modelpaper: {
    padding: theme.spacing(1, 2, 1),
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
    maxHeight: 500,
    maxWidth: 900,
    overflow: 'auto'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
  // closeButton: {
  //   position: 'absolute',
  //   right: theme.spacing(1),
  //   top: theme.spacing(1)
  //   // color: theme.palette.grey[500]
  // }
})
