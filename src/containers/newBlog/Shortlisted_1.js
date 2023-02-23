import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import {
  TextField,
  makeStyles,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import {
  CloseOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Tag, Table as TableAnt, Button } from 'antd';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const drawerWidth = 350;

const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: 'yellow',
  },
  root: {
    '& .MuiSvgIcon-root': {
      color: 'currentColor',
    },
  },
  iconHover: {
    color: 'yellow',
  },
}))(Rating);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '93vw',
    width: '95%',
    marginLeft: '25px',
    // marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '95vw',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: 'white',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },

  buttonColor1: {
    color: 'green !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: '#FF6161 !important',
    backgroundColor: 'white',
  },
  buttonDisable: {
    color: 'gray !important',
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const Shortlisted_1 = (props) => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};

  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [value, setValue] = useState(0);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [activityLevel, setActivityLevel] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [userInform, setUserInform] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const [desc, setDesc] = useState('');

  const [startDate, setStartDate] = useState(null);

  const [dropdownData, setDropdownData] = React.useState({
    branch: [],
    grade: [],
  });
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [filterData, setFilterData] = React.useState({
    branch: '',
    year: '',
  });

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Blog Activity') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  useEffect(() => {
    handleAcademicYear('', selectedAcademicYear);
    setFilterData({
      branch: '',
      grade: '',
    });
  }, [moduleId]);

  function getBranch(acadId) {
    if (moduleId) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData((prev) => {
              return {
                ...prev,
                branch: result.data?.data?.results,
              };
            });
          }
          setLoading(false);
        })
        .catch((error) => {});
    }
  }

  const handleAcademicYear = (event, value) => {
    setDropdownData({
      ...dropdownData,
      branch: [],
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getBranch(value?.id);
      setFilterData({ ...filterData, selectedAcademicYear });
    }
  };

  function getGrade(acadId, branchId) {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              grade: result.data?.data,
            };
          });
        }
        setLoading(false);
      })
      .catch((error) => {});
  }

  const handleBranch = (event, value) => {
    setDropdownData({
      ...dropdownData,
      grade: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
    });
    if (value) {
      getGrade(selectedAcademicYear?.id, value?.branch?.id);
      setFilterData({ ...filterData, branch: value });
      const selectedId = value?.branch?.id;
      setSelectedBranch(value);
      setSelectedBranchIds(selectedId);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedId}&module_id=${moduleId}`,
        'gradeList'
      );
    }
  };

  const handleGrade = (event = {}, value = []) => {
    if (value) {
      setSectionList([]);
      setSelectedSection([]);
      setSelectedSectionIds('');

      const selectedId = value?.grade_id;
      setSelectedGrade(value);
      setSelectedGradeIds(selectedId);
      callApi(
        `${endpoints.academics.sections}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedBranchIds}&grade_id=${selectedId?.toString()}&module_id=${moduleId}`,
        'section'
      );
    } else {
      setSelectedGrade([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedGradeIds('');
      setSelectedSectionIds('');
    }
  };

  const handleSection = (event = {}, value = []) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionList].filter(({ id }) => id !== 'all')
          : value;
      const selectedsecctionId = value.map((item) => item.section_id || []);
      // const selectedsecctionId = value?.section_id;
      const sectionid = value.map((item) => item.id || []);
      setSectionId(sectionid);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
    } else {
      setSectionId('');
      setSelectedSection([]);
      setSelectedSectionIds('');
    }
  };

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
            setLoading(false);
          }
          if (key === 'section') {
            const selectAllObject = {
              session_year: {},
              id: 'all',
              section__section_name: 'Select All',
              section_name: 'Select All',
              section_id: 'all',
            };
            const data = [selectAllObject, ...result?.data?.data];
            setSectionList(data);
            setLoading(false);
          }
        } else {
          setLoading(false);
          console.log('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };
  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];
  const statuss = [
    { label: 'Assigned', value: '1' },
    { label: 'Unassigned', value: '2' },
  ];
  const handleChanges = (event) => {
    setMonth(event.target.value);
  };
  const handleStatus = (event, val) => {
    setStatus(val);
  };

  const viewBlog = () => {
    history.push('/blog/blogview');
  };
  const blogsContent = [
    {
      label: 'Public Speaking',
      value: '1',
    },
    {
      label: 'Post Card Writting',
      value: '2',
    },
    {
      label: 'Blog Card Writting',
      value: '3',
    },
  ];
  const handleStartDateChange = (val) => {
    setStartDate(val);
  };
  const PreviewBlog = () => {
    history.push('/blog/blogview');
  };
  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);
      // const branchIds = props.selectedBranch.map((obj) => obj.id);
      // const gradeIds = props.selectedGrade?.id

      axios
        .get(
          `${
            endpoints.newBlog.studentSideApi
          }?section_ids=null&user_id=null&activity_detail_id=${
            ActivityId?.id
          }&is_reviewed=True&branch_ids=${
            props.selectedBranch?.id == '' ? null : props.selectedBranch?.id
          }&grade_id=${
            props?.selectedGrade
          }&is_bookmarked=True&is_published=False&page=${currentPage}&page_size=${limit}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          console.log(response, 'response');
          props.setFlag(false);
          setTotalCount(response?.data?.count);
          setTotalPages(response?.data?.page_size);
          setCurrentPage(response?.data?.page);
          setLimit(Number(limit));
          setAlert('success', response?.data?.message);
          setTotalSubmitted(response?.data?.result);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);

  const handlePagination = (event, page) => {
    setIsClicked(true);
    setCurrentPage(page);
  };

  const handlePublishMenu = (data) => {
    setUserInform(data?.booked_user);
    setBookingId(data?.id);
    handleClickOpen();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setActivityLevel('');
    setOpen(false);
  };

  const top100Films = [
    { title: 'Intra Orchids Level', id: 1 },
    { title: 'Branch Level', id: 2 },
    { title: 'Grade Level', id: 3 },
    { title: 'Section Level', id: 4 },
  ];

  const userDetails = [{ name: 'Sujit', erp_no: '23294293232' }];

  const handleLevelChange = (event, data) => {
    setActivityLevel(data);
  };

  const handlePublish = (event, data) => {
    setLoading(true);
    if (!activityLevel) {
      setLoading(false);
      setAlert('error', 'Please Select Level');
      return;
    } else {
      let requestData = {
        booking_id: bookingId,
        is_published: true,
        publish_level: activityLevel?.title,
        is_best_blog: checked,
      };
      axios
        .post(`${endpoints.newBlog.publishBlogWallApi}`, requestData, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((res) => {
          if (res?.data?.status_code == 200) {
            setLoading(false);
            setAlert('success', res?.data?.message);
            getTotalSubmitted();
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlert('error', 'Server Error');
        });

      setActivityLevel('');
    }

    setOpen(false);
  };

  const handleChangeSwitch = (e) => {
    console.log(e.target.checked, 'kp');
    setChecked(e.target.checked);
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      // width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Student's Name</span>,
      // dataIndex: 'title',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.booked_user?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP ID</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.booked_user?.username}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Submission Date</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.submitted_on?.substring(0, 10)}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Reviewed By</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.reviewer}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          <StyledRating
            // name={`rating${index}`}
            size='small'
            readOnly
            defaultValue={row?.user_reviews?.given_rating}
            max={parseInt(row?.user_reviews?.level?.rating)}
          />
        </span>
      ),
    },
    // {
    //   title: <span className='th-white th-fw-700'>Status</span>,
    //   // dataIndex: 'created_at',
    //   align: 'center',
    //   render: (text, row) => (
    //     <span className='th-black-1'>
    //       {row?.is_bookmarked == true ? <BookmarksIcon style={{ color: 'gray' }} /> : ''}
    //     </span>
    //   ),
    // },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<UserAddOutlined className='th-14' />}
            color='green'
            className='th-br-5 th-pointer py-1'
            disabled={userLevel == '11' || userLevel == '8' ? true : false}
            onClick={() => handlePublishMenu(row)}
          >
            <span className='th-fw-500 th-14'>Publish</span>
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading && <Loader />}
      <div className='col-12 px-0'>
        <TableAnt
          columns={columns}
          dataSource={totalSubmitted}
          className='th-table'
          rowClassName={(record, index) =>
            `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
          }
          loading={loading}
          pagination={false}
          scroll={{ x: totalSubmitted.length > 0 ? 'max-content' : null, y: 600 }}
        />
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle
          style={{ display: 'flex', margin: 'auto' }}
          id='alert-dialog-slide-title'
        >
          {'User Details'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <div>
              <div>
                <div>
                  <p>Name : {userInform?.name}</p>
                  <p>ERP : {userInform?.username}</p>
                </div>
              </div>
              <div>
                <Autocomplete
                  size='small'
                  id='combo-box-demo'
                  options={top100Films || []}
                  value={activityLevel || ''}
                  onChange={handleLevelChange}
                  getOptionLabel={(option) => option.title || ''}
                  style={{ width: 300 }}
                  filterSelectedOptions
                  required
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size='small'
                      label='Level'
                      placeholder='Level'
                      variant='outlined'
                    />
                  )}
                />
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checked}
                      onChange={handleChangeSwitch}
                      value='bestBlog'
                      color='primary'
                    />
                  }
                  label='Best Blogs'
                />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ display: 'flex', margin: 'auto' }}>
          <Button
            icon={<UserAddOutlined className='th-14' />}
            type='primary'
            onClick={handlePublish}
          >
            Publish
          </Button>
          <Button
            icon={<CloseOutlined className='th-14' />}
            type='primary'
            variant='contained'
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Grid
        container
        style={{
          display: 'flex',
          paddingLeft: '24px',
          paddingRight: '42px',
          paddingTop: '31px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            className={classes.buttonColor}
          >
            Shortlisted({totalSubmitted?.length})
          </Button>
        </Grid>
        <Grid item style={{ fontSize: '16px' }}>
          <StarsIcon style={{ color: '#F7B519' }} /> Published
        </Grid>
      </Grid>
      <Paper className={`${classes.root} common-table`} id='singleStudent'>
        <TableContainer
          className={`table table-shadow view_users_table ${classes.container}`}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className={`${classes.columnHeader} table-header-row`}>
              <TableRow>
                <TableCell className={classes.tableCell} style={{ whiteSpace: 'nowrap' }}>
                  S No.
                </TableCell>
                <TableCell className={classes.tableCell}>Student Name</TableCell>
                <TableCell className={classes.tableCell}>ERP ID</TableCell>
                <TableCell className={classes.tableCell}>Submission Date</TableCell>
                <TableCell className={classes.tableCell}>Reviewed By</TableCell>
                <TableCell className={classes.tableCell}>Overall Score</TableCell>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell style={{ width: '237px' }} className={classes.tableCell}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted?.map((response, index) => (
              <TableBody>
                <TableRow hover role='checkbox' tabIndex={-1}>
                  <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.booked_user?.name}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.booked_user?.username}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.submitted_on.slice(0, 10)}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.reviewer}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    <Box component='fieldset' mb={3} borderColor='transparent'>
                      <StyledRating
                        name={`rating${index}`}
                        size='small'
                        readOnly
                        precision={0.5}
                        defaultValue={response?.user_reviews?.given_rating}
                        max={parseInt(response?.user_reviews?.level?.rating)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    <StarsIcon style={{ color: '#F7B519' }} />
                  </TableCell>

                  <TableCell className={classes.tableCells}>
                    <Button
                      variant='outlined'
                      className={
                        userLevel == '11' || userLevel == '8'
                          ? classes.buttonDisable
                          : classes.buttonColor2
                      }
                      disabled={userLevel == '11' || userLevel == '8' ? true : false}
                      onClick={() => handlePublishMenu(response)}
                    >
                      Publish
                    </Button>
                    &nbsp;
                    <Dialog
                      open={open}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={handleClose}
                      aria-labelledby='alert-dialog-slide-title'
                      aria-describedby='alert-dialog-slide-description'
                    >
                      <DialogTitle
                        style={{ display: 'flex', margin: 'auto' }}
                        id='alert-dialog-slide-title'
                      >
                        {'User Details'}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id='alert-dialog-slide-description'>
                          <div>
                            <div>
                              <div>
                                <p>Name : {userInform?.name}</p>
                                <p>ERP : {userInform?.username}</p>
                              </div>
                            </div>
                            <div>
                              <Autocomplete
                                size='small'
                                id='combo-box-demo'
                                options={top100Films || []}
                                value={activityLevel || ''}
                                onChange={handleLevelChange}
                                getOptionLabel={(option) => option.title || ''}
                                style={{ width: 300 }}
                                filterSelectedOptions
                                required
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
                                    label='Level'
                                    placeholder='Level'
                                    variant='outlined'
                                  />
                                )}
                              />
                            </div>
                            <div>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={checked}
                                    onChange={handleChangeSwitch}
                                    value='bestBlog'
                                    color='primary'
                                  />
                                }
                                label='Best Blogs'
                              />
                            </div>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions style={{ display: 'flex', margin: 'auto' }}>
                        <Button
                          onClick={handlePublish}
                          color='primary'
                          variant='contained'
                        >
                          Publish
                        </Button>
                        <Button variant='contained' color='primary' onClick={handleClose}>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          <TablePagination
            component='div'
            count={totalCount}
            rowsPerPage={limit}
            page={Number(currentPage) - 1}
            onChangePage={(e, page) => {
              handlePagination(e, page);
            }}
            rowsPerPageOptions={false}
            className='table-pagination'
            classes={{
              spacer: classes.tablePaginationSpacer,
              toolbar: classes.tablePaginationToolbar,
            }}
          />
        </TableContainer>
      </Paper> */}
    </>
  );
};
export default Shortlisted_1;
