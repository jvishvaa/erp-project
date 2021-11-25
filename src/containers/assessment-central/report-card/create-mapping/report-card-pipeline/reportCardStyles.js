import { makeStyles } from '@material-ui/core';

export const reportCardStyles = makeStyles((theme) => ({
  'status-card--pending': {
    '&:hover': {
      background: '#fdf1dd',
      transition: '500ms',
    },
  },
  'status-card--running': {
    '&:hover': {
      background: '#cbe2f9',
      transition: '500ms',
    },
  },
  'status-card--complete': {
    '&:hover': {
      background: '#c3e6cd',
      transition: '500ms',
    },
  },
  'status-card--failed': {
    '&:hover': {
      background: '#fdd4cd',
      transition: '500ms',
    },
  },
  'status-card--d-pending': {
    '&:hover': {
      background: '#fdf1dd',
      transition: '500ms',
    },
  },
  'status-card--d-running': {
    '&:hover': {
      background: '#cbe2f9',
      transition: '500ms',
    },
  },
  'status-card--deleted': {
    '&:hover': {
      background: '#d3d3d3',
      transition: '500ms',
    },
  },
  'status-card--d-failed': {
    '&:hover': {
      background: '#fdd4cd',
      transition: '500ms',
    },
  },
  'status-card': {
    display: 'flex',
    justifyContent: 'space-around',
    height: '1.9rem',
    width: '80%',
    padding: '0.25rem',
    margin: '0 auto',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: '250ms',
    [theme.breakpoints.down('md')]: {
      width: '95%',
    },
  },
}));
