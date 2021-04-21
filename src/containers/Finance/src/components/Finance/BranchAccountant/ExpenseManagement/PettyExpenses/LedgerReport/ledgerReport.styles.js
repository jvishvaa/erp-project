export default (theme) => ({
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  typography: {
    marginTop: theme.spacing.unit * 2 + 'px !important',
    marginLeft: '5px !important'
  },
  mainContainer: {
    padding: '5px'
  },
  searchBox: {
    margin: '0px'
  },
  table: {
    width: '110vw',
    minWidth: '900px'
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: theme.spacing.unit * 2
  },
  hover: {
    cursor: 'pointer'
  },
  footerRow: {
    position: 'relative'
  },
  paginationRoot: {
    position: 'absolute',
    right: '50px'
  },
  tableLastCell: {
    borderBottom: '0px'
  }
})
