import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import {
  SvgIcon,
  TextField,
  Grid,
  Button,
  useTheme,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import IconButton from '@material-ui/core/IconButton';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilterPro.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)',
    paddingLeft: '10px',
    borderRadius: '10px',
    height: '110px',
    border: '1px #ff6b6b solid',
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
  typoStyle: {
    fontSize: '12px',
    padding: '1px',
    marginTop: '-5px',
    marginRight: '20px',
  },
  periodDataUnavailable: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
    marginLeft: '350px',
  },
}));

const CreateGenre = (props) => {
  const { match } = props;

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [genreActiveListRes, setGenreActiveListResponse] = useState('');
  const [genreInActiveListRes, setGenreInActiveListResponse] = useState('');

  const [genreName, setGenreName] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%';
  const widerWidth = isMobile ? '90%' : '85%';
  const [grade, setGrade] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState('');
  const [moduleId, setModuleId] = useState(68);
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));

  const [gradeList, setGradeList] = useState([]);
  const [totalGenre, setTotalGenre] = useState('');
  const [branchId] = useState(
    roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
  );
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let requestData = {};

    requestData = {
      grade_id: selectedGrades,
      genre: genreName,
    };

    axiosInstance
      .post(`${endpoints.blog.genreList}`, requestData)

      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          setGenreName(null);
          setSelectedGrades(null);
          // getGenreList();
          //  getGenreInActiveList();
        } else {
          setLoading(false);
          setAlert('error', 'duplicates not allowed');
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'duplicates not allowed');
      });
  };

  const handleTabChange = (event, value) => {
    setCurrentTab(value);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const activeTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          {genreActiveListRes && genreActiveListRes.length ? (
            genreActiveListRes.map((item) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <Card className={classes.root}>
                    <CardHeader
                      style={{ padding: '0px' }}
                      action={
                        <Typography>
                          <IconButton title='Delete' onClick={() => handleDelete(item)}>
                            <DeleteOutlinedIcon
                              style={{ color: themeContext.palette.primary.main }}
                            />
                          </IconButton>
                          <IconButton
                            title='edit'
                            onClick={() =>
                              props.history.push({
                                pathname: '/blog/genre/edit',
                                state: { data: item },
                              })
                            }
                          >
                            <EditOutlinedIcon
                              style={{ color: themeContext.palette.primary.main }}
                            />
                          </IconButton>
                        </Typography>
                      }
                      subheader={
                        <Typography
                          gutterBottom
                          variant='body2'
                          align='left'
                          component='p'
                          style={{ color: '#014b7e', pagging: '0px' }}
                        >
                          Created At :{' '}
                          {item && moment(item.created_at).format('MMM DD YYYY')}
                        </Typography>
                      }
                    />
                    <CardContent style={{ pagging: '1px' }}>
                      <Typography className={classes.typoStyle}>
                        Grade : {item.grade && item.grade.grade_name}{' '}
                      </Typography>
                      <Typography className={classes.typoStyle}>
                        Genre Name: {item.genre}{' '}
                      </Typography>
                      <Typography className={classes.typoStyle}>
                        Created By : {item.created_by.first_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : totalGenre === 0 ? (
            <div className={classes.periodDataUnavailable}>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '100px', width: '200px' }
                        : { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />{' '}
              NO DATA FOUND FOR SELECTED GRADE
            </div>
          ) : (
            <div className={classes.periodDataUnavailable}>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '100px', width: '200px' }
                        : { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '20px', width: '250px' }
                        : { height: '50px', width: '400px', marginLeft: '5%' }
                    }
                    src={selectfilter}
                  />
                )}
              />
            </div>
          )}
        </Grid>
      </div>
    );
  };
  const inActiveTabContent = () => {
    return (
      <div>
        <Grid container spacing={2}>
          {genreInActiveListRes && genreInActiveListRes.length ? (
            genreInActiveListRes.map((item) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <Card className={classes.root}>
                    <CardHeader
                      style={{ padding: '0px' }}
                      subheader={
                        <Typography
                          gutterBottom
                          variant='body2'
                          align='left'
                          component='p'
                          style={{ color: '#014b7e', pagging: '0px' }}
                        >
                          Created At :{' '}
                          {item && moment(item.created_at).format('MMM DD YYYY')}
                        </Typography>
                      }
                    />
                    <CardContent style={{ pagging: '1px' }}>
                      <Typography className={classes.typoStyle}>
                        Genre Name: {item.genre}{' '}
                      </Typography>
                      <Typography className={classes.typoStyle}>
                        Created By : {item.created_by.first_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : totalGenre === 0 ? (
            <div className={classes.periodDataUnavailable}>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '100px', width: '200px' }
                        : { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />{' '}
              NO DATA FOUND FOR SELECTED GRADE
            </div>
          ) : (
            <div className={classes.periodDataUnavailable}>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '100px', width: '200px' }
                        : { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '20px', width: '250px' }
                        : { height: '50px', width: '400px', marginLeft: '5%' }
                    }
                    src={selectfilter}
                  />
                )}
              />
            </div>
          )}
        </Grid>
      </div>
    );
  };

  const handlePagination = (event, page) => {
    setPageNumber(page);
    setGenreActiveListResponse([]);
    setGenreInActiveListResponse([]);
    getData();
  };

  const handleDelete = (data) => {
    let requestData = {
      genre_id: data.id,
    };
    axiosInstance
      .put(`${endpoints.blog.genreList}`, requestData)

      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          // getGenreList();
          // getGenreInActiveList();
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

  const decideTab = () => {
    if (currentTab === 0) {
      return activeTabContent();
    } else if (currentTab === 1) {
      return inActiveTabContent();
    }
  };
  const handleGenreNameChange = (e) => {
    setGenreName(e.target.value);
  };
  const handleGrade = (event, value) => {
    setGenreActiveListResponse([]);
    setGenreInActiveListResponse([]);
    if (value) {
      setSelectedGrades(value.id);
    } else {
      setSelectedGrades();
    }
  };
  useEffect(() => {
    if (branchId) {
      setGrade([]);
      getGradeApi();
    }
    // getGenreList();
    //  getGenreInActiveList();
  }, [branchId]);

  const getGradeApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.masterManagement.grades}?page=${1}&page_size=${0}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        setGradeList(result.data.result.results);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setGenreActiveListResponse([]);
    setGenreInActiveListResponse([]);
    getData();
  };
  const getData = () => {
    if (currentTab === 0) {
      axiosInstance
        .get(
          `${
            endpoints.blog.genreList
          }?is_delete=${'False'}&grade_id=${selectedGrades}&page_number=${pageNumber}&page_size=${pageSize}`
        )
        .then((res) => {
          setGenreActiveListResponse(res.data.result.data);
          setTotalGenre(res.data.result.total_genres);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosInstance
        .get(
          `${
            endpoints.blog.genreList
          }?is_delete=${'True'}&grade_id=${selectedGrades}&page_number=${pageNumber}&page_size=${pageSize}`
        )
        .then((res) => {
          setGenreInActiveListResponse(res.data.result.data);
          setTotalGenre(res.data.result.total_genres);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getGenreList = () => {
    axiosInstance
      .get(`${endpoints.blog.genreList}?is_delete=${'False'}`)
      .then((res) => {
        setGenreActiveListResponse(res.data.result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getGenreInActiveList = () => {
    axiosInstance
      .get(`${endpoints.blog.genreList}?is_delete=${'True'}`)
      .then((res) => {
        setGenreInActiveListResponse(res.data.result.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
            {gradeList.length ? (
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='grade'
                disableClearable
                className='dropdownIcon'
                options={gradeList}
                filterSelectedOptions
                getOptionLabel={(option) => option?.grade_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            ) : null}
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          >
            <TextField
              id='outlined-helperText'
              label='Genre Name'
              defaultValue=''
              variant='outlined'
              style={{ width: '100%' }}
              inputProps={{ maxLength: 20 }}
              onChange={(event, value) => {
                handleGenreNameChange(event);
              }}
              color='secondary'
              size='small'
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%' }}
              color='primary'
              size='medium'
              type='submit'
              onClick={handleFilter}
              disabled={genreName || !selectedGrades}
            >
              Filter
            </Button>
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
              style={{ color: 'white', width: '100%' }}
              color='primary'
              size='medium'
              type='submit'
              onClick={handleSubmit}
              disabled={!genreName || !selectedGrades}
            >
              Save
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Tabs
              value={currentTab}
              indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange}
              aria-label='simple tabs example'
            >
              <Tab label='View' />
              <Tab label='Deleted' />
            </Tabs>
            <li style={{ listStyleType: 'none' }}>
              <Typography
                align='right'
                className={classes.dividerInset}
                style={{ font: '#014b7e', fontWeight: 600, paddingRight: '80px' }}
                display='block'
                variant='caption'
              >
                Number of Genre {totalGenre}
              </Typography>
            </li>
          </Grid>
        </Grid>
        {decideTab()}
        <Grid container>
          <Grid item xs={12}>
            <Pagination
              onChange={handlePagination}
              style={{ paddingLeft: '500px' }}
              count={Math.ceil(totalGenre / pageSize)}
              color='primary'
              page={pageNumber}
            />
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default withRouter(CreateGenre);
