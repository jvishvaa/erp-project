import { Hidden } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

const drawerWidth = 315;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  rootColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 200,
    backgroundColor: '#ffffff',
    color: theme.palette.secondary.main,
    boxShadow: 'none',
  },
  footerBar: {
    backgroundColor: '#ffffff',
    color: theme.palette.secondary.main,
    // boxShadow: 'none',

    // height: '100px',
    // backgroundColor: theme.palette.primary.primarylightest,
    // marginTop: '10%',
  },
  searchInputContainerMobile: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '30px',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: '100%',
    boxShadow: 'none',
    borderBottom: '1px solid lightgray',
    height: '40px',
    marginBottom: '5%',
  },
  searchDropdownMobile: {
    width: '85%',
    margin: 'auto !important',
  },
  searchInputContainer: {
    //display: 'flex',
    alignItems: 'center',
    border: '0.5px solid #9A9A9A',
    borderRadius: '26px',
    width: '50%',
    boxShadow: 'none',
    //borderBottom: '1px solid lightgray',
    height: '40px',
    marginTop: '5px',
    marginLeft: '370px',
  },
  searchInputMobile: {
    // color: 'white',
    // background: '#ff6b6b',
    height: '40px',
    marginBottom: '1%',
    width: '100%',
  },
  searchInput: {
    padding: '2px 10px',
    flex: 1,
    // color:'#FFCDCD'
  },
  searchIconButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    //background: theme.palette.primary.main,
    borderRadius: 'inherit',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    // color: '#FF9898',
    height: '40px',
  },
  clearIconButtonMobile: {
    color: '#ffffff',
    background: theme.palette.primary.main,
    borderRadius: '0%',
    height: '40px',
    marginLeft: '-1%',
    // marginRight: '-1%',
    marginBottom: '1%',
  },
  clearIconButton: {
    color: '#ffffff',
    background: theme.palette.primary.main,
    borderRadius: '26px',
    height: '40px',
    float: 'right',
    // marginLeft: '150px',
    marginRight: '-1px',
    marginTop: '-1px',
    marginBottom: '1px',
    // marginBottom: '1%',
  },
  searchIconButtonMobile: {
    background: '#ffffff',
    borderRadius: 'inherit',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    color: theme.palette.primary.main,
    height: '40px',
  },
  logoBtn: {
    height: theme.mixins.toolbar.minHeight,
    padding: '0px 15px 0px 60px',
    //fontSize:'70px'
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
    top: '8px',
    right: '25px',
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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    background: theme.palette.primary.main,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    zIndex: theme.zIndex.drawer + 500,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('xs')]: { width: '100vw' },
  },
  drawerPaperClose: {
    zIndex: theme.zIndex.drawer + 500,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: '66px',
    },
    [theme.breakpoints.down('xs')]: { display: 'none' },
  },
  drawerContainer: {
    overflow: 'auto',
  },
  menuItemIcon: {
    '& .MuiSvgIcon-root': {
      color: '#ffffff',
    },
  },
  menuItemText: {
    color: '#ffffff',
  },
  appBarSpacer: {
    // minHeight: theme.mixins.toolbar.minHeight,
    minHeight: '64px',
  },
  content: {
    // flexGrow: 1,
    height: '100vh',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100vw - ${theme.spacing(7) + 1}px)`,
    },
    [theme.breakpoints.down('xs')]: { width: '100vw' },
    overflow: 'hidden',
  },
  search: {
    position: 'relative',
    //backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      //backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    borderRadius: '30px',
    width: '550px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  grow: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  sectionDesktop: {
    display: 'none',
    color: '#FF6B6B',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      color: '#FF6B6B',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  notificationNumber: {
    color: '#ffffff',
  },
  mobileToolbar: {
    display: 'none',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  logoMobileContainer: {
    padding: 0,
  },
  logoMObile: {
    width: '40px',
  },
  menuControlContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  container: {
    paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1),
    paddingLeft: 0,
    paddingRight: 0,
    // height: `calc(100% - 0px)`,
    height: `calc(100% - 64px)`,
    overflow: 'auto',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  desktopToolbarComponents: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  expandIcons: { marginLeft: '2rem', color: '#ffffff' },
  profileInfoContainer: {
    backgroundColor: theme.palette.primary.main,
    padding: '10px',
  },
  sidebarActionButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#ffffff',
    padding: '10px',
  },
  notificationsIcon: {
    alignItems: 'center',
    color: '#FF6B6B',
    fontSize: '42px',
  },
  loginAvatar: {
    // margin:'auto',
    position: 'relative',
    left: '-40px',
  },
  hideIcon: {
    display: 'none',
  },
}));

export default useStyles;
