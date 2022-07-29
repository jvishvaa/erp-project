import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  // menuItemIcon: {
  //   color: '#ffffff',
  //   // zIndex:1,
  // },
  menuItemIcon: {
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
  },
  menuItemIconSelected: {
    color: '#FF6B6B',
    zIndex:1,
  },
  expandIcons: {
    marginLeft: '2rem',
    color: '#ffffff',
  },
}));

export default useStyles;
