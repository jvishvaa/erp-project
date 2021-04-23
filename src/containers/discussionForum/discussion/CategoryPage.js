import React, { useState, useContext } from 'react';
import {
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  Tabs,
  Tab,
  Paper,
  Divider,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DiscussionForum from './DiscussionForum';
import FilterIcon from '../../../components/icon/FilterIcon';
import { useHistory, useLocation } from 'react-router-dom';
import Layout from '../../Layout/index';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import ClearIcon from '../../../components/icon/ClearIcon';
//import categoryData from './categoryData';
//import CreateCategory from './CreateCategory';
import DiscussionCategory from './DiscussionCategory';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategoryData, fetchCategory, fetchSubCategory, fetchSubSubCategoryList } from '../../../redux/actions/discussionForumActions';
// import CategoryCard from '../categoryData';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    color: '#014B7E',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  categoryBox: {
    padding: '15px 15px 0px 15px',
  },
  categoryContainer: {
    padding: '18px 25px 25px 25px',
  },
  closeFilterButton: {
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Raleway',
    lineHeight: '19px',
    marginTop: 'auto',
  },
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
    height: '100%',
    minHeight: '500px',
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

const SelectInput = withStyles({
  root: {
    height: '20px',
    width: '250px',
    color: '#014B7E',
  },
})(Select);

const StyledClearButton = withStyles({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    height: '42px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
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

const StyledCloseButton = withStyles({
  root: {
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Raleway',
    textTransform: 'capitalize',
    verticalAlign: 'bottom',
    backgroundColor: 'transparent',
  },
  iconSize: {},
})(Button);

// Discusion_forum/Category
function CategoryPage() {
  const classes = useStyles({});
  const history = useHistory();
  const categoryData = useSelector((state) => state.discussionReducers.categoryData);
  const categoryList = useSelector((state) => state.discussionReducers.categoryList);
  const subCategoryList = useSelector((state) => state.discussionReducers.subCategoryList);
  const subSubCategoryList = useSelector((state) => state.discussionReducers.subSubCategoryList);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = React.useState(null);
  const { setAlert } = useContext(AlertNotificationContext);

  const handleClearFilter = () => {
    setSelectedCategory();
    setSelectedSubCategory();
    setSelectedSubSubCategory();
    dispatch(fetchCategoryData());
  }

  const handleFilter = () => {
    if(selectedCategory?.id && selectedSubCategory?.sub_category_id && selectedSubSubCategory.sub_sub_category_name){
      dispatch(fetchCategoryData(selectedSubCategory?.sub_category_id));
    } else {
      setAlert('warning',`Please Select Category`);
    }
  }

  const handleChangeCategory = (event, value) => {
    if(value){
      setSelectedCategory(value);
    } else {
      setSelectedCategory();
    }
  };

  const handleChangeSubCategory = (event, value) => {
    if(value){
      setSelectedSubCategory(value);
    } else {
      setSelectedSubCategory();
    }
  };

  const handleChangeSubSubCategory = (event, value) => {
    if(value){
      setSelectedSubSubCategory(value);
    } else {
      setSelectedSubSubCategory();
    }
  };

  React.useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchCategoryData());
  },[])

  React.useEffect(() => {
    if(selectedCategory?.id){
      dispatch(fetchSubCategory(selectedCategory?.id));
    }
  },[selectedCategory]);

  React.useEffect(() => {
    if(selectedSubCategory?.sub_category_id){
      dispatch(fetchSubSubCategoryList(selectedSubCategory?.sub_category_id));
    }
  },[selectedSubCategory]);

  const [tabValue, setTabValue] = React.useState('all');

  const handleCreateCategory = () => {
    history.push('/master-management/discussion-category/create');
  };

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const discussion = categoryData.length;

  return (
    <Layout>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.categoryBox}>
          <div className='breadcrumb-container-create' style={{ marginLeft: '15px'}}>
            <CommonBreadcrumbs
              componentName='Category'
              //childComponentName='Post'
            />
          </div>
          <Grid container className={classes.categoryContainer} spacing={2}>
            <Grid item sm={3} xs={12}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleChangeCategory}
                value={selectedCategory}
                id='message_log-category_name'
                className='category_name'
                options={categoryList || []}
                getOptionLabel={(option) => option?.category_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_category_name'
                    {...params}
                    variant='outlined'
                    label='Category'
                    placeholder='Category'
                  />
                )}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleChangeSubCategory}
                value={selectedSubCategory}
                id='message_log-category_name'
                className='category_name'
                options={subCategoryList || []}
                getOptionLabel={(option) => option?.sub_category_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_category_name'
                    {...params}
                    variant='outlined'
                    label='Sub Category'
                    placeholder='Sub Category'
                  />
                )}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleChangeSubSubCategory}
                value={selectedSubSubCategory}
                id='message_log-category_name'
                className='category_name'
                options={subSubCategoryList || []}
                getOptionLabel={(option) => option?.sub_sub_category_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_category_name'
                    {...params}
                    variant='outlined'
                    label='Sub Sub Category'
                    placeholder='Sub Sub Category'
                  />
                )}
              />
            </Grid>
            {/* <StyledCloseButton variant='text' size='small' endIcon={<FilterIcon />}>
              Close filter
            </StyledCloseButton> */}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} className={classes.actionButtonGrid}>
            <Divider className={classes.dividerLine} />
            <StyledClearButton
              variant='contained'
              startIcon={<ClearIcon />}
              onClick={handleClearFilter}
            >
              Clear all
            </StyledClearButton>
            <StyledButton
              variant='contained'
              color='primary'
              className={classes.filterButton}
              onClick={handleFilter}
            >
              FILTER
            </StyledButton>

            <Divider orientation='vertical' className={classes.verticalDivider} />

            <StyledButton
              variant='contained'
              color='primary'
              className={classes.createButton}
              onClick={handleCreateCategory}
            >
              CREATE NEW
            </StyledButton>
          </Grid>
          <Grid item xs={12}>
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
                      {categoryData && categoryData.length > 0 && (
                        <DiscussionCategory tabValue={tabValue} rowData={categoryData} />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default CategoryPage;
