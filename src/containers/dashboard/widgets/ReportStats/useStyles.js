import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingBottom: 15,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  avatar: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBody: {
    padding: 0,
    height: 150,
    maxHeight: 150,
    overflowY: 'auto',
    '& .MuiChip-root': {
      marginRight: 5,
    },
    '& .MuiListItemText-primary': {
      display: 'block',
      width: '75%',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  positive_count: {
    backgroundColor: '#228B22',
    color: '#ffffff',
  },
  negative_count: {
    backgroundColor: '#FF2E2E',
    color: '#ffffff',
  },
  info_count: {
    backgroundColor: '#0F79FB',
    color: '#ffffff',
  },
  noDataTag: {
    height: 150,
    maxHeight: 150,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));
