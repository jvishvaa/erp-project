import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  navigationIcon: {
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    color: '#FF6B6B',
    fontSize: '30px',
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent"
    },
    backgroundColor: 'transparent',
    color: '#014B7E !important',
    fontWeight:'bold',
    fontSize:'18px',
    fontFamily:'Raleway SemiBold',
    alignItems:'left'
  },
}));

export default useStyles;
