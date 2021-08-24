import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  imageUploadBtn: {
    backgroundColor: theme.palette.primary.main,
    padding: '15px 20px',
    fontSize: '16px',
    color: '#ffffff',
    borderRadius: '10px',
    cursor: 'pointer',
    outline: 'none',
  },
}));

export default useStyles;
