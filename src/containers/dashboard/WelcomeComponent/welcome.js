import React , {useState , useEffect } from 'react';

// import './style.scss';
import { Box, Typography , Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDashboardContext } from '../dashboard-context';

import { useHistory } from 'react-router';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

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
  const history = useHistory();
  const [ checkOrigin , setCheckOrigin ] = useState(false);

  // useEffect(() => {
  //   if(window.location.origin === 'http://localhost:3000'){
  //     setCheckOrigin(true)
  //   }
  //   if(window.location.origin === 'https://qa.olvorchidnaigaon.letseduvate.com'){
  //     setCheckOrigin(true)
  //   }
  //   if(window.location.origin === 'https://dev.olvorchidnaigaon.letseduvate.com'){
  //     setCheckOrigin(true)
  //   }
  //   if(window.location.origin === 'https://orchids.letseduvate.com'){
  //     setCheckOrigin(true)
  //   }
  // },[])

  useEffect(() => {
    const origin = window.location.origin;
    if(origin.indexOf("orchids.")>-1 || origin.indexOf("dev.")>-1 || origin.indexOf("qa.")>-1 || origin.indexOf("localhost")>-1){
      setCheckOrigin(true)
    }
},[]);

  const studentrefer = () => {
    history.push('/studentrefer')
}

  return (
    <Box display='flex' alignItems='flex-end' my={3} style={{justifyContent : 'space-between'}} >
        <div style={{display: 'flex'}}>
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
      {checkOrigin ? <>
      {welcomeDetails.userLevel === 4 ? 
      <Button onClick={studentrefer}  >
        <GroupAddIcon style={{marginRight: '5px'}} />
        Orchids Ambassador Program
      </Button>
      : '' }
          </>
      : '' }
    </Box>
  );
};

export default WelcomeComponent;
