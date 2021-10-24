export default (theme) => ({
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    typographys: {
      paddingTop: '100px',
      textAlign: 'center',
    },
    root: {
      flexGrow: 1,
      width: '100%',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    table: {
      minWidth: 650,
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      width: '100%',
      border: 'none',
      textAlign: 'center',
      padding: theme.spacing(2, 4, 3),
      '&:hover': {
        boxShadow: '5px 5px 10px 10px grey',
        transition: 'all 1s ease',
        borderRadius: '10px',
        // transitionDelay: "1s"
      },
    },
    notesPaper: {
      width: '100%',
      padding: theme.spacing(2, 4, 3),
      '&:hover': {
        boxShadow: '2px 2px 5px 5px grey',
        borderRadius: '10px',
      },
    },
    paper1: {
      backgroundColor: 'lightsteelblue',
      padding: theme.spacing(1, 2, 1),
    },
    paper2: {
      padding: theme.spacing(1, 2, 1),
    },
    paper3: {
      '&:hover': {
        boxShadow: '5px 5px 10px 10px grey',
        transition: 'all 1s ease',
        borderRadius: '10px',
      },
    },
    LearningModule: {
      width: '100%',
      height: '150vh',
      backgroundColor: '#bada55',
    },
    LeanrningFullModule: {
      width: '100%',
      backgroundColor: '#bada55',
    },
    textBox: {
      padding: theme.spacing(1, 2, 1),
      border: '1px solid white',
      width: '400px',
      maxHeight: '400px',
      overflow: 'auto',
    },
  });
  