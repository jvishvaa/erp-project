const styles = (theme) => ({
  root: {
    color: theme.palette.secondary.main,
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  sectionHeader: {
    fontSize: '1.3rem',
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
});

export default styles;
