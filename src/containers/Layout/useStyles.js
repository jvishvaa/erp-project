import { fade, makeStyles } from '@material-ui/core/styles';
import { FilterNone } from '@material-ui/icons';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 200,
    backgroundColor: '#ffffff',
    color: theme.palette.secondary.main,
  },
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '30px',
    width: '70%',
  },
  searchInput: {
    padding: '2px 10px',
    flex: 1,
  },
  searchIconButton: {
    background: theme.palette.primary.main,
    borderRadius: 'inherit',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    color: '#ffffff',
  },
  logoBtn: {
    height: theme.mixins.toolbar.minHeight,
  },
  toolbar: {
    padding: '10px 15px',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    background: theme.palette.primary.main,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: drawerWidth,
    [theme.breakpoints.down('xs')]: { width: '100vw' },
  },
  drawerPaperClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    [theme.breakpoints.down('xs')]: { display: 'none' },
  },
  drawerContainer: {
    overflow: 'auto',
  },
  menuItemIcon: {
    color: '#ffffff',
  },
  menuItemText: {
    color: '#ffffff',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  search: {
    position: 'relative',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
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
    [theme.breakpoints.up('md')]: {
      display: 'flex',
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
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  desktopToolbarComponents: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  expandIcons: { marginLeft: '2rem', color: '#ffffff' },
}));

export default useStyles;
