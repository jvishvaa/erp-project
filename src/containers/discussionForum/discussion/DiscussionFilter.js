import React from 'react';
import {
  makeStyles,
  Button,
  withStyles,
  Collapse,
  Grid,
  Typography,
  Paper,
  Divider,
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FilterIcon from '../../../components/icon/FilterIcon';
import FilterFilledIcon from '../../../components/icon/FilterFilledIcon';
import ClearIcon from '../../../components/icon/ClearIcon';
// import CategoryFilter from './CategoryFilter';
import Filters from './Filters';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#F9F9F9',
    padding: '15px 60px 15px 15px',
  },
  dashboardText: {
    color: '#014B7E',
    fontSize: '18px',
    fontWeight: 'lighter',
    fontFamily: '',
    lineHeight: '21px',
  },
  filterCategorySpan: {
    marginLeft: '37px',
  },
  filterCategoryText: {
    color: '#014B7E',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    marginRight: '5px',
    marginLeft: '5px',
    lineHeight: '21px',
  },
  dotSeparator: {
    color: '#FF6B6B',
    height: '6px',
    width: '6px',
    verticalAlign: 'middle',
  },
  topLeft: {
    float: 'right',
  },
  forwardArrowIcon: {
    fontSize: '16px',
    color: '#FF6B6B',
  },
  categoryFilterContainer: {
    marginTop: '22px',
  },
  categoryFilterDiv: {
    // height: '223px',
    // position: 'relative',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    height: '223px',
  },
  filterIcon: {
    fill: '#FFFFFF',
  },
});

const StyledButton = withStyles({
  root: {
    color: '#014B7E',
    marginLeft: '50px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
  },
  iconSize: {},
})(Button);

const StyledClearButton = withStyles({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    height: '42px',
    marginTop: 'auto',
  },
})(Button);

const StyledFilterButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    padding: '12px 40px',
    marginLeft: '20px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
})(Button);
// DiscussionFilter
export default function DiscussionFilterComponent(props) {
  const classes = useStyles({});
  const [showFilter, setShowFilter] = React.useState(false);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className={classes.root}>
      <span className={classes.dashboardText}>Dashboard </span>
      <ArrowForwardIosIcon className={classes.forwardArrowIcon} />
      <span className={classes.dashboardText}>Discussion forum</span>
      {!showFilter && (
        <span>
          <span className={classes.filterCategorySpan}>
            <span className={classes.filterCategoryText}>2021</span>
            <FiberManualRecordIcon className={classes.dotSeparator} />
            <span className={classes.filterCategoryText}>Subject</span>
            <FiberManualRecordIcon className={classes.dotSeparator} />
            <span className={classes.filterCategoryText}>Grade</span>
            <FiberManualRecordIcon className={classes.dotSeparator} />
            <span className={classes.filterCategoryText}>Section</span>
          </span>

          <span className={classes.topLeft}>
            <span className={classes.dashboardText}>
              {' '}
              Number of discussion :
{props.totalDiscussion}
            </span>
            <StyledButton
              variant='text'
              size='small'
              endIcon={<FilterIcon />}
              onClick={handleFilter}
            >
              Show filters
            </StyledButton>
          </span>
        </span>
      )}
      <Collapse in={showFilter}>
        <Grid container spacing={2} className={classes.categoryFilterContainer}>
          <Grid item sm={8} xs={12}>
            {/*
                        <CategoryFilter className={classes.categoryFilterDiv}/>
                        */}
            <Filters />
          </Grid>
          <Grid item sm={4} xs={12} style={{ display: 'flex' }}>
            <StyledClearButton variant='contained' startIcon={<ClearIcon />}>
              Clear all
            </StyledClearButton>
            <StyledFilterButton
              variant='contained'
              color='secondary'
              startIcon={<FilterFilledIcon className={classes.filterIcon} />}
              className={classes.filterButton}
            >
              filter
            </StyledFilterButton>
          </Grid>
        </Grid>
      </Collapse>
    </div>
  );
}

export const DiscussionFilter = React.memo(DiscussionFilterComponent);
