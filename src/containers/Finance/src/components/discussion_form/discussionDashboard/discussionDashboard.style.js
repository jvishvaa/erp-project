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
    backgroundColor: theme.palette.background.paper
  },
  paper1: {
    padding: theme.spacing(1, 2, 1),
    backgroundColor: 'pink'
  },
  paper2: {
    padding: theme.spacing(1, 2, 1),
    backgroundColor: '#fff5ba'
  },
  paper3: {
    padding: theme.spacing(1, 2, 1),
    backgroundColor: '#d1fbff'
  },
  postpaper: {
    '&:hover': {
      boxShadow: '2px 2px 3px 3px grey',
      transition: 'all 0s ease',
      borderRadius: '3px'
    },
    cursor: 'pointer'
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
