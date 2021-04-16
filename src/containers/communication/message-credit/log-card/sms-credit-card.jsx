
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import './sms-credit-card.css';

const SmsCreditCard = (props) => {
  const {
    data,
    setMobileAddCreditId,
    setAddCreditMobile,
    index,
    handleStatusChange,
  } = props;
  const classes = useStyles();
  const handleAdd = () => {
    handleStatusChange(index);
    setMobileAddCreditId(index);
    setAddCreditMobile(true);
  };
  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid container item>
          <Grid item xs={12}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                Branch Name
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                title={data?.BranchName}
                noWrap
              >
                {data.BranchName}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={8}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                Available SMS Credit
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                align='right'
              >
                {data.AvailableSMS}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='secondary'
              >
                Used SMS Credit
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                align='right'
              >
                {data.useSMS}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item container>
          <Grid item xs={12}>
            <input
              type='button'
              className='add_credit_mobile'
              onClick={handleAdd}
              value='Add Credit'
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SmsCreditCard;
