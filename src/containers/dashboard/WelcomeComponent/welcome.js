import React, { useState, useEffect } from 'react';
import '../style.scss';
import { Box, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDashboardContext } from '../dashboard-context';
import SyncIcon from '@material-ui/icons/Refresh';
import { useHistory } from 'react-router';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import './Styles.css'

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
  mainHeading: {
    ['@media only screen and (min-width: 600px)']: { // eslint-disable-line no-useless-computed-key
      display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    ['@media only screen and (min-width: 1024px)']: { // eslint-disable-line no-useless-computed-key
      display: 'flex', alignItems: 'center', flexDirection: 'row'
    },
  },
  refreshIcon: {
    cursor: 'pointer'
  }
}));

const WelcomeComponent = () => {
  const classes = useStyles();
  const { welcomeDetails = {}, setReports } = useDashboardContext();
  const { greeting, name, userRole, userLevel } = welcomeDetails;

  const getAllReport = () => {

    // let button = document.getElementById('refreshButton')
    // button.classList.add("refresh");
    // setTimeout(() => {
    //   // alert("Hello");
    // button.classList.remove("refresh");
    // }, 2000);

    setReports((prev) => ({ ...prev, refreshAll: true }));
  }

  const history = useHistory();
  const [checkOrigin, setCheckOrigin] = useState(false);


  useEffect(() => {
    const origin = window.location.origin;
    if (origin.indexOf("orchids.") > -1 || origin.indexOf("dev.") > -1 || origin.indexOf("qa.") > -1 || origin.indexOf("localhost") > -1) {
      setCheckOrigin(true)
    }
  }, []);

  const studentrefer = () => {
    history.push('/studentrefer')
  }

  return (
    <Box mb={1} className={classes.mainHeading} display='flex' alignItems='flex-end' style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
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
      </div>
      {userLevel === 4 ? '' : (
        <div>
          <SyncIcon
            id="refreshButton"
            className={classes.refreshIcon}
            onClick={getAllReport}
          />
        </div>
      )}
      {checkOrigin ? <>
        {welcomeDetails.userLevel === 4 ?
          <Button onClick={studentrefer} style={{ marginLeft: '20px' }}>
            <GroupAddIcon style={{ marginRight: '5px' }} />
            <h4>Orchids Ambassador Program</h4>
          </Button>
          : ''}
      </>
        : ''}
    </Box>
  );
};

export default WelcomeComponent;
