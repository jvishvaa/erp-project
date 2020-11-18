import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Divider, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import useStyles from './useStyles';

const SubjectCard = (props) => {
  const {
    data: { subject },
    handleDelete,
    handleEditSubject,
  } = props;
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
                Subject
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                title={subject?.subject_name}
                noWrap
              >
                {subject.subject_name}
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
                align='right'
              >
                {subject.created_by}
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
                Description
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
              >
                {subject.subject_description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item container>
          <Grid item xs={6}>
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={() => {
                  handleEditSubject(
                    subject.id,
                    subject.subject_name,
                    subject.subject_description
                  );
                }}
              >
                <EditOutlinedIcon color='primary' />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} className={classes.textRight}>
            <IconButton
              onClick={() => {
                handleDelete(props.data);
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

export default SubjectCard;
