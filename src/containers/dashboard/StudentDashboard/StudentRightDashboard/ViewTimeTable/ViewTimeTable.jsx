import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EventIcon from '@material-ui/icons/Event';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: '#455a64',
    backgroundColor: '#78909C',
    color: 'white',
    height: 'inherit',
  },
  title: {
    fontWeight: '600',
  },
  icon: {
    fontSize: 30,
    color: 'white',
    cursor: 'pointer',
  },
  iconButton: {
    padding: 0,
  },
}));

export default function ViewTimeTables() {
  const history = useHistory();
  const classes = useStyles();
  //   const { erp_config } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const handleClick = () => {
    history.push('/timetable/teacherview');
  };
  return (
    <Card className={classes.root}>
      <CardContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <EventIcon className={classes.icon} />
        <Typography className={classes.title}>View Time Tables</Typography>
        <IconButton
          title='View Time Tables'
          className={classes.iconButton}
          onClick={() => handleClick()}
        >
          <ChevronRightIcon className={classes.icon} />
        </IconButton>
      </CardContent>
    </Card>
  );
}
