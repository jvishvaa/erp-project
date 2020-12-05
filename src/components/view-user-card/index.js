import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Divider, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import BlockOutlined from '@material-ui/icons/BlockOutlined';
import useStyles from './useStyles';

const ViewUserCard = ({ user, onEdit, onDelete, onStatusChange }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item>
          <Grid item xs={6}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                Name
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                title={user.userName}
                noWrap
              >
                {user.userName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} className={classes.textRight}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                Status
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                align='right'
              >
                {user.active ? 'Active' : 'Deactivated'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={6}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                ERP ID
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
              >
                {user.erpId}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
                align='right'
              >
                Email
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                noWrap
                title={user.emails}
              >
                {user.emails}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item container>
          <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
            {user.active ? (
              <IconButton
                aria-label='deactivate'
                onClick={() => onStatusChange(user.userId, '2')}
                title='Deactivate'
              >
                <BlockOutlined color='primary' />
              </IconButton>
            ) : (
              <button
                className='group_view_activate_button group_view_button'
                title='Activate'
                onClick={() => onStatusChange(user.userId, '1')}
                style={{
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  border: 0,
                  width: '30px',
                  height: '30px',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                A
              </button>
            )}
          </Grid>
          <Grid item xs={4}>
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={() => {
                  onEdit(user.userId);
                }}
              >
                <EditOutlinedIcon color='primary' />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={4} className={classes.textRight}>
            <IconButton
              onClick={() => {
                onDelete(user.userId);
              }}
            >
              <DeleteOutlineIcon color='primary' />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ViewUserCard;
