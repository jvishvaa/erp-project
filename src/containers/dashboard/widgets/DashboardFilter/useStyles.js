import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
    '& .MuiChip-label': {
      color: theme.palette.primary.primarydark,
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    paddingBottom: 0,
    '& .MuiCardHeader-action': {
      alignSelf: 'center',
      paddingRight: 10,
    },
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#ffffff',
  },
  acad_year: {
    fontSize: 10,
    fontWeight: 'bold',
    borderColor: '#ffffff',
    '& .MuiChip-label': {
      color: '#ffffff',
    },
  },
  cardBody: {
    // height: 150,
    height: 168,
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.main,
    '& .MuiFormLabel-root': {
      color: '#ffffff',
    },
    '& .MuiAutocomplete-tag': {
      color: '#ffffff',
    },
  },
}));
