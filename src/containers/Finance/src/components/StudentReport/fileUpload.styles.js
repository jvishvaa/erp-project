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
    position: 'sticky',
    bottom: '10px',
    right: '10px'
  },
  note: {
    position: 'sticky',
    bottom: '5px',
    left: '5px'
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

export {
  fileUploadButton,
  fileUploadStyles
}
