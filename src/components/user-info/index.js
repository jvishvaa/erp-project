import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useStyles from './useStyles';

const UserInfo = ({ user, onClick }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} onClick={onClick}>
      <Grid container direction='column' alignItems='center'>
        <Grid item xs={6}>
          <IconButton>
            {user?.user_profile ? (
              <img src={user.user_profile} alt='no img' className={classes.profileImg} />
            ) : (
              <AccountCircle color='primary' className={classes.profileImg} />
            )}
          </IconButton>
        </Grid>
        <Grid xs={6}>
          <p className={classes.title}>{user?.name}</p>
          <p className={classes.subTitle}> {user?.user_role}</p>
        </Grid>
      </Grid>
    </Box>
  );
};
export default UserInfo;
