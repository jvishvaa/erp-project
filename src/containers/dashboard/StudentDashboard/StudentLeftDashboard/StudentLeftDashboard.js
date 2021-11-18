import React from 'react';
import Assessment from './Assessment/Assessment';
import Grid from '@material-ui/core/Grid';
import Homework from './Homework/Homework';
import Certificate from './CertificateFolder/Certificate';
import OnlineClass from './OnlineClass/OnlineClass';
import { makeStyles } from '@material-ui/core/styles';
import Blogdisc from './StoriesFolder/Blogdisc';
import { red } from '@material-ui/core/colors';
import Hidden from '@material-ui/core/Hidden';
import IconMobile from './IconMobile';
import './StudentLeftDashboard.scss';


const StudentLeftDashboard = (props) => {

  return (
    <Grid container spacing={1}>
      <Grid container xs={12} sm={12} md={12} style={{ display: "flex", margin: '5px' }} spacing={2}>
        <Grid item xs={12} sm={6} md={6} spacing={4}>
          <Certificate />
        </Grid>
        <Grid item xs={12} sm={6} md={6} spacing={4}>
          <Homework />
        </Grid>
      </Grid>
      <Grid container xs={12} sm={12} md={12} style={{ display: "flex" }} spacing={2}>
        <Grid item xs={12} sm={6} md={6} spacing={4}>
          <OnlineClass />
        </Grid>
        <Grid item xs={12} sm={6} md={6} spacing={4}>
          <Assessment />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Blogdisc />
      </Grid>

    </Grid>
  );
};

export default StudentLeftDashboard;
