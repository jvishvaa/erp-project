const styles = (theme) => ({
  root: {
    color: theme.palette.secondary.main,
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    // paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
    width: '95%',
    margin: '20px auto',
  },
  searchContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
    width: '95%',
    margin: '20px auto',
  },
  sectionHeader: {
    fontSize: '1.3rem',
    color: theme.palette.secondary.main,
    fontWeight: 600,
    width: '95%',
    margin: '20px auto',
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
    width: '95%',
    margin: '20px auto',
  },
  modulesContainer: {
    width: '95%',
    margin: '20px auto',
  },
  formContainer: {
    width: '95%',
    margin: '20px auto',
  },
});

export default styles;
