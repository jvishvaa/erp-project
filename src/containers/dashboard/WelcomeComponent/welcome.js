import React, { useState, useEffect } from 'react';
import '../style.scss';
import { Box, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDashboardContext } from '../dashboard-context';
import SyncIcon from '@material-ui/icons/Refresh';
import { useHistory } from 'react-router';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import './Styles.css';
import {isDeveloper} from 'components/utils/checkDeveloper';

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
    ['@media only screen and (min-width: 600px)']: {
      // eslint-disable-line no-useless-computed-key
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    ['@media only screen and (min-width: 1024px)']: {
      // eslint-disable-line no-useless-computed-key
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
  },
  refreshIcon: {
    cursor: 'pointer',
  },
  outlined: {
    border: `1px solid ${theme.palette.primary.main}`,
    background: '#fff',
    color: theme.palette.secondary.main,
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 16px !important',
  },
}));

const WelcomeComponent = ({ erp_config , isMsAPIKey , changeView}) => {
  const classes = useStyles();
  const [showButton, setShowButton] = useState(false);
  const { welcomeDetails = {}, setReports } = useDashboardContext();
  const { greeting, name, userRole, userLevel } = welcomeDetails;
  const [ isDev , setIsDev ] = useState()

  const getAllReport = () => {
    // let button = document.getElementById('refreshButton')
    // button.classList.add("refresh");
    // setTimeout(() => {
    //   // alert("Hello");
    // button.classList.remove("refresh");
    // }, 2000);

    setReports((prev) => ({ ...prev, refreshAll: true }));
  };

  const history = useHistory();
  const [checkOrigin, setCheckOrigin] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    if (
      origin.indexOf('orchids.') > -1 ||
      origin.indexOf('dev.') > -1 ||
      origin.indexOf('qa.') > -1 ||
      origin.indexOf('localhost') > -1
    ) {
      setCheckOrigin(true);
    }
    
  }, []);

  const checkDev = isDeveloper();

  console.log(checkDev);

  const studentrefer = () => {
    history.push('/studentrefer');
  };

  const academicView = () => {
    history.push('/acad-calendar');
  }



  return (
    <>
   
    {welcomeDetails?.userLevel === 1 || welcomeDetails?.userLevel ===  4 || welcomeDetails?.userLevel ===  8 || welcomeDetails?.userLevel ===  10 ? 
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1%' , width: '30%' , float: 'right' }} >
      { welcomeDetails?.userLevel === 4 ? '' :  <>
        {erp_config ? <Button className={classes.outlined} style={{margin: '0 2%'}} color='secondary' onClick={academicView}  >
          Calendar View
        </Button> : ''}
        </> }
        { welcomeDetails?.userLevel === 4 && checkDev === true ?   <>
        {erp_config ? <Button className={classes.outlined} style={{margin: '0 2%'}} color='secondary' onClick={() => changeView(1)}  >
          Stats View
        </Button> : ''}
        </> : ''}
        { checkDev === true ? <>
        {erp_config ? <Button className={classes.outlined} style={{margin: '0 2%'}} color='secondary' onClick={() => changeView(2)}  >
          Stats View V2
        </Button> : ''}
        </> : '' }
      </div>
      : '' }
     
      <Box
        mb={1}
        className={classes.mainHeading}
        display='flex'
        alignItems='flex-end'
        style={{ justifyContent: 'space-between' }}
      >
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
        {/* {userLevel === 13 ? '' : (
        <div>
          <SyncIcon
            id="refreshButton"
            className={classes.refreshIcon}
            onClick={getAllReport}
          />
        </div>
      )} */}
        {checkOrigin ? (
          <>
            {welcomeDetails.userLevel === 13 ? (
              <Button onClick={studentrefer} style={{ marginLeft: '20px' }}>
                <GroupAddIcon style={{ marginRight: '5px' }} />
                <h4>Orchids Ambassador Program</h4>
              </Button>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
        {welcomeDetails?.userLevel === 1 || welcomeDetails?.userLevel ===  4 || welcomeDetails?.userLevel === 8 || welcomeDetails?.userLevel === 10 ? '' :
          <>
            {erp_config ? <Button className={classes.outlined} color='secondary' onClick={academicView}>
              Academic View
            </Button> : ''}
          </> 
        }
      </Box>
    </>
  );
};

export default WelcomeComponent;
