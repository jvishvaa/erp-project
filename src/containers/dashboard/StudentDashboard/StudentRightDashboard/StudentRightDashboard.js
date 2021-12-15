import React from 'react';
import Grid from '@material-ui/core/Grid';
import Announcement from './Announcement/Announcement';
import MediaOrchadioCard from './Orchadio/MediaOrchadioCard';
import SocialMedia from './SocialMedia/SocialMedia';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import Calendar from './Calendar/Calendar';

const useStyles = makeStyles((theme) => ({
  fixed: {
    position: 'sticky',
    top: '1%',
  },
}));

export default function StudentRightDashboard(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={3} className={classes.fixed}>
      <Grid item>
        <Grid container spacing={3}>
          <Grid item xs={11}>
            <Hidden xsDown>
              <Announcement />
            </Hidden>
          </Grid>
          <Grid item xs={11}>
            <Hidden xsDown>
              <Calendar />
            </Hidden>
          </Grid>
          {/* <Grid item xs={12}>
              <Hidden xsDown>
                <SocialMedia />
              </Hidden>
            </Grid> */}
          <Grid item xs={12}>
            <Hidden xsDown>
              <MediaOrchadioCard />
            </Hidden>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
