const styles = (theme) => ({
  root: {
    color: theme.palette.secondary.main,
    width: 'calc(100% - 40px)',
    margin: '20px',
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    // paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
    // width: 'calc(100% - 20px)',
  },
  searchContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
    // width: 'calc(100% - 20px)',
    // margin: '20px',
  },
  sectionHeader: {
    fontSize: '1.3rem',
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  rolesTableContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  roleCardsContainer: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  roleCardsPagination: {
    width: '100%',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  divider: {
    width: '100%',
    margin: '20px 0',
  },
  modulesContainer: {
    width: '100%',
    margin: '20px 0',
  },
  formContainer: {
    width: '100%',
    margin: '20px 0',
  },
  spacer: {
    width: '100%',
    margin: '20px 0',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
    color: theme.palette.secondary.main,
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
});

export default styles;
