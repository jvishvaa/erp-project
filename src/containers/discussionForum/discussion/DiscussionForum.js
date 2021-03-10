import React, { Fragment } from 'react';
import {
  makeStyles,
  withStyles,
  Grid,
  Button,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ClearIcon from '../../../components/icon/ClearIcon';
import categoryData from './categoryData';
import CreateCategory from './CreateCategory';
import DiscussionCategory from './DiscussionCategory';
// import DiscussionPagination from './DiscussionPagination';

const useStyles = makeStyles({
  dividerLine: {
    marginBottom: '26px',
  },
  actionButtonGrid: {
    padding: '0 110px 24px 40px',
  },
  filterButton: {
    marginLeft: '26px',
  },
  verticalDivider: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    marginLeft: '56px',
    height: '40px',
  },
  createButton: {
    marginLeft: '40px',
  },
  disscustionContainer: {
    padding: '15px 57px 0px 44px',
  },
  statusText: {
    display: 'inline',
    color: '#FF6B6B',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '29px',
    marginRight: '40px',
  },
  numberofDiscussionText: {
    display: 'inline-block',
    color: '#014B7E',
    marginLeft: 'auto',
  },
  selectInputCategory: {},
  pageFooter: {
    textAlign: 'center',
  },
});

const StyledClearButton = withStyles({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    height: '42px',
  },
})(Button);

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    paddingLeft: '30px',
    paddingRight: '30px',
  },
})(Button);

const StyledTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#FF6B6B',
    height: '6px',
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 50,
    fontWeight: 300,
    marginRight: theme.spacing(4),
    color: '#014B7E',
    '&:hover': {
      color: '#ff6a6a',
      opacity: 1,
    },
    '&$selected': {
      color: '#ff6a6a',
      fontWeight: 300,
    },
    '&:focus': {
      color: '#ff6a6a',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const DiscussionForum = () => {
  const classes = useStyles({});
  const [createCategory, setCreateCategory] = React.useState(false);
  const [tabValue, setTabValue] = React.useState('all');

  const handleCreateCategory = () => {
    setCreateCategory(!createCategory);
  };

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const discussion = categoryData.length;

  return (
    <>
      <Grid container>
        {!createCategory && (
          <Grid item xs={12} className={classes.actionButtonGrid}>
            <Divider className={classes.dividerLine} />
            <StyledClearButton
              variant='contained'
              color='secondary'
              startIcon={<ClearIcon />}
            >
              Clear all
            </StyledClearButton>
            <StyledButton
              variant='contained'
              color='secondary'
              className={classes.filterButton}
            >
              FILTER
            </StyledButton>

            <Divider orientation='vertical' className={classes.verticalDivider} />

            <StyledButton
              variant='contained'
              color='secondary'
              className={classes.createButton}
              onClick={handleCreateCategory}
            >
              CREATE NEW
            </StyledButton>
          </Grid>
        )}
        <Grid item xs={12}>
          {createCategory ? (
            <CreateCategory />
          ) : (
            <Paper>
              <Grid container className={classes.disscustionContainer}>
                <Grid item xs={12}>
                  <StyledTabs
                    value={tabValue}
                    indicatorColor='secondary'
                    textColor='secondary'
                    onChange={handleTabChange}
                  >
                    <span className={classes.statusText}>Status</span>
                    <StyledTab label='All' value='all' />
                    <StyledTab label='Active' value='active' />
                    <StyledTab label='In-active' value='inactive' />
                    <Typography className={classes.numberofDiscussionText}>
                      Number of discussion : {discussion}
                    </Typography>
                  </StyledTabs>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <DiscussionCategory tabValue={tabValue} rowData={categoryData} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default DiscussionForum;
