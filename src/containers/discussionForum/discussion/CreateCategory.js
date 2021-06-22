import React, { useContext } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  withStyles,
  makeStyles,
  InputBase,
  Divider,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Layout from '../../Layout/index';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { fetchCategory, fetchSubCategory, fetchSubSubCategoryList, createAllCategory, createNewCategory } from '../../../redux/actions/discussionForumActions';

const useStyles = makeStyles({
  paperStyle: {
    height: '100vh',
    width: '100%',
    marginTop: '15px',
  },
  containerGrid: {
    padding: '15px 100px 150px 44px',
  },
  categoryContainer: {
    padding: '18px 25px 25px 35px',
  },
  categoryTitle: {
    color: '#014B7E',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    lineHeight: '24px',
  },
  dividerLine: {
    marginTop: '19px',
  },
});

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    marginTop: '29px',
  },
})(Button);

const StyledInput = withStyles({
  root: {
    height: '42px',
    width: '100%',
    padding: '5px 20px',
    border: '1px solid #DBDBDB',
    borderRadius: '10px',
    marginTop: '13px',
    marginBottom: '10px',
  },
})(InputBase);

const CreateCategories = () => {
  const classes = useStyles({});
  const history = useHistory();
  const dispatch = useDispatch();
  const { setAlert } = useContext(AlertNotificationContext);

  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [subSubCategory, setSubSubCategory] = React.useState('');

  const categoryList = useSelector((state) => state.discussionReducers.categoryList);
  const subCategoryList = useSelector((state) => state.discussionReducers.subCategoryList);
  const subSubCategoryList = useSelector((state) => state.discussionReducers.subSubCategoryList);
  const categoryCreadted = useSelector((state) => state.discussionReducers.categoryCreadted);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = React.useState(null);

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleSubCategory = (e) => {
    setSubCategory(e.target.value);
  };

  const handleSubSubCategory = (e) => {
    setSubSubCategory(e.target.value);
  };

  const handleChangeCategory = (event, value) => {
    if(value){
      setSelectedCategory(value);
      setCategory(value?.category_name);
      setSelectedSubCategory(null);
      setSelectedSubSubCategory(null);
    } else {
      setSelectedCategory();
    }
  };

  const handleChangeSubCategory = (event, value) => {
    if(value){
      setSelectedSubCategory(value);
      setSubCategory(value?.sub_category_name);
      setSelectedSubSubCategory(null);
    } else {
      setSelectedSubCategory();
    }
  };

  const handleChangeSubSubCategory = (event, value) => {
    if(value){
      setSelectedSubSubCategory(value);
      setSubSubCategory(value?.sub_sub_category_name);
    } else {
      setSelectedSubSubCategory();
    }
  };

  React.useEffect(() => {
    dispatch(fetchCategory());
  },[categoryCreadted])

  React.useEffect(() => {
    if(selectedCategory?.id){
      dispatch(fetchSubCategory(selectedCategory?.id));
      setSubCategory('');
      setSubSubCategory('');
    }
  },[selectedCategory, categoryCreadted]);

  React.useEffect(() => {
    if(selectedSubCategory?.sub_category_id){
      dispatch(fetchSubSubCategoryList(selectedSubCategory?.sub_category_id));
      setSubSubCategory('');
    }
  },[selectedSubCategory, categoryCreadted]);

  const handleBack = () => {
    history.push('/master-management/discussion-category');
  }

  const handleSubmit = () => {
    if(!selectedCategory && !selectedSubCategory && !selectedSubSubCategory){
      const params = {category_type: '1', category_name: category}
      if(category === ''){
        setAlert('warning', 'Category filed is empty');
      }
      else {
        dispatch(createAllCategory(params));
        // history.push('/master-management/discussion-category');
      }
    }
    else if(selectedCategory && !selectedSubCategory && !selectedSubSubCategory) {
      const params = {category_type: '2', category_name: subCategory, category_parent_id: selectedCategory?.id}
      //dispatch(createAllCategory(params));
      if(subCategory === ''){
        setAlert('warning', 'Sub Category filed is empty');
      }
      else {
        dispatch(createAllCategory(params));
        // history.push('/master-management/discussion-category');
      }
    }
    else if(selectedCategory && selectedSubCategory) {
      const params = {category_type: '3', category_name: subSubCategory, category_parent_id: selectedSubCategory?.sub_category_id}
      //dispatch(createAllCategory(params));
      if(subSubCategory === ''){
        setAlert('warning', 'Sub Sub_category filed is empty');
      }
      else {
        dispatch(createAllCategory(params));
        // history.push('/master-management/discussion-category');
      }
    }
  }

  React.useEffect(() => {
    if(categoryCreadted !== ''){
      if(category && !subCategory && !subSubCategory){
        setAlert('success', 'Category Created');
        setCategory('');
        dispatch(createNewCategory());
        
      }
      if(category && subCategory && !subSubCategory){
        setAlert('success', 'Sub Category Created');
        setSubCategory('');
        dispatch(createNewCategory());
      }
      if(category && subCategory && subSubCategory){
        setAlert('success', 'Sub Sub_Category Created');
        setSubSubCategory('');
        dispatch(createNewCategory());
      }
    }
  },[categoryCreadted])

  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <div className='breadcrumb-container-create'>
            <CommonBreadcrumbs
              componentName='Category'
              childComponentName='Create New Category'
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
        <Paper className={classes.paperStyle}>
          <Grid container>
            <Grid item xs={12} className={classes.containerGrid}>
              <form>
                <Typography className={classes.categoryTitle}>Category</Typography>
                <StyledInput
                  placeholder='Type or select from filters above'
                  value={category}
                  onChange={handleCategory}
                  fullWidth
                  disabled={selectedCategory? true : false}
                />
                {selectedCategory && (
                <>
                  <Typography className={classes.categoryTitle}>Sub - category</Typography>
                  <StyledInput
                    placeholder='Type or select from filters above'
                    value={subCategory}
                    onChange={handleSubCategory}
                    fullWidth
                    disabled={selectedSubCategory? true : false}
                  />
                </>
                )}
                {selectedSubCategory && (
                  <>
                    <Typography className={classes.categoryTitle}>Sub - sub category</Typography>
                    <StyledInput
                      placeholder='Type or select from filters above'
                      value={subSubCategory}
                      onChange={handleSubSubCategory}
                      fullWidth
                      //disabled={true}
                    />
                  </>
                )}

                <Divider className={classes.dividerLine} />

                <div>
                  <StyledButton variant='contained' color='inherit' onClick={handleBack}>
                    Back
                  </StyledButton>
                  <StyledButton variant='contained' color='inherit' onClick={handleSubmit} style={{float:'right'}}>
                    Submit
                  </StyledButton>
                </div>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Layout>
  );
};

export default CreateCategories;
