export default (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    overflow: true,
    padding: theme.spacing(2),
    //   textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      borderRadius: '10px',
      boxShadow: '2px 2px 10px lightgrey',
    },
  },
  typ2: {
    marginTop: '10px',
    align: 'center',
  },
  typ1: {
    marginTop: '5px',
  },
  typ: {
    marginTop: '5px',
  },
  grid: {
    '&:hover': {
      boxShadow: '5px 5px 10px 10px grey',
      transition: 'all 1s ease',
      borderRadius: '10px',
      // transitionDelay: "1s"
    },
  },
  // buttonHover:{
  //   "&:hover":{
  //     boxShadow:'1px 1px 1px 4px darkblue',
  //     transition: "all 1s ease",
  //     // borderRadius : "10px"
  //     // transitionDelay: "1s"
  //   }
  // }
});
