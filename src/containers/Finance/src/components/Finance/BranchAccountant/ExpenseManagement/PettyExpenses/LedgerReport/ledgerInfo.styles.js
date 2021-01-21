export default (theme) => ({
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  header: {
    textAlign: 'center'
  },
  tableHeader: {
    marginBottom: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  downloadWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  downloadBtn: {
    backgroundColor: '#a4a4a4'
  },
  downloadLink: {
    color: '#0099ff',
    '&:hover': {
      color: '#006bb3',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})
