const resourceModalStyles = (theme) => ({
  container: {
    padding: '10px',
  },
  heading: {
    textAlign: 'center',
    marginTop: '10px',
    marginBottom: '10px',
  },
  uploadButton: {
    marginTop: '30px',
  },
  fileRow: {
    padding: '10px',
  },
  submitButton: {
    position: 'sticky',
    bottom: '10px',
    right: '10px',
  },
  description: {
    width: '90%',
    marginTop: '12px',
    marginBottom: '12px',
  },
  divider: {
    marginBottom: '10px',
    marginTop: '10px',
  },
});

const fileUploadButton = (theme) => ({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  fileInput: {
    fontSize: '100px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    opacity: 0,
  },
});

const fileRow = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
  icon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

export { fileUploadButton, resourceModalStyles, fileRow };
