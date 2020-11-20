import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    width: '95%',
    margin: '0 auto',
    backgroundColor: '#fafafa',
  },
  spacer: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  tableActionsContainer: {
    width: 'calc(100% - 40px)',
    marginLeft: '20px',
    marginRight: '20px',
  },
  assignRoleBtnContainer: {
    width: 'calc(100% - 40px)',
    marginLeft: '20px',
    marginRight: '20px',
  },
  viewMoreBtn: {
    color: theme.palette.primary.main,
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
