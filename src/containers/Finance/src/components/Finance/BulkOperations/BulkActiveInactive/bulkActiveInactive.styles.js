export default (theme) => ({
  container: {
    width: '95%',
    margin: 'auto',
    marginTop: '5px'
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  downloadFormat: {
    color: theme.palette.primary.main,
    position: 'absolute',
    right: '15px',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})
