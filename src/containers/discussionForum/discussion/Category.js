import React, { Fragment, useEffect } from 'react';
import {
  Grid,
  Typography,
  Paper,
  makeStyles,
  Button,
  withStyles,
  Divider,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CategoryScrollbar from './CategoryScrollbar';
import Discussion from './Discussion';
import FilterIcon from '../../../components/icon/FilterIcon';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { useHistory, useLocation } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { discussionData } from './discussionData';
import { Pagination } from '@material-ui/lab';
import Loading from '../../../components/loader/loader';

const bgColor = [
  '#EFFFB2',
  '#D5FAFF',
  '#FFC4BB',
  '#E8CDFF',
  '#CCF0FF',
  '#FFCEF9',
  '#CCD9FF',
  '#CEFFCF',
];

const useStyles = makeStyles((theme) => ({
  paperStyle: {
    padding: '20px 70px 10px 42px',
    '@media (max-width: 600px)': {
      padding: '20px 10px',
    },
  },
  hideFilterDiv: {
    width: '100%',
    marginBottom: '15px',
  },
  filterDivider: {
    width: '100%',
    //marginTop: '6px',
    marginBottom: '15px',
  },
  filterCategoryText: {
    color: theme.palette.secondary.main,
    fontSize: '18px',
    fontFamily: 'Raleway',
    lineHeight: '21px',
    marginLeft: '5px',
  },
  dotSeparator: {
    color: theme.palette.secondary.main,
    fontSize: '6px',
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
  CategoriesTitleText: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    marginBottom: '15px',
  },
  label: {
    textTransform: 'capitalize',
  },
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  categoryTab: {
    height: '30px',
  },
  tabsRoot: {
    height: '40px',
  },
  tabRoot: {
    height: '30px',
    backgroundColor: '',
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
}))(Button);

const StyledOutlinedButton = withStyles((theme) => ({
  root: {
    height: '42px',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
}))(Button);

const StyledFilterButton = withStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    marginLeft: '50px',
    marginBottom: '6px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    float: 'right',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  iconSize: {},
}))(Button);

const StyledTabs = withStyles((theme) => ({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: theme.palette.secondary.main,
    height: '3px',
  },
}))(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 50,
    fontWeight: 300,
    marginBottom: '15px',
    padding: '0 25px',
    marginRight: '11px',
    backgroundColor: '#ff6a6a',
    borderRadius: '10px',
    color: theme.palette.secondary.main,
    '&:hover': {
      color: '##ffffff',
      opacity: 1,
    },
    '&$selected': {
      color: '##ffffff',
      fontWeight: 600,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    '&:focus': {
      color: '##ffffff',
    },
  },
  selected: {
    backgroundColor: '#EFFFB2',
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const Category = (props) => {
  const classes = useStyles({});
  const [postList, setPostList] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState(0);
  const [postURL, setPostURL] = React.useState(endpoints.discussionForum.filterCategory);
  const history = useHistory();
  const location = useLocation();
  const [moduleId, setModuleId] = React.useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const personalInfo = JSON.parse(localStorage.getItem('personal_info')) || {};
  const [categoryList, setCategoryList] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [deleteEdit, setDeleteEdit] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState();
  const limit = 6;
  const [awardy, setAwardy] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hidePagination, setHidePagination] = React.useState(false);

  const hideFilter = () => {
    props.handleFilter();
  };

  const handleDeleteEdit = () => {
    setDeleteEdit(!deleteEdit);
    handleMYActivity();
  }

  // const handleCategoryId = (id) => {
  //   setCategoryId(id);
  // };

  const handleMYActivity = () => {
    setHidePagination(true);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.discussionForum.filterCategory}?page=1&my_activity=1`)
      .then((res) => {
        setPostList(res.data.data.results);
        setLoading(false);
      })
      .catch((error) => { setLoading(false); console.log(error) });
  };

  const handleAsk = () => {
    if (location.pathname === '/student-forum') {
      history.push('/student-forum/create');
    }
    else {
      history.push('/teacher-forum/create');
    }
    //history.push('/discussion-forum/create');
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCategoryId(newValue);
    setPage(1);
  };

  React.useEffect(() => {
    if (NavData && NavData.length) {
      let isModuleId = false;
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Discussion Forum' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Forum' && !isModuleId) {
              isModuleId = true;
              setModuleId(item.child_id);
            }
            else if (item.child_name === 'Student Forum' && !isModuleId) {
              isModuleId = true;
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  // category list
  React.useEffect(() => {
    if (moduleId) {
      if (location.pathname === '/student-forum' && personalInfo?.role !== "SuperUser") {
        const grade_id = userDetails.role_details?.grades[0]?.grade_id;
        const branch_id = userDetails.role_details?.branch[0]?.id;
        axiosInstance
          .get(`${endpoints.discussionForum.categoryList}?module_id=${moduleId}&branch=${branch_id}&grade=${grade_id}&is_delete=False`)
          .then((res) => {
            setCategoryList(res.data.result);
          })
          .catch((error) => console.log(error));
      }
      else {
        axiosInstance
          .get(`${endpoints.discussionForum.categoryList}?module_id=${moduleId}&category_type=1&is_delete=False`)
          .then((res) => {
            setCategoryList(res.data.result);
          })
          .catch((error) => console.log(error));
      }
    }
  }, [moduleId]);

  const getDiscussionPost = (url) => {
    setLoading(true)
    axiosInstance.get(url)
      .then((res) => {
        setPostList(res.data.data.results);
        setTotalCount(res.data.data.count ? res.data.data.count : res.data.data.results.length);
        setAwardy(false);
        setLoading(false);
      })
      .catch((error) => { setLoading(false); console.log(error) });
  }

  const handlePass = (id) => {
    // const grade_id = userDetails.role_details?.grades[0]?.grade_id;
    // const branch_id = userDetails.role_details?.branch[0]?.id;
    // axiosInstance.get(`${endpoints.discussionForum.categoryList}?module_id=${moduleId}&branch=${branch_id}&grade=${grade_id}&is_delete=False`)
    // .then((res) => {
    //   setPostList(res.data.data.results);
    //   setTotalCount(res.data.data.count? res.data.data.count : res.data.data.results.length);
    // })
    // .catch((error) => console.log(error));
    console.log(id, "id of award")
    setAwardy(id)
  }

  // post list API
  React.useEffect(() => {
    if (moduleId) {
      if (location.pathname === '/student-forum' && personalInfo?.role !== "SuperUser") {
        const grade_id = userDetails.role_details?.grades[0]?.grade_id;
        const branch_id = userDetails.role_details?.branch[0]?.id;
        if (categoryId > 0) {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&branch=${branch_id}&grade=${grade_id}&category=${categoryId}&page=${page}&page_size=${limit}`);
        }
        else {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&branch=${branch_id}&grade=${grade_id}&page=${page}&page_size=${limit}`);
        }
      }
      else {
        const branchId = props.filters.branch && props.filters.branch.id !== 0 ? props.filters.branch.id : '';
        const grades =
          props.filters.grade && props.filters.grade.id !== 0 ? props.filters.grade.id : '';
        const sections =
          props.filters.section && props.filters.section.id !== 0
            ? props.filters.section.id
            : '';
        if (categoryId === 0 && grades === '' && sections === '') {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&page=${page}&page_size=${limit}`);
        }
        if (categoryId !== 0 && grades === '') {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&category=${categoryId}&page=${page}&page_size=${limit}`);
        }
        if (categoryId === 0 && grades !== '' && sections !== '') {
          getDiscussionPost(
            `${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&branch=${branchId}&grade=${grades}&section_mapping=${sections}&page=${page}&page_size=${limit}`
          );
          // getDiscussionPost(
          //   `${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&branch=${branchId}&grade=${grades}`
          // );
        }
        if (categoryId !== 0 && grades !== '' && sections !== '') {
          getDiscussionPost(
            `${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&branch_id=${branchId}&category=${categoryId}&grade=${grades}&section_mapping=${sections}&page=${page}&page_size=${limit}`
          );
          // getDiscussionPost(
          //   `${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&branch=${branchId}&category=${categoryId}&grade=${grades}`
          // );
        }

      }
    }
    setHidePagination(false);
    //let postURL = endpoints.discussionForum.postList;
  }, [props.url, props.filters, categoryId, moduleId, deleteEdit, page, awardy]);

  const handlePagination = (event, page) => {
    setPage(page);
  };
  return (
    <Paper className={classes.paperStyle}>
      {loading ? <Loading message='Loading...' /> : null}
      {props.showFilter && (
        <div>
          <div>
            <StyledFilterButton
              variant="text"
              size="small"
              endIcon={<FilterIcon />}
              onClick={props.handleFilter}
            >
              Hide filters
            </StyledFilterButton>
          </div>

          <div className={classes.hideFilterDiv}>
            <Divider className={classes.filterDivider} />
            {props.filters && (
              <div>
                {props.filters.year.year && (
                  <>
                    <span className={classes.filterCategoryText}>{props.filters.year.year}</span>
                    <FiberManualRecordIcon className={classes.dotSeparator} />
                  </>
                )}
                {props.filters.branch.branchs && (
                  <>
                    <span className={classes.filterCategoryText}>{props.filters.branch.branchs}</span>
                    <FiberManualRecordIcon className={classes.dotSeparator} />
                  </>
                )}
                {props.filters.grade.grades && (
                  <>
                    <span className={classes.filterCategoryText}>{props.filters.grade.grades}</span>
                    <FiberManualRecordIcon className={classes.dotSeparator} />
                  </>
                )}
                {props.filters.section.section && (
                  <span className={classes.filterCategoryText}>{props.filters.section.section}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Typography className={classes.CategoriesTitleText}>Categories</Typography>
      <Grid container>
        <Grid item md={8} xs={12}>
          <div className={classes.root}>
            <StyledTabs
              value={value}
              onChange={handleChange}
              indicatorColor='primary'
              textColor='secondary'
              variant='scrollable'
              scrollButtons='auto'
              aria-label='scrollable auto tabs example'
            // TabIndicatorProps={{color: '#D5FAFF'}}
            >
              {categoryList.map((tab, id) => (
                <StyledTab
                  key={tab.id}
                  label={tab.category_name}
                  value={tab.id}
                  style={{ backgroundColor: bgColor[id % 8] }}
                  {...a11yProps(0)}
                // onClick={(e) => setCategoryId(tab.id)}
                />
              ))}
            </StyledTabs>
          </div>
          {/* <CategoryScrollbar categoryList={props.categoryList} categoryId={handleCategoryId} /> */}
        </Grid>
        <Grid item md={4} xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StyledOutlinedButton fullWidth onClick={handleAsk}>
                Ask
              </StyledOutlinedButton>
            </Grid>
            <Grid item xs={6}>
              <StyledButton
                fullWidth
                onClick={handleMYActivity}
              >
                MY Activity
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {postList && postList.map((data) => (
            <Discussion rowData={data} key={data.id} handlePass={(id) => handlePass(id)} deleteEdit={handleDeleteEdit} />
          ))}
        </Grid>
        {hidePagination ? null :
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              onChange={handlePagination}
              style={{ marginTop: 25 }}
              count={Math.ceil(totalCount / limit)}
              color='primary'
              page={page}
            />
          </Grid>
        }
      </Grid>
    </Paper>
  );
};

export default Category;
//handlePass={(id)=>handlePass(id)}