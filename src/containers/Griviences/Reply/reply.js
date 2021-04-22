import { Avatar, Grid, makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import './reply.scss';

const Reply = (props) => {
  const send_time = moment(props.Replys.createdAt).fromNow(true);
  return (
    <div style={{ backgroundColor: '#F9F9F9', borderRadius: '10px', padding: '15px' }}>
      <Grid container>
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
            src={props.Replys.user.profile}
          >
            {' '}
            Harsh
            {/* {props.Replys.user.name.charAt(0)}{' '} */}
          </Avatar>
          <Typography
            style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '10px' }}
          >
            {props.Replys.user.name}
          </Typography>
        </Grid>
        <Grid sm />
        <Grid
          item
          sm={1}
          style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '5px' }}
        >
          <Typography style={{ fontSize: '12px' }}>{send_time} ago</Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={10}>
          <Typography style={{ fontSize: '12px', padding: '10px' }}>
            {props.Replys.body}
          </Typography>
        </Grid>
        <Grid item sm />
      </Grid>
    </div>
  );
};

export default Reply;
