import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Divider, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import useStyles from './useStyles';

const AcademicYearCard = (props) => {
  const {
    year,
    handleDelete,
    handleEditYear,
  } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
          <Grid item xs={8}>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                Session Year
              </Typography>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                title={year?.session_year}
                noWrap
              >
                {year.session_year}
              </Typography>
          </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item container>
          <Grid item xs={6}>
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
              <IconButton
                className='removePadding'
                onClick={() => {
                  handleEditYear(
                    year.id,
                    year.session_year,
                  );
                }}
              >
                <EditOutlinedIcon color='primary' />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={6} className={classes.textRight}>
            <IconButton
              className='removePadding'
              onClick={() => {
                handleDelete(year);
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

export default AcademicYearCard;
