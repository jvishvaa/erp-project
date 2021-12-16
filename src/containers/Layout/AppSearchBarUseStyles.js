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
    boxShadow: '0px 1px 2px -1px rgb(0 0 0 / 8%), 0px 2px 3px 0px rgb(0 0 0 / 0%), 0px 1px 8px 0px rgb(0 0 0 / 4%)',
  },
  desktopToolbarComponents: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  searchBar: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    display: 'flex',
    width: '50%',
    position: 'relative',
    // [theme.breakpoints.down('sm')]: {
    //   display: 'none',
    // },
  },
  searchBar1: {
    justifyContent: 'center',
    alignItems: 'center',
    top: '8px',
    display: 'flex',
    // marginLeft : '15px',
    width:'100%',
    position: 'relative',
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
      position: 'absolute',
    },
  },
  logoMobileContainer: {
    padding: 0,
  },
  logoMObile: {
    width: '32px',
  },
  verticalLine: {
    background: '#bbbbbb8a',
    height: '40px',
    padding: '1px',
    margin: '5px 20px 0px',
  },
  inputButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '0px 0 0px 10px',
    // border:'1px solid black'
  },
  SchoolName:{
    width:200,
    textShadow: `1px 1px ${theme.palette.secondary.main}47`,
    fontWeight:800,
    whiteSpace:'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  schoolLogoBtn: {
    height: '40px',
    width: '40px',
    objectFit: 'fill',
    borderRadius: '50%',
    position: 'relative',
    boxShadow: `0 0 3px -2px ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    //height: theme.mixins.toolbar.minHeight,
    //padding: '5px 45px 0px 0px',
    // fontSize:'45px',
    // height:'70px'
    //float:'left'
    // top:'8px',
    // right:'25px'
  },
  clearIconButton: {
    color: '#ffffff',
    // background: '#fafafa',
    borderRadius: '10px',
    float: 'right',
    // marginLeft: '150px',
    // marginRight: '-1px',
    //  marginTop:'-1px',
    //  marginBottom:'1px'
    // marginBottom: '1%',
    width: '42px',
    height: '42px',
  },
  grow: {
    width:'8%',
    display: 'flex',
    justifyContent: 'center',
    marginLeft:5
  },
  year: {
    fontSize:'1rem',
  },
  AcademicYearAuto:{
    color:'#afafaf',
    '&:hover': {
      color:'#afafaf',
    },
  },
  AcademicYear:{
    background:'#f8f7fd',
    borderRadius:10,
    width: '100%',
    color:'#afafaf',
    '&:hover': {
      color:'#afafaf',
    },
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
    // marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    // border: '0.5px solid #9A9A9A',
    // borderRadius: '26px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '375px',
      // margin:'auto'
    },
  },
  searchInputContainer: {
    border: '0.5px solid #e5e8ec',
    borderRadius: '10px',
    minWidth: '75%',
    boxShadow: 'none',
    background:'#f8f7fd',
  },
  searchInputContaineronFocus:{
    border: '0.5px solid #e5e8ec',
    borderRadius: '10px',
    minWidth: '75%',
    boxShadow: 'none',
    background:'#fff',
  },
  searchInputContainer1: {
    border: '0.5px solid #e5e8ec',
    borderRadius: '10px',
    width: '100%',
    boxShadow: 'none',
    background:'#f8f7fd',
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
    color: theme.palette.primary.main,
  },
  searchIcononFocus: {
    color: '#c1c1c1',
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
    padding: '0px 15px 0px 0px',
    display: 'none',
    color: '#FF6B6B',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      color: '#FF6B6B',
    },
  },
  sectionMobile: {
    display: 'flex',
    marginRight: '12px',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

  export default AppSearchBarUseStyles;
