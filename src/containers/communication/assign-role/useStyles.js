import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    width: 'calc(100% - 40px)',
    margin: '0 20px',
    backgroundColor: '#fafafa',
  },
  spacer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  //   formControl: {
  //     margin: theme.spacing(1),
  //     minWidth: 250,
  //   },
  //   selectEmpty: {
  //     marginTop: theme.spacing(2),
  //   },
}));

export default useStyles;
