import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '98%',
    margin: '0 1%'
  },
  navigationIcon: {
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    color: '#FF6B6B',
    fontSize: '30px',
  },
  button: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'transparent',
    },
    color: '#014B7E',
    fontWeight: 'bold',
    fontSize: '18px',
    fontFamily: 'Raleway SemiBold',
    padding: '6px 8px'
  },
  flexItem: {
    margin: '0 1%',
    width: '100%',
    height: '1px',
  },
}));

export default useStyles;
