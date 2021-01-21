export default (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  branchSelect: {
    marginBottom: '15px'
  },
  uploadButton: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    top: '15px',
    marginTop: '20px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  fileInput: {
    fontSize: '100px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    opacity: 0
  }
})
