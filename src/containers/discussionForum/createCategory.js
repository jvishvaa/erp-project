import React, { useState, useEffect, useContext } from 'react';
import {  TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';


import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../Layout'
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loading from '../../components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)',
    paddingLeft: '10%',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
    boxShadow: '0px 0px 10px -5px #fe6b6b',
    borderRadius: '.5rem',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  rootG: {
    flexGrow: 1,
  },
}));

const CreateCategory = () => {
  const classes = useStyles();

  const categoryTypeChoices = [
    { label: 'Category', value: '1' },
    { label: 'Sub category', value: '2' },
    { label: 'Sub sub category', value: '3' },
  ];
  const [spacing, setSpacing] = React.useState(2);
  const [currentTab, setCurrentTab] = useState(0);
  const [categoryTypeChoicesValue, setCategoryTypeChoicesValue] = useState(1);
  const [categoryListRes, setcategoryListRes] = useState([]);
  const [subCategoryListRes, setSubCategoryListRes] = useState([]);
  const [subCatListRes, setSubCatListRes] = useState([]);
  const [subSubCatListRes, setSubSubCatListRes] = useState([]);
  const [inActiveListRes, setInActiveListRes] = useState([]);
  const [activeListRes, setActiveListRes] = useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [subCategoryValue, setSubCategoryValue] = useState('');
  const [categoryTypeValue, setCategoryTypeValue] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%';
  const widerWidth = isMobile ? '90%' : '85%';

  const decideTab = () => {
    if (currentTab === 0) {
      return allTabContent();
    } else if (currentTab === 1) {
      return categoryTabContent();
    } else if (currentTab === 2) {
      return subCategoryTabContent();
    } else if (currentTab === 3) {
      return subSubCategoryTabContent();
    } else if (currentTab === 4) {
      return activeTabContent();
    } else if (currentTab === 5) {
      return inActiveTabContent();
    }
  };

  const allTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          { categoryListRes && categoryListRes.length
            ? categoryListRes.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className={classes.root}
                      style={{ border: '1px solid #FEE4D4' }}
                    >
                      <CardHeader style={{fontSize: '15px'}}
                        action={(
                          <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                            {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
                          </IconButton>
                        )}
                        style={{fontSize: '15px'}}
                        title={
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> 
                            {item.category_name} 
                          </p>
                          }
                      />
                    </Card>
                  </Grid>
                );
              })
            : ''}
        </Grid>
           </div>
    );
  };
  const categoryTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          { categoryListRes && categoryListRes.length
            ? categoryListRes.map((item) => { return (
              <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className={classes.root}
                      style={{ border: '1px solid #FEE4D4' }}
                    >
                      <CardHeader
                        style={{fontSize: '15px'}}
                                    action={(
                                <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                                {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
                                </IconButton>
                        )}
                        style={{fontSize: '15px'}}
                        title={
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}>
                            {item.category_name}  
                          </p>}
                      />
                    </Card>
                  </Grid>
            )}) : ('')}
        </Grid>
      </div>
  )};
  const subCategoryTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          { subCatListRes && subCatListRes.length
            ? subCatListRes.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className={classes.root}
                      style={{ border: '1px solid #FEE4D4', width: '350px' }}
                    >
                      <CardHeader
                        style={{fontSize: '15px'}}
                        action={(
                          <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                          {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
                          </IconButton>
                        )}
                        style={{fontSize: '15px'}}
                        title={
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}>
                            {item.category}
                          </p>}
                        subheader={
                          <p
                            style={{
                              fontFamily: 'Open Sans',
                              fontSize: '15px',
                              fontWeight: 'Lighter',
                            }}
                          >
                            {' '}
                            {item.sub_category_name}{' '}
                          </p>
                        }
                      />
                    </Card>
                  </Grid>
                )})
            : ''}
        </Grid>
      </div>)
  };
  const subSubCategoryTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          { subSubCatListRes && subSubCatListRes.length
            ? subSubCatListRes.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className={classes.root}
                      style={{ border: '1px solid #FEE4D4' }}
                    >
                      <CardHeader
                        style={{fontSize: '15px'}}
                        action={(
                          <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                          {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
                          </IconButton>
                        )}
                        style={{fontSize: '15px'}}
                        title={
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> 
                            {item.category}
                          </p>}
                        subheader={(
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> 
                            {item.sub_category_name}  < br />
                            {item.sub_sub_category_name}
                          </p>
                        )}
                      />
                    </Card>
                  </Grid>
                )})
            : ''}
        </Grid>
      </div>
    )};
  const activeTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          { activeListRes && activeListRes.length
            ? activeListRes.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className={classes.root}
                      style={{ border: '1px solid #FEE4D4' }}
                    >
                      <CardHeader
                        style={{fontSize: '15px'}}
                        action={(
                          <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                          {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
                          </IconButton>
                        )}
                        style={{fontSize: '15px'}}
                        title={
                          <p
                            style={{
                              fontFamily: 'Open Sans',
                              fontSize: '15px',
                              fontWeight: 'Lighter',
                            }}
                          >
                            {' '}
                            {item.category}
                          </p>
                        }
                        subheader={(
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> 
                            {item.sub_category_name}  <br />
                            {item.sub_sub_category_name}
                          </p>
                        )}
                      />
                    </Card>
                  </Grid>
                )})
            : ''}
        </Grid>
      </div>
    )};
  const inActiveTabContent = () => {
    return (
      <div>
      <Grid container spacing={2}>
      { inActiveListRes && inActiveListRes.length
            ? inActiveListRes.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className={classes.root}
                      style={{ border: '1px solid #FEE4D4' }}
                    >
                      <CardHeader
                        style={{fontSize: '15px'}}
                        action={(
                          <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                          {item.is_delete ? <Cancel style={{ color: 'red' ,fontSize: '25px' }}/>: <CheckCircle  style={{ color: 'green' ,fontSize: '25px' }}/> }
                          </IconButton>
                        )}
                        style={{fontSize: '15px'}}
                        title={
                          <p
                            style={{
                              fontFamily: 'Open Sans',
                              fontSize: '15px',
                              fontWeight: 'Lighter',
                            }}
                          >
                            {' '}
                            {item.category}
                          </p>
                        }
                        subheader={(
                          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', fontWeight: 'Lighter' }}> 
                            {item.sub_category_name}  <br />
                            {item.sub_sub_category_name}
                          </p>
                        )}
                      />
                    </Card>
                  </Grid>
                )})
            : ''}
        </Grid>
      </div>
  )};

  const handleNewType = (event, value) => {
    if (value && value.value) {
      setCategoryTypeChoicesValue(value.value);
      setCategoryTypeValue(value);
    } else {
      setCategoryTypeChoicesValue(1);
      setCategoryTypeValue('');
    }
  };
  const handleTabChange = (event, value) => {
    setCurrentTab(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let requestData = {};
    if (categoryTypeChoicesValue === '1') {
      requestData = {
        category_name: categoryName,
        category_type: categoryTypeChoicesValue,
      };
    } else if (categoryTypeChoicesValue === '2') {
      requestData = {
        category_name: categoryName,
        category_type: categoryTypeChoicesValue,
        category_parent_id: categoryValue,
      };
    } else if (categoryTypeChoicesValue === '3') {
      requestData = {
        category_name: categoryName,
        category_type: categoryTypeChoicesValue,
        category_parent_id: subCategoryValue,
      };
    }

    axiosInstance
      .post(`${endpoints.discussionForum.PostCategory}`, requestData)

      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };

  useEffect(() => {
    const getCategoryList = () => {
      axiosInstance
        .get(endpoints.discussionForum.categoryList)
        .then((res) => {
          setcategoryListRes(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCategoryList();
  }, []);
  useEffect(() => {
    const getSubCategoryList = () => {
      axiosInstance
        .get(`${endpoints.discussionForum.categoryList}?category_type=2`)
        .then((res) => {
          setSubCatListRes(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSubCategoryList();
  }, []);

  useEffect(() => {
    const getSubSubCategoryList = () => {
      axiosInstance
        .get(`${endpoints.discussionForum.categoryList}?category_type=3`)
        .then((res) => {
          setSubSubCatListRes(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSubSubCategoryList();
  }, []);

  useEffect(() => {
    const getInActiveList = () => {
      axiosInstance
        .get(`${endpoints.discussionForum.categoryList}?is_delete=True`)
        .then((res) => {
          setInActiveListRes(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getInActiveList();
  }, []);

  useEffect(() => {
    const getActiveList = () => {
      axiosInstance
        .get(`${endpoints.discussionForum.categoryList}?is_delete=False`)
        .then((res) => {
          setActiveListRes(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getActiveList();
  }, []);

  const handleCategoryChange = (event, value) => {
    if (value && value.id) {
      setCategoryValue(value.id);
      axiosInstance
        .get(
          `${endpoints.discussionForum.categoryList}?category_id=${value.id}&category_type=2`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubCategoryListRes(result.data.result);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    } else {
      setCategoryValue(null);
    }
  };
  const handleSubCategoryChange = (event, value) => {
    if (value && value.sub_category_id) {
      setSubCategoryValue(value.sub_category_id);
    } else {
      setSubCategoryValue(null);
    }
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  return (
    <>
     {loading ? <Loading message='Loading...' /> : null}
     <Layout>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid
            item
            xs={12}
            sm={3}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          >
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleNewType}
              id='category'
              required
              options={categoryTypeChoices}
              getOptionLabel={(option) => option?.label}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='New type'
                  placeholder='New type'
                />
              )}
            />
          </Grid>
          {categoryTypeChoicesValue === '2' || categoryTypeChoicesValue === '3' ? (
            <Grid item xs={12} sm={3} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
             <Autocomplete
                 style={{ width: '100%' }}
                 id="tags-outlined"
                 options={categoryListRes}
                 getOptionLabel={(option) => option.category_name}
                 filterSelectedOptions
                 size="small"
                 renderInput={(params) => (
                     <TextField
                         {...params}
                         variant="outlined"
                         label=" Select category"

                       />
                )}
                 onChange={
                       handleCategoryChange
                   }
                //  getOptionSelected={(option, value) => value && option.id == value.id}
              />
           </Grid>
          ) : (
            ''
          )}
          {categoryTypeChoicesValue === '3'  ? (
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <Autocomplete
              style={{ width: '100%' }}
              id="tags-outlined"
              options={subCategoryListRes}
              getOptionLabel={(option) => option.sub_category_name}
              filterSelectedOptions
              size="small"
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="outlined"
                      label=" Select sub category"

                  />
              )}
              onChange={
                  handleSubCategoryChange
              }
              getOptionSelected={(option, value) => value && option.id == value.sub_category_id}
            />
          </Grid>
          ) : (
            ''
          )}
          <Grid
            item
            xs={12}
            sm={3}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          >
            <TextField
              id='outlined-helperText'
              label={
                categoryTypeChoicesValue === '3'
                  ? 'Sub sub category name'
                  : categoryTypeChoicesValue === '2'
                  ? 'Sub category name'
                  : 'Category name'
              }
              defaultValue=''
              variant='outlined'
              style={{ width: '100%' }}
              inputProps={{ maxLength: 20 }}
              onChange={(event, value) => {
                handleCategoryNameChange(event);
              }}
              color='secondary'
              size='small'
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={isMobile ? 1 : 5}
          style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}
        >
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              className='custom_button_master'
              size='medium'
              type='submit'
              onClick={handleSubmit}
              disabled={!categoryTypeChoicesValue || !categoryName}
            >
              Save
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Tabs
              value={currentTab} indicatorColor='primary'
              // variant={mobileView < 1024 ? 'scrollable' : 'fullWidth'}
              // scrollButtons={mobileView < 1024 ? 'on' : 'off'}

              textColor='primary'
              onChange={handleTabChange}
              aria-label='simple tabs example'
            >
              <Tab label='All'/>
              <Tab label='Category'/>
              <Tab label='Sub Category'/>
              <Tab label='Sub sub category'/>
          
              <Tab label='Active'/>
              <Tab label='In-Active'/>
            </Tabs>
          </Grid>
        </Grid>
{decideTab()}

      </Layout>
   </>
  );
};

export default CreateCategory;
