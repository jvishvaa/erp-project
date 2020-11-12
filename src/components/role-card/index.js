import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Divider, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import useStyles from './useStyles';

const RoleCard = ({ role, onEdit, onDelete }) => {
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
              >
                {role.role_name}
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
                Created by
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
              >
                {role.created_by || '--'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item container>
          <Grid item xs={6}>
            <IconButton
              onClick={() => {
                onEdit(role);
              }}
            >
              <EditOutlinedIcon color='primary' />
            </IconButton>
          </Grid>
          <Grid item xs={6} className={classes.textRight}>
            <IconButton
              onClick={() => {
                onDelete(role);
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

export default RoleCard;
