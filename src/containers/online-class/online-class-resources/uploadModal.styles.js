const fileUploadStyles = (theme) => ({
  container: {
    margin: '10px'
  },
  heading: {
    textAlign: 'center',
    marginTop: '10px'
  },
  uploadButton: {
    marginTop: '30px'
  },
  fileRow: {
    padding: '10px'
  },
  submitButton: {
    // position: 'fixed',
    marginTop: '12px'
    // bottom: '5px',
    // right: '10px'
  },
  description: {
    width: '90%',
    marginTop: '12px',
    marginBottom: '12px'
  }
})

const fileUploadButton = (theme) => ({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block'
  },
  fileInput: {
    fontSize: '100px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    opacity: 0
  }
})

const fileRow = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  icon: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

export {
  fileUploadButton,
  fileUploadStyles,
  fileRow
}
