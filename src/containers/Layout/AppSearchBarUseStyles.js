import { Hidden } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

const AppSearchBarUseStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 200,
      backgroundColor: '#ffffff',
      color: theme.palette.secondary.main,
      boxShadow: 'none',
    },
    desktopToolbarComponents: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    searchBar:{
      justifyContent:'flex-end',
      alignItems:'flex-end',
      display:'flex',
      width:'100%',
      position:'relative',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    toolbar: {
      // padding: '10px 15px 0px 60px',
      maxHeight: '64px',
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        minHeight: '64px',
      },
      [theme.breakpoints.up('sm')]: {
        minHeight: '64px',
      },
      justifyContent: 'space-between',
    },
    logoBtn: {
      // height: theme.mixins.toolbar.minHeight,
      // padding: '0px 15px 0px 60px',
      //fontSize:'70px'
    },
    mobileToolbar: {
      display: 'none',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        position:'absolute'
      },
    },
    logoMobileContainer: {
      padding: 0,
    },
    logoMObile: {
      width: '40px',
    },
    verticalLine:{
      background: '#545454',
    },
    inputButton: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
      padding: '0px 30px 0px 20px',
      // border:'1px solid black'
    },
    schoolLogoBtn: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
      //height: theme.mixins.toolbar.minHeight,
      //padding: '5px 45px 0px 0px',
      // fontSize:'45px',
      // height:'70px'
      //float:'left'
      position: 'relative',
      // top:'8px',
      // right:'25px'
    },
    clearIconButton: {
      color: '#ffffff',
      background: theme.palette.primary.main,
      borderRadius: '26px',
      float: 'right',
      // marginLeft: '150px',
      // marginRight: '-1px',
      //  marginTop:'-1px',
      //  marginBottom:'1px'
      // marginBottom: '1%',
      width:'42px',
      height:'42px',
    },
    grow: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      //   backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        // backgroundColor: alpha(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: 'auto',
      // border: '0.5px solid #9A9A9A',
      // borderRadius: '26px',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '500px',
      },
    },
    searchInputContainer: {
      //display: 'flex',
      // alignItems: 'center',
      border: '0.5px solid #9A9A9A',
      borderRadius: '26px',
      // width: '50%',
      boxShadow: 'none',
      //borderBottom: '1px solid lightgray',
      // height: '40px',
      // marginTop:'5px',
      // marginLeft:'370px',
    },
    searchInput: {
      padding: '2px 10px',
      flex: 1,
      color: '#FFCDCD',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color:theme.palette.primary.main
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      padding: '0px 15px 0px 20px',
      display: 'none',
      color: '#FF6B6B',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        color: '#FF6B6B',
      },
    },
    sectionMobile: {
      display: 'flex',
      marginRight:'12px',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }));

  export default AppSearchBarUseStyles;
