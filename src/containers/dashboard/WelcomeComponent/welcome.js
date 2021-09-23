import React from 'react';
// import './style.scss';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDashboardContext } from '../dashboard-context';

const useStyles = makeStyles((theme) => ({
  greeting: {
    fontWeight: 'bold',
  },
  greeting_user: {
    marginLeft: 10,
    marginRight: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    lineHeight: 1.25,
  },
  greeting_user_role: {
    fontStyle: 'italic',
    lineHeight: 2,
  },
}));

const WelcomeComponent = () => {
  const classes = useStyles();
  const { welcomeDetails = {} } = useDashboardContext();
  const { greeting, name, userRole } = welcomeDetails;

  return (
    <Box display='flex' alignItems='flex-end' my={3}>
      <Typography variant='subtitle1' color='secondary'>
        {greeting},
      </Typography>
      <Typography variant='h6' color='secondary' className={classes.greeting_user}>
        {name || 'Buddy'}
      </Typography>
      <Typography
        variant='caption'
        color='textSecondary'
        className={classes.greeting_user_role}
      >
        ({userRole})
      </Typography>
    </Box>
  );
};

export default WelcomeComponent;
