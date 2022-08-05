import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  // menuItemIcon: {
  //   color: '#ffffff',
  //   // zIndex:1,
  // },
  menuItemIcon: {
    '& .MuiSvgIcon-root': {
      color: '#32334A',
    },
  },
  menuItemIconWhite: {
    '& .MuiSvgIcon-root': {
      color: '#ffffff',
      width: '26px',
      height: '26px',
    },
  },
  menuItemIconSelected: {
    color: '#FF6B6B',
    zIndex: 1,
  },
  expandIcons: {
    marginLeft: '2rem',
    color: '#32334A',
  },
}));

export default useStyles;
