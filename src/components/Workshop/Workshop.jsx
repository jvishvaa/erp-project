import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import CommonBreadcrumbs from '../common-breadcrumbs/breadcrumbs';
import { Autocomplete } from '@material-ui/lab';
import Loader from '../loader/loader';
import './style.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { DashboardContext } from '../../containers/dashboard/dashboard-context/index.js';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import moment from 'moment';
import Pagination from '@material-ui/lab/Pagination';
import CreateWorkshop from './CreateWorkshop';
import WSAPI from './WSconfig/WSapi';
import WSENDPOINT from './WSconfig/WSendpoint';
import { handleDownloadExcel } from 'utility-functions';

const column = [
  'Title',
  'Course',
  'Workshop Date',
  'Tutor',
  'Attendance Count',
  'Actions',
  'Attendance Sheet',
];
const ConnectionPodFn = (props) => {
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const {
    welcomeDetails: { userLevel = 1 },
  } = useContext(DashboardContext);
  const { setAlert } = useContext(AlertNotificationContext);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const [loading, setLoading] = useState(false);
  const [accordianOpen, setAccordianOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selGradeId, setSelGradeId] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [tutorEmailList, setTutorEmailList] = useState([]);
  const [selectedTutorEmail, setSelectedTutorEmail] = useState();
  const [workShopData, setWorkShopData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCancelWS, setShowCancelWS] = useState(false);
  const [cancelRemarks, setCancelRemarks] = useState('');
  const [cancelWsId, setCancelWsId] = useState();
  const [classStatus, setClassStatus] = useState(1);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment(),
    moment().add(6, 'days'),
  ]);

  const limit = 5;
  const fetchBranches = () => {
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.branch}?session_year=${selectedYear?.id}&module_id=${moduleId}`
    ).then((res) => {
      if (res.data.status_code === 200) {
        const transformedData = res.data.data.results?.map((obj) => ({
          id: obj.branch.id,
          branch_name: obj.branch.branch_name,
        }));
        transformedData.unshift({
          branch_name: 'Select All',
          id: 'all',
        });
        setBranchList(transformedData);
      }
    });
  };

  const fetchGrades = () => {
    WSAPI('get', `${WSENDPOINT.WORKSHOP.grades}?module_id=${moduleId}`).then((res) => {
      if (res.data.status_code === 200) {
        res.data.result.results.unshift({
          grade_name: 'Select All',
          id: 'all',
        });
        setGradeList(res.data.result.results);
      }
    });
  };

  const fetchCourses = () => {
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.courses}?grade=${selGradeId[0]}&page=1&page_size=10`
    ).then((res) => {
      if (res.data.status_code === 200) {
        setCourseList(res.data.result);
      }
    });
  };

  const handleBranch = (e, value) => {
    setSelectedGrade([]);
    setSelectedCourse([]);
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedBranch(value);
    }
  };

  const handleGrade = (e, value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...gradeList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedGrade(value);
      const ids = value.map((obj) => obj.id);
      setSelGradeId(ids);
    }
  };

  const fetchTutorList = () => {
    const branchIds = selectedBranch.map((obj) => obj.id);
    const gradeIds = selectedGrade.map((obj) => obj.id);
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.tutorList}?branch_id=${branchIds}&grade_id=${gradeIds}`
    )
      .then((res) => {
        if (res.data.status_code === 200) {
          setTutorEmailList(res.data.data);
        }
      })
      .catch(() => {});
  };

  const fetchDownloadExcel = async (wsid, title) => {
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.downloadExcel}?workshop_id=${wsid}`,
      null,
      'arraybuffer'
    )
      .then((data) => {
        handleDownloadExcel(data.data, `attendence ${title}`);
      })
      .catch(() => {
        setAlert('error', 'File Not Found');
      });
  };

  const handleCourse = (e, value) => {
    if (value) {
      setSelectedCourse(value);
    }
  };
  const handleTutorEmail = (e, value) => {
    if (value) {
      setSelectedTutorEmail(value);
    }
  };

  const filterWorkShop = () => {
    var paramPath = `?page_size=${limit}&page=${page}&class_status=${classStatus}&role_differ=${userLevel}`;
    if (dateRangeTechPer[0] && dateRangeTechPer[1]) {
      const sd = dateRangeTechPer[0].format('YYYY-MM-DD');
      const ed = dateRangeTechPer[1].format('YYYY-MM-DD');
      paramPath += `&start_date=${sd}&end_date=${ed}`;
    }
    if (selectedBranch.length) {
      paramPath += `&branch=${selectedBranch.map((obj) => obj.id)}`;
    }
    if (selectedGrade.length) {
      paramPath += `&grade=${selectedGrade.map((obj) => obj.id)}`;
    }
    if (selectedCourse.id) {
      paramPath += `&course=${selectedCourse.id}`;
    }
    if (selectedTutorEmail?.id) {
      paramPath += `&tutor=${selectedTutorEmail.id}`;
    }
    setLoading(true);
    WSAPI('get', `${WSENDPOINT.WORKSHOP.retrieveworkshop}${paramPath}`)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setWorkShopData(res?.data?.results || []);
          setTotalCount(res.data.count);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handlePagination = (event, page) => {
    setPage(page);
  };

  const getDatenTime = (date) => {
    if (!date) {
      return '';
    }
    var df = date.split('T');
    return moment(`${df[0]} ${df[1]}`, 'YYYY-MM-DD HH:mm:ss').format(
      'DD-MM-YYYY hh:mm A'
    );
  };

  const handleJoin = async (eve, hostUrl, id, joinUrl) => {
    const joinStatus = eve?.currentTarget?.getAttribute('joinstatus');
    if (joinStatus !== 'Host' && joinStatus !== 'Join') {
      return false;
    }
    if (userLevel === 4) {
      const result = await WSAPI('post', WSENDPOINT.WORKSHOP.userWorkShop, {
        workshop_id: id,
      });
      if (result.data.status_code === 200) {
        joinUrl && window.open(joinUrl);
      }
    } else {
      hostUrl && window.open(hostUrl);
    }
  };

  const cancleWs = async (id) => {
    setShowCancelWS(true);
    setCancelWsId(id);
  };
  const closeCancelWs = async (id) => {
    setShowCancelWS(false);
    setCancelWsId();
  };

  const handleCancelWs = async () => {
    const result = await WSAPI('put', WSENDPOINT.WORKSHOP.cancleworkShop, {
      workshop_id: cancelWsId,
      cancel_remarks: cancelRemarks,
    });
    if (result.data.status_code === 200) {
      setShowCancelWS(false);
      setCancelWsId('');
      setCancelRemarks('');
    }
  };

  const getStatusLabel = (date, duration, tutorerp) => {
    if (!date) {
      return 'Host ';
    }
    const df = date.split('T');
    const wsDate = moment(`${df[0]} ${df[1]}`, 'YYYY-MM-DD HH:mm:ss');
    const curTime = moment();

    const ws_sd = moment(`${df[0]} ${df[1]}`, 'YYYY-MM-DD HH:mm:ss').subtract(
      5,
      'minutes'
    );
    const ws_ed = moment(`${df[0]} ${df[1]}`, 'YYYY-MM-DD HH:mm:ss').add(
      Number(duration),
      'minutes'
    );
    if (curTime > ws_sd && curTime < ws_ed) {
      const { erp } = JSON.parse(localStorage.getItem('userDetails'));
      if (tutorerp === erp) {
        return 'Host';
      } else {
        return 'Join';
      }
    } else if (curTime > wsDate) {
      return 'Completed';
    } else {
      return 'Upcoming';
    }
  };

  useEffect(() => {
    if (selectedGrade?.length && selectedBranch?.length) {
      fetchTutorList();
    }
  }, [selectedGrade, selectedBranch]);

  useEffect(() => {
    if (userLevel !== 4) {
      fetchBranches();
      fetchGrades();
    }
    if (userLevel === 4) {
      const {
        role_details: { grades },
      } = JSON.parse(localStorage.getItem('userDetails'));
      const ids = grades.map((obj) => obj.grade_id);
      setSelGradeId(ids);
    }
  }, [moduleId]);

  useEffect(() => {
    if (selGradeId.length) {
      fetchCourses();
    }
  }, [selGradeId]);

  useEffect(() => {
    if (totalCount > 0) {
      filterWorkShop();
    }
  }, [page]);

  useEffect(() => {
    if (NavData && NavData?.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module?.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Workshop') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    var paramPath = `?page_size=${10}&page=${1}&class_status=${1}&role_differ=${userLevel}`;
    setLoading(true);
    WSAPI('get', `${WSENDPOINT.WORKSHOP.retrieveworkshop}${paramPath}`)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setWorkShopData(res?.data?.results || []);
          setTotalCount(res.data.count);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className='connection-pod-container'>
        {loading && <Loader />}
        <>
          <div className='connection-pod-breadcrumb-wrapper'>
            <CommonBreadcrumbs
              componentName='Online Class'
              childComponentName='Workshop'
              isAcademicYearVisible={true}
            />
          </div>
          <div className='filter-container'>
            <Grid container spacing={3} alignItems='center'>
              {userLevel !== 4 && (
                <Grid item sm={1} xs={12}>
                  <Tooltip title='Create Meeting' placement='bottom' arrow>
                    <IconButton
                      className='create-meeting-button'
                      onClick={() => {
                        setDialogOpen(true);
                      }}
                    >
                      <AddIcon style={{ color: '#ffffff' }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
              <Grid item sm={userLevel !== 4 ? 11 : 12} xs={12}>
                <Accordion expanded={accordianOpen}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    onClick={() => setAccordianOpen(!accordianOpen)}
                  >
                    <Typography variant='h6' color='primary'>
                      Filter
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {userLevel !== 4 && (
                        <>
                          <Grid item md={3} sm={4} xs={12}>
                            <Autocomplete
                              multiple
                              fullWidth
                              size='small'
                              className='filter-student meeting-form-input'
                              options={branchList || []}
                              getOptionLabel={(option) => option?.branch_name || ''}
                              filterSelectedOptions
                              value={selectedBranch || []}
                              onChange={(event, value) => {
                                handleBranch(event, value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required
                                  fullWidth
                                  variant='outlined'
                                  label='Branch'
                                />
                              )}
                              renderOption={(option, { selected }) => (
                                <React.Fragment>{option?.branch_name}</React.Fragment>
                              )}
                            />
                          </Grid>
                          <Grid item md={3} sm={4} xs={12}>
                            <Autocomplete
                              multiple
                              fullWidth
                              size='small'
                              className='filter-student meeting-form-input'
                              options={gradeList || []}
                              getOptionLabel={(option) => option?.grade_name || ''}
                              filterSelectedOptions
                              value={selectedGrade || []}
                              onChange={(event, value) => {
                                handleGrade(event, value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required
                                  fullWidth
                                  variant='outlined'
                                  label='Grade'
                                />
                              )}
                              renderOption={(option, { selected }) => (
                                <React.Fragment>{option?.grade_name}</React.Fragment>
                              )}
                            />
                          </Grid>
                          {tutorEmailList.length > 0 && (
                            <Grid item md={3} sm={4} xs={12}>
                              <Autocomplete
                                size='small'
                                limitTags={2}
                                options={tutorEmailList}
                                getOptionLabel={(option) =>
                                  `${option?.name} (${option?.erp_id})` || ''
                                }
                                filterSelectedOptions
                                value={selectedTutorEmail}
                                onChange={handleTutorEmail}
                                renderInput={(params) => (
                                  <TextField
                                    size='small'
                                    {...params}
                                    variant='outlined'
                                    label='Tutor Name'
                                    placeholder='Tutor Name'
                                    required
                                  />
                                )}
                              />
                            </Grid>
                          )}
                        </>
                      )}
                      <Grid item md={3} sm={4} xs={12}>
                        <Autocomplete
                          fullWidth
                          size='small'
                          className='filter-student meeting-form-input'
                          options={courseList || []}
                          getOptionLabel={(option) => option?.course_name || ''}
                          filterSelectedOptions
                          value={selectedCourse || []}
                          onChange={(event, value) => {
                            handleCourse(event, value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              fullWidth
                              variant='outlined'
                              label='Course'
                            />
                          )}
                          renderOption={(option, { selected }) => (
                            <React.Fragment>{option?.course_name}</React.Fragment>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <LocalizationProvider dateAdapter={MomentUtils}>
                          <DateRangePicker
                            startText='Select-date-range'
                            value={dateRangeTechPer}
                            onChange={(newValue) => {
                              setDateRangeTechPer(newValue);
                            }}
                            renderInput={({ inputProps, ...startProps }, endProps) => {
                              return (
                                <>
                                  <TextField
                                    {...startProps}
                                    inputProps={{
                                      ...inputProps,
                                      value: `${moment(inputProps.value).format(
                                        'MM/DD/YYYY'
                                      )} - ${moment(endProps.inputProps.value).format(
                                        'MM/DD/YYYY'
                                      )}`,
                                      readOnly: true,
                                      endAdornment: (
                                        <IconButton>
                                          <DateRangeIcon
                                            style={{ width: '35px' }}
                                            color='primary'
                                          />
                                        </IconButton>
                                      ),
                                    }}
                                    size='small'
                                  />
                                </>
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item md={3} sm={4} xs={12}>
                        <FormControl fullWidth margin='dense' variant='outlined'>
                          <InputLabel>Meeting Type</InputLabel>
                          <Select
                            value={classStatus || 1}
                            label='Meeting Type'
                            name='meetingTypeFilter'
                            onChange={(eve) => {
                              setClassStatus(eve.target.value);
                            }}
                          >
                            <MenuItem value={'1'}>Today</MenuItem>
                            <MenuItem value={'2'}>Upcoming</MenuItem>
                            <MenuItem value={'3'}>Completed</MenuItem>
                            <MenuItem value={'4'}>Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={3} xs={3}>
                        <Button
                          style={{ marginTop: '5px' }}
                          variant='contained'
                          color='primary'
                          onClick={() => filterWorkShop()}
                        >
                          Filter
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </div>
          <div className='table-container'>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {column
                      .filter((val) => {
                        if (
                          userLevel === 4 &&
                          (val === 'Attendance Count' || val === 'Attendance Sheet')
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((eachColumn, index) => {
                        return <TableCell key={index}>{eachColumn}</TableCell>;
                      })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workShopData.map((wsdata, index) => {
                    return (
                      <TableRow key={wsdata.id}>
                        <TableCell>{wsdata?.topic}</TableCell>
                        <TableCell>{wsdata?.course_name}</TableCell>
                        <TableCell>{getDatenTime(wsdata?.start_time)}</TableCell>
                        <TableCell>{wsdata?.tutor_id_name}</TableCell>
                        {userLevel !== 4 && <TableCell>{wsdata?.attended}</TableCell>}
                        {wsdata?.is_cancel ? (
                          <TableCell>{wsdata?.cancel_remarks}</TableCell>
                        ) : (
                          <TableCell>
                            <Button
                              variant='contained'
                              color='primary'
                              joinStatus={getStatusLabel(
                                wsdata?.start_time,
                                wsdata?.duration,
                                wsdata?.tutor_erp_id
                              )}
                              onClick={(event) => {
                                handleJoin(
                                  event,
                                  wsdata?.start_url,
                                  wsdata?.id,
                                  wsdata?.join_url
                                );
                              }}
                            >
                              {getStatusLabel(
                                wsdata?.start_time,
                                wsdata?.duration,
                                wsdata?.tutor_erp_id
                              )}
                            </Button>{' '}
                            {userLevel !== 4 && (
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={() => {
                                  cancleWs(wsdata?.id);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        )}
                        {userLevel !== 4 && (
                          <TableCell>
                            <GetAppIcon
                              color={'primary'}
                              style={{ cursor: 'pointer' }}
                              onClick={() => fetchDownloadExcel(wsdata.id, wsdata.topic)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Grid container spacing={3} className='paginateData paginateMobileMargin'>
            <Grid item md={12} className='onclsPagination'>
              <Pagination
                onChange={handlePagination}
                style={{ marginTop: 25 }}
                // count={10}
                color='primary'
                count={Math.ceil(totalCount / limit)}
                page={page}
              />
            </Grid>
          </Grid>
        </>
      </div>
      <Dialog open={dialogOpen} className='create-meetinng-dialog'>
        <CreateWorkshop
          selectedYear={selectedYear}
          moduleId={moduleId}
          setDialogOpen={setDialogOpen}
          selectedYear={selectedYear}
          setLoading={setLoading}
        />
      </Dialog>
      <Dialog
        open={showCancelWS}
        fullWidth={true}
        maxWidth={'sm'}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Cancel Workshop</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Reason for cancel'
            type='text'
            fullWidth
            value={cancelRemarks}
            onChange={(eve) => {
              setCancelRemarks(eve.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              handleCancelWs();
            }}
          >
            Cancel Workshop
          </Button>
          <Button color='primary' variant='contained' onClick={closeCancelWs}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConnectionPodFn;
