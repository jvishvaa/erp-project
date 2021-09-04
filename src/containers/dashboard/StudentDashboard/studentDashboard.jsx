import React, { useContext, useState, useEffect, Suspense } from 'react';

import {ReportStatsWidget} from "../widgets";
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { Grid } from '@material-ui/core';

const data = [
  {
    "detail": "sample single item-1",
    "count" : 734
  },
  {
    "detail": "sample single item-2",
    "count" : 34
  },
  {
    "detail": "sample single item-3",
    "count" : 345
  },
  {
    "detail": "sample single item-4",
    "count" : 674
  },
  {
    "detail": "sample single item-5",
    "count" : 3
  }
]

const StudentDashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} >
          Student
      </Grid>
    </Grid>
  );
};

export default StudentDashboard;
