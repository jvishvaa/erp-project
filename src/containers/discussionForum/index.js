import React from 'react';
import { makeStyles, Button, withStyles, Collapse, Grid } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Provider } from 'react-redux';
import Category from './discussion/Category';
import Layout from '../Layout/index';
import Filters from '../../components/filters/Filters';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import FilterIcon from '../../components/icon/FilterIcon';
import store from '../../redux/store';
import {useLocation} from 'react-router-dom'

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
    //height: '223px',
    //position: 'relative',
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
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  iconSize: {},
})(Button);

const CommonBreadcrumbsStyle = withStyles({
  root: {
    display: 'inline',
  },
})(CommonBreadcrumbs);

const Discussionforum = () => {
  const classes = useStyles({});
  const url = endpoints.discussionForum.categoryList;
  const location = useLocation();
  //let postURL = endpoints.discussionForum.postList;

  const [showFilter, setShowFilter] = React.useState(true);
  const [filterData, setFilterData] = React.useState([]);
  const [postList, setPostList] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState(false);
  const [postURL, setPostURL] = React.useState(endpoints.discussionForum.postList);
  const [filters, setFilters] = React.useState({
    year: '',
    branch: '',
    grade: '',
    section: '',
  });

  const handleFilterData = (years, branchs, grades, sections) => {
    setFilters({
      year: years,
      branch: branchs,
      grade: grades,
      section: sections,
    });
    setSelectedFilter(true);
    //setFilterData(data.result);
    //setPostURL(`${endpoints.discussionForum.postList}?grade=${grdaeId}&section=${sectionId}`);
  };

  const handleFilter = () => {
    if(showFilter === true){
    setShowFilter(false);
    } else {
      setShowFilter(true)
    }
    //postURL = `${endpoints.discussionForum.postList}?category=19&grade=54&section=1,2`
  };

  // post list API
  /*
    React.useEffect(() => {
        axiosInstance.get(endpoints.discussionForum.postList)
        .then((res) => {
            console.log(res.data.data.results);
            setPostList(res.data.data.results);
        })
        .catch((error) => console.log(error))
    },[]);
    */

  return (
    <>
      <Layout>
        <Provider store={store}>
          <div className='breadcrumb-container-create' style={{ padding: '10px 20px'}}>
            <CommonBreadcrumbs componentName='Discussion forum' />
            {!showFilter && (
              <span>
                {selectedFilter && (
                  <span className={classes.filterCategorySpan}>
                    {filters.year && (
                      <>
                        <span className={classes.filterCategoryText}>{filters.year? filters.year.year : ''}</span>
                        <FiberManualRecordIcon className={classes.dotSeparator} />
                      </>
                    )}
                    {filters.branch && (
                      <>
                        <span className={classes.filterCategoryText}>{filters.branch? filters.branch.branchs : ''}</span>
                        <FiberManualRecordIcon className={classes.dotSeparator} />
                      </>
                    )}
                    {filters.grade && (
                      <>
                        <span className={classes.filterCategoryText}>{filters.grade? filters.grade.grades : ''}</span>
                        <FiberManualRecordIcon className={classes.dotSeparator} />
                      </>
                    )}
                    {filters.section && (
                      <span className={classes.filterCategoryText}>{filters.section? filters.section.section : ''}</span>
                    )}
                  </span>
                )}
                {location.pathname !== '/student-forum' && (
                  <span className={classes.topLeft}>
                    {selectedFilter && (
                      <span className={classes.dashboardText}>
                        Number of discussion :{filterData.length}
                      </span>
                    )}
                    <StyledButton
                      variant='text'
                      size='small'
                      endIcon={<FilterIcon />}
                      onClick={handleFilter}
                    >
                      Show filters
                    </StyledButton>
                  </span>
                )}
              </span>
            )}
            <Collapse in={showFilter}>
              <Filters url={postURL} handleFilterData={handleFilterData} />
            </Collapse>
          </div>
          <Category
            handleFilter={handleFilter}
            showFilter={showFilter}
            categoryList={filterData}
            url={postURL}
            filters={filters}
          />
          {/* <CategoryPage /> */}
        </Provider>
      </Layout>
    </>
  )
}

export default Discussionforum;
