export default (theme) => ({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block'
  },
  attachmentIcon: {
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
  },
  fileRow: {
    padding: '6px'
  },
  modalButtons: {
    position: 'sticky',
    width: '98%',
    margin: 'auto',
    bottom: 0
  }
})
