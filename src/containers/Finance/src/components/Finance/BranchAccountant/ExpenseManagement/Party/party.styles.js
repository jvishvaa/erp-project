export default (theme) => ({
  editIcon: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  deleteIcon: {
    marginLeft: '5px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  buttonContainer: {
    position: 'relative',
    marginTop: '15px',
    marginBottom: '50px'
  },
  button: {
    position: 'absolute',
    right: '15px'
  },
  modalHeader: {
    textAlign: 'center'
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  modalButtonContainer: {
    marginTop: '30px',
    position: 'relative'
  },
  modalButton: {
    position: 'absolute',
    right: theme.spacing.unit * 2
  },
  deleteBtnContainer: {
    position: 'relative',
    marginTop: '30px'
  },
  backBtn: {
    position: 'absolute',
    left: '15px'
  },
  deleteBtn: {
    position: 'absolute',
    right: '15px'
  }
})
