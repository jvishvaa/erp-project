import { Avatar, Grid, makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import './reply.scss';
const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: 'flex',
  //   '& > *': {
  //     margin: theme.spacing(1),
  //   },
  // },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: '#78B5F3',
  },
}));
const Reply = (props) => {
  const send_time = moment(props.Replys.createdAt).fromNow(true);
  const classes = useStyles();
  return (
    <div style={{ backgroundColor: '#F9F9F9', borderRadius: '10px', padding: '15px' }}>
      <Grid container direction='row' justify='space-between' alignItems='center'>
        <Grid>
          <Grid container direction='row' alignItems='center'>
            <Grid style={{ marginRight: '2px' }}>
              <Avatar className={classes.small}>
                {props.Replys.replied_by ? props.Replys.replied_by.slice(0, 1) : ''}
              </Avatar>
            </Grid>
            <Grid>{props.Replys.replied_by}</Grid>
          </Grid>
        </Grid>
        <Grid style={{ color: '#014b7e' }}>{send_time} ago</Grid>
      </Grid>
      <Grid item sm={10}>
        <Typography style={{ fontSize: '13px', padding: '10px', marginLeft: '30px' }}>
          {props.Replys.body}
        </Typography>
      </Grid>
      {/* <Grid container>
        <Grid
          item
          sm={3}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Avatar
            style={{
              height: '30px',
              width: '30px',
              fontSize: '10px',
              backgroundColor: '#78B5F3',
            }}
            // src={props.Replys.user.profile}
          >
            {props.Replys.replied_by ? props.Replys.replied_by.slice(0, 1) : ''}
          </Avatar>
          <Typography
            style={{ fontSize: '10px', fontWeight: 'bold', marginLeft: '10px' }}
          >
            {props.Replys.replied_by}
          </Typography>
        </Grid>

        <Grid
          item
          sm={1}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: '5px',
          }}
        >
          <Typography style={{ fontSize: '14px' }}>{send_time} ago</Typography>
        </Grid>
      </Grid> */}
      {/* <Grid container>
        <Grid item sm={10}>
          <Typography style={{ fontSize: '13px', padding: '10px', marginLeft: '30px' }}>
            {props.Replys.body}
          </Typography>
        </Grid>
      </Grid> */}
    </div>
  );
};

export default Reply;
