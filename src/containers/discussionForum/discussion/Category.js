import React, { Fragment } from 'react';
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
    color: '#014B7E',
    fontSize: '18px',
    fontFamily: 'Raleway',
    lineHeight: '21px',
    marginLeft: '5px',
  },
  dotSeparator: {
    color: '#014B7E',
    fontSize: '6px',
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
  CategoriesTitleText: {
    color: '#014B7E',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    marginBottom: '15px',
  },
  // root: {
  //   height: '42px',
  //   width: '166px',
  //   backgroundColor: '#FE6B6B',
  //   color: '#FFFFFF',
  //   borderRadius: '10px',
  //   marginLeft: '40px',
  // },
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

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
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

const StyledOutlinedButton = withStyles({
  root: {
    height: '42px',
    color: '#FE6B6B',
    border: '1px solid #FF6B6B',
    borderRadius: '10px',
    backgroundColor: 'transparent',
  },
})(Button);

const StyledFilterButton = withStyles({
  root: {
    color: '#014B7E',
    marginLeft: '50px',
    marginBottom: '6px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    float: 'right',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
  },
  iconSize: {},
})(Button);

const StyledTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#014B7E',
    height: '3px',
  },
})(Tabs);

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
    color: '#014B7E',
    '&:hover': {
      color: '##ffffff',
      opacity: 1,
    },
    '&$selected': {
      color: '##ffffff',
      fontWeight: 600,
      border: '1px solid #014B7E',
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
  const [categoryList, setCategoryList] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const hideFilter = () => {
    props.handleFilter();
  };

  console.log(userDetails, 'userDetails');

  // const handleCategoryId = (id) => {
  //   setCategoryId(id);
  // };

  const handleMYActivity = () => {
    axiosInstance
      .get(`${endpoints.discussionForum.postList}?page=1&my_activity=1`)
      .then((res) => {
        setPostList(res.data.data.results);
      })
      .catch((error) => console.log(error));
  };

  const handleAsk = () => {
    if(location.pathname === '/student-forum'){
      history.push('/student-forum/create');
    }
    else {
      history.push('/teacher-forum/create');
    }
    //history.push('/discussion-forum/create');
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCategoryId(newValue)
    // categoryList.map((tab, id) => {
    //   if(id === newValue){
    //     setCategoryId(tab.id)
    //   }
    // })
    console.log('value:', newValue+ " -- " );
  };

  React.useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Homework' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Student Homework') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  // category list
  React.useEffect(() => {
    if(moduleId){
      if(location.pathname === '/student-forum'){
        const grade_id = userDetails.role_details?.grades[0]?.grade_id;
        axiosInstance
        .get(`${endpoints.discussionForum.categoryList}?module_id=${moduleId}&grade=${grade_id}`)
        .then((res) => {
          console.log(res.data.result);
          setCategoryList(res.data.result);
        })
        .catch((error) => console.log(error));
      }
      else {
        axiosInstance
        .get(`${endpoints.discussionForum.categoryList}?module_id=${moduleId}`)
        .then((res) => {
          console.log(res.data.result);
          setCategoryList(res.data.result);
        })
        .catch((error) => console.log(error));
      }
    }
  }, [moduleId]);

  const getDiscussionPost = (url) => {
    axiosInstance.get(url)
    .then((res) => {
      console.log(res.data.data);
      setPostList(res.data.data.results);
    })
    .catch((error) => console.log(error));
  }

  // post list API
  React.useEffect(() => {
    console.log(categoryId,' categoryId')
    if(moduleId) {
      if(location.pathname === '/student-forum'){
        const grade_id = userDetails.role_details?.grades[0]?.grade_id;
        console.log(' categoryId',categoryId + ' === ' + postURL);
        if(categoryId > 0) {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&grade=${grade_id}&category=${categoryId}`);
        }
        else {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?module_id=${moduleId}&grade=${grade_id}`);
        }
      }
      else {
        const grades =
          props.filters.grade && props.filters.grade.id !== 0 ? props.filters.grade.id : '';
        const sections =
          props.filters.section && props.filters.section.id !== 0
            ? props.filters.section.id
            : '';
        if (categoryId === 0 && grades === '' && sections === ''){
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}`);
        }
        if (categoryId !== 0 && grades === '') {
          getDiscussionPost(`${endpoints.discussionForum.filterCategory}?category=${categoryId}`);
          console.log(categoryId + ' === ' + postURL);
        }
        if (categoryId === 0 && grades !== '' && sections !== '') {
          getDiscussionPost(
            `${endpoints.discussionForum.filterCategory}?grade=${grades}&section=${sections}`
          );
        }
        if (categoryId !== 0 && grades !== '' && sections !== '') {
          //postURL = `${endpoints.discussionForum.postList}?category=${categoryId}&grade=${grades}&section=${sections}`;
          getDiscussionPost(
            `${endpoints.discussionForum.filterCategory}?category=${categoryId}&grade=${grades}&section=${sections}`
          );
        }
      }
    }
    //let postURL = endpoints.discussionForum.postList;
  }, [props.url, props.filters, categoryId, moduleId]);

  return (
    <Paper className={classes.paperStyle}>
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
              <TabPanel value={value} index={0} />
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
            {postList.map((data, id) => (
              <Discussion rowData={data} key={id} />
            ))}
          </Grid>
      </Grid>
    </Paper>
  );
};

export default Category;
