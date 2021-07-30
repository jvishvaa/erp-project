import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumbs, Typography, Box, Divider } from '@material-ui/core'
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons'
import useStyles from './useStyles'


const CommonBreadcrumbs = withRouter(({ history, ...props }) => {
  const { componentName, childComponentName, childComponentNameNext, isAcademicYearVisible = false } = props || {};
  const { session_year = 'Loading...' } = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  ) || {};
  const breadcrumbList = [componentName, childComponentName, childComponentNameNext];
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Breadcrumbs maxItems={2} separator={<NavigateNextIcon className={classes.navigationIcon} />} aria-label="breadcrumb">
          {breadcrumbList?.map((breadcrumb) =>
            breadcrumb &&
            <Typography className={classes.button}>
              {breadcrumb}
            </Typography>
          )}
        </Breadcrumbs>
      </Box>
      {isAcademicYearVisible &&
        <Box>
          <Box>
            <Divider orientation='horizontal' classes={{ flexItem: classes.flexItem }} />
          </Box>
          <Box>
            <Typography className={classes.button}>
              {session_year}
            </Typography>
          </Box>
        </Box>}
    </Box>
  );
});

export default CommonBreadcrumbs;
