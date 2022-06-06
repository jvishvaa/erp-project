import React from 'react';
import Grid from '@material-ui/core/Grid';
import Announcement from './Announcement/Announcement';
import MediaOrchadioCard from './Orchadio/MediaOrchadioCard';
import SocialMedia from './SocialMedia/SocialMedia';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import Calendar from './Calendar/Calendar';
import ViewTimeTables from './ViewTimeTable/ViewTimeTable';

const useStyles = makeStyles((theme) => ({
  fixed: {
    position: 'sticky',
    top: '1%',
  },
}));

export default function StudentRightDashboard(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.fixed}>
      {/* <Grid item> */}
        {/* <Grid container> */}
          <Grid item xs={12}>
            <Hidden xsDown>
              <Announcement />
            </Hidden>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '4px' }}>
            <Hidden xsDown>
              <ViewTimeTables />
            </Hidden>
          </Grid>
          <Grid item xs={12} style={{ margin: '4px 0' }}>
            <Hidden xsDown>
              <Calendar />
            </Hidden>
          </Grid>
          {/* <Grid item xs={12}>
              <Hidden xsDown>
                <SocialMedia />
              </Hidden>
            </Grid> */}
          {window.location.href.slice(8, 10) == 'qa' ||
          window.location.href.slice(8, 11) == 'dev' ||
          window.location.href.slice(8, 27) == 'orchids.letseduvate' ||
          window.location.href.slice(7, 12) == 'local' ? (
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Hidden xsDown>
                <MediaOrchadioCard />
              </Hidden>
            </Grid>
          ) : (
            ''
          )}
        {/* </Grid> */}
      {/* </Grid> */}
    </Grid>
  );
}
