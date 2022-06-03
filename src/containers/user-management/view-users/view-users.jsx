/* eslint-disable dot-notation */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SettingsBackupRestoreOutlined from '@material-ui/icons/SettingsBackupRestoreOutlined';
import BlockIcon from '@material-ui/icons/Block';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomMultiSelect from '../../communication/custom-multiselect/custom-multiselect';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
// import './view-users.css';
import ViewUserCard from '../../../components/view-user-card';
import { CSVLink } from 'react-csv';
import FileSaver from 'file-saver';
import { connect, useSelector } from 'react-redux';
import './styles.scss';
import {
  Tooltip,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Loader from '../../../components/loader/loader';
import RestoreIcon from '@material-ui/icons/Restore';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: 440,
  },
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 250,
  },
  cardsPagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
    color: '#ffffff',
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
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  downloadExcel: {
    float: 'right',
    padding: '8px 15px',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 400,
    textDecoration: 'none',
    backgroundColor: '#fe6b6b',
    color: '#ffffff',
  },
}));

// const StyledButton = withStyles({
//   root: {
//     backgroundColor: '#FF6B6B',
//     color: '#FFFFFF',
//     padding: '7px 15px',
//     '&:hover': {
//       backgroundColor: '#FF6B6B !important',
//     },
//   }
// })(Button);

// eslint-disable-next-line no-unused-vars

const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const ViewUsers = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedRoles, setSelectedRoles] = useState(null);
  // const [selectedYear, setSelectedYear] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [gradeIds, setGradeIds] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [grade, setGrade] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [isNewSeach, setIsNewSearch] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [deactivateId, setDeactivateId] = useState(null);
  const [deactivateIndex, setDeactivateIndex] = useState(null);
  const [deactivateStatus, setDeactivateStatus] = useState(null);
  const [deactivateAlert, setDeactivateAlert] = useState(false);
  const [accordianOpen, setAccordianOpen] = useState(false);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [excelData] = useState([]);
  const [classStatus, setClassStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const [restoreAlert, setRestoreAlert] = useState(false);
  const [restoreIndex, setRestoreIndex] = useState(null);
  const [restoreId, setRestoreId] = useState(null);
  const [restoreStatus, setRestoreStatus] = useState(null);

  const headers = [
    { label: 'ERP ID', key: 'erp_id' },
    { label: 'Firstname', key: 'first_name' },
    { label: 'Lastname', key: 'last_name' },
    { label: 'Username', key: 'username' },
    { label: 'Email ID', key: 'email' },
    { label: 'Contact', key: 'contact' },
    { label: 'Gender', key: 'gender' },
    { label: 'Profile', key: 'role_name' },
    { label: 'Grade', key: 'grade_name' },
    { label: 'Section', key: 'section_name' },
    { label: 'Status', key: 'status' },
  ];

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item?.child_name === 'View User') {
              setModuleId(item?.child_id);
            }
          });
        }
      });
    }
  }, []);

  const getRoleApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.roles, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setRoleList(result.data.result);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  // const getYearApi = async () => {
  //   try {
  //     const result = await axiosInstance.get(
  //       `/erp_user/list-academic_year/?module_id=${moduleId}`
  //     );
  //     if (result.status === 200) {
  //       setAcademicYearList(result.data?.data);
  //       const defaultYear = result.data?.data?.[0];
  //       setSelectedYear(defaultYear);
  //     } else {
  //       setAlert('error', result.data.message);
  //     }
  //   } catch (error) {
  //     setAlert('error', error.message);
  //   }
  // };

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.branches}?session_year=${selectedYear.id}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        const transformedResponse = result?.data?.data?.results.map(
          (obj) => (obj && obj.branch) || {}
        );
        // setBranchList(result.data.data);
        setBranchList(transformedResponse);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getGradeApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch.id}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getUsersData = async () => {
    setLoading(true);
    const rolesId = [];
    const gradesId = [];
    if (selectedRoles && selectedRoles !== 'All') {
      selectedRoles.map((each, key) => {
        rolesId.push(each.id);
      });
    }
    let getUserListUrl = `${endpoints.communication.userList}?page=${currentPage}&page_size=${limit}&module_id=${moduleId}&session_year=${selectedYear?.id}`;
    if (classStatus && classStatus != 1 && classStatus != 0) {
      let status = classStatus - 1;
      getUserListUrl += `&status=${status.toString()}`;
    }
    if (rolesId && rolesId.length > 0 && selectedRoles !== 'All') {
      getUserListUrl += `&role=${rolesId.toString()}`;
    }
    if (selectedBranch && selectedBranch !== null) {
      getUserListUrl += `&branch_id=${selectedBranch?.id.toString()}`;
    }
    if (gradeIds.length > 0 && !selectedGrades.includes('All')) {
      getUserListUrl += `&grade=${gradeIds.toString()}`;
    }
    if (searchText) {
      getUserListUrl += `&search=${searchText}`;
    }
    try {
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultUsers = [];
      excelData.length = 0;

      if (result.status === 200) {
        setLoading(false);
        setTotalCount(result.data.count);

        result.data.results.map((items) =>
          resultUsers.push({
            userId: items.id,
            userName: `${items.user.first_name} ${items.user.last_name}`,
            erpId: items.erp_id,
            status: items?.status,
            emails: items.user.email,
            role: items?.roles?.role_name,
            active: items.is_active,
          })
        );
        setUsersData(resultUsers);
        setTotalPages(result.data.total_pages);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handlePagination = (event, page) => {
    setIsClicked(true);
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchText('');
    // setSelectedYear('');
    setSelectedRoles(null);
    setSelectedBranch(null);
    setSelectedGrades([]);
    setClassStatus(1);
    setCurrentPage(1);
    setIsNewSearch(true);
  };

  const handleExcel = () => {
    setLoading(true);
    const rolesId = [];
    const gradesId = [];
    if (selectedRoles && selectedRoles !== 'All') {
      selectedRoles.map((each, i) => {
        rolesId.push(each.id);
      });
    }
    if (selectedGrades && selectedGrades !== 'All') {
      selectedGrades.map((each, i) => {
        gradesId.push(each.id);
      });
    }
    let getUserListUrl = `communication/erp-user-info-excel/?module_id=${moduleId}`;
    if (rolesId.length > 0 && selectedRoles !== 'All') {
      rolesId.map((each, i) => {
        getUserListUrl += `&role=${each.toString()}`;
      });
    }
    // /*
    if (gradesId.length > 0 && selectedGrades !== 'All') {
      gradesId.map((each, i) => {
        getUserListUrl += `&grade=${each.toString()}`;
      });
    }
    if (classStatus && classStatus != 1 && classStatus != 0) {
      let status = classStatus - 1;
      getUserListUrl += `&status=${status.toString()}`;
    }
    // */
    // if (gradeIds.length && !selectedGrades.includes('All')) {
    //   getUserListUrl += `&grade=${gradeIds.toString()}`;
    // }
    if (searchText) {
      getUserListUrl += `&search=${searchText}`;
    }
    axiosInstance
      .get(`${getUserListUrl}`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'user_list.xls');
        setLoading(false);
      })
      .catch((error) => setAlert('error', 'Something Wrong!'));
  };

  const debounceCallback = useCallback(
    debounce((value) => {
      setIsNewSearch(true);
    }, 500),
    []
  );

  const handleTextSearch = (e) => {
    let search = e.target.value;
    setSearchText(e.target.value);
    if (search.length > 1) {
      debounceCallback(search);
    } else {
      setIsNewSearch(false);
    }
  };

  const handleDeactivate = async (id, index, status) => {
    setDeactivateId(id);
    setDeactivateIndex(index);
    setDeactivateStatus(status);
    setDeactivateAlert(true);
  };
  const handleStatusChange = async (id, index, sendstatus) => {
    try {
      const request = {
        status: sendstatus,
      };
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.userStatusChange}${id}/update-user-status/`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (statusChange.status === 200) {
        setAlert('success', statusChange.data.message);
        const tempGroupData = JSON.parse(JSON.stringify(usersData));
        const active = !usersData[index].active;
        const newData = { ...tempGroupData[index], active };
        tempGroupData.splice(index, 1, newData);
        setStatus(true);
        setUsersData(tempGroupData);
      } else {
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  // Restore User handler
  const handleRestore = async (id, index, status) => {
    setRestoreId(id);
    setRestoreIndex(index);
    setRestoreStatus(status);
    setRestoreAlert(true);
  };

  // Restore User API Call
  const handleRestoreConfirm = async () => {
    try {
      const request = {
        status: restoreStatus,
      };
      const restored = await axiosInstance.put(
        `${endpoints.communication.userStatusChange}${restoreId}/restore-user/`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (restored.status === 200) {
        setAlert('success', restored.data.message);
        const tempGroupData = JSON.parse(JSON.stringify(usersData));
        const active = true;
        const newData = { ...tempGroupData[restoreIndex], active };
        tempGroupData.splice(restoreIndex, 1);
        setUsersData(tempGroupData);
        setRestoreAlert(false);
      } else {
        setAlert('error', restored.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleDelete = async (id, index, status) => {
    setDeleteId(id);
    setDeleteIndex(index);
    setDeleteStatus(status);
    setDeleteAlert(true);
  };
  const handleDeactivateUser = async () => {
    try {
      const request = {
        status: deactivateStatus,
      };
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.userStatusChange}${deactivateId}/update-user-status/`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (statusChange.status === 200) {
        setAlert('success', statusChange.data.message);
        const tempGroupData = JSON.parse(JSON.stringify(usersData));
        const active = !usersData[deactivateIndex].active;
        const newData = { ...tempGroupData[deactivateIndex], active };
        tempGroupData.splice(deactivateIndex, 1, newData);
        setUsersData(tempGroupData);
        setDeactivateId(null);
        setLoading(true);
        setStatus(true);
        setDeactivateIndex(null);
        setDeactivateStatus(null);
        setDeactivateAlert(false);
      } else {
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const statusChange = await axiosInstance.delete(
        `${endpoints.communication.userStatusChange}${deleteId}/delete-user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (statusChange.status === 200) {
        setAlert('success', statusChange.data.message);
        const tempGroupData = usersData.slice();
        tempGroupData.splice(deleteIndex, 1);
        setUsersData(tempGroupData);
        setDeleteId(null);
        setLoading(true);
        setStatus(true);
        setDeleteIndex(null);
        setDeleteStatus(null);
        setDeleteAlert(false);
      } else {
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteIndex(null);
    setDeleteStatus(null);
    setDeleteAlert(false);
    setRestoreAlert(false);
  };

  const handleDeactivateCancel = () => {
    setDeactivateId(null);
    setDeactivateIndex(null);
    setDeactivateStatus(null);
    setDeactivateAlert(false);
  };
  const handleEdit = (id) => {
    history.push(`/user-management/edit-user/${id}`);
  };

  useEffect(() => {
    setIsNewSearch(true);
  }, [selectedRoles, selectedGrades]);

  useEffect(() => {
    getRoleApi();
    // getBranchApi();
  }, []);

  useEffect(() => {
    if (moduleId && selectedYear) getBranchApi();
  }, [moduleId, selectedYear]);

  useEffect(() => {
    if (moduleId && isClicked) {
      setIsClicked(false);
      getUsersData();
    }
  }, [currentPage, moduleId]);

  // useEffect(() => {
  //   if (selectedYear) {
  //     getBranchApi();
  //   }
  // }, [selectedYear]);

  useEffect(() => {
    if (status) {
      setStatus(false);
      getUsersData();
    }
  }, [status]);

  useEffect(() => {
    if (selectedBranch) {
      setGrade(['All']);
      setSelectedGrades([]);
      getGradeApi();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (isNewSeach && moduleId) {
      setIsNewSearch(false);
      setCurrentPage(1);
      getUsersData();
    }
  }, [isNewSeach, moduleId]);

  const handleYear = (event = {}, value = '') => {
    // setSelectedYear('');
    setSelectedBranch('');
    setBranchList([]);
    setGradeList([]);
    setSelectedGrades([]);
    if (value) {
      // setSelectedYear(value);
    }
  };

  const handleBranch = (event, value) => {
    setSelectedBranch('');
    setGradeList([]);
    if (value) {
      setSelectedBranch(value);
    }
  };

  const handleGrade = (event, value) => {
    setSelectedGrades(value);
    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      setGradeIds(ids);
      // listSubjects(ids)
    } else {
      setGradeIds([]);
      setSelectedGrades([]);
    }
  };

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='User Management'
        childComponentName='View Users'
      />
      <div className='filter-container'>
        {loading && <Loader />}
        <Grid container sm={12} spacing={3} alignItems='center'>
          <Grid item sm={11} md={11} xs={11}>
            <FormControl
              variant='outlined'
              className={'searchViewUser'}
              fullWidth
              size='small'
            >
              <InputLabel>Search</InputLabel>
              <OutlinedInput
                endAdornment={<SearchOutlined color='primary' />}
                placeholder='Search users ..'
                label='Search'
                value={searchText}
                onChange={handleTextSearch}
              />
            </FormControl>
          </Grid>
          <Grid item sm={2} md={2} xs={2}>
            <Tooltip title='Create User' placement='bottom' arrow>
              <IconButton
                className='create-user-button'
                onClick={() => {
                  history.push('/user-management/create-user')
                }}
              >
                <AddIcon style={{ color: '#ffffff' }} />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item sm={8} md={9} xs={9}>
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
                  <Grid item md={4} sm={4} xs={12}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      multiple
                      fullWidth
                      size='small'
                      onChange={(event, value) => {
                        setSelectedRoles(value);
                      }}
                      id='role_id'
                      className='dropdownIcon'
                      value={selectedRoles?.role_name}
                      options={roleList}
                      getOptionLabel={(option) => option?.role_name}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Role'
                          placeholder='Select Role'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      //onChange={(e) => setSelectedBranch(e.target.value)}
                      onChange={handleBranch}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedBranch}
                      options={branchList}
                      getOptionLabel={(option) => option?.branch_name}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Branch'
                          placeholder='Select Branch'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={4} xs={12} sm={3}>
                    <Autocomplete
                      //key={clearKey}
                      multiple
                      size='small'
                      onChange={handleGrade}
                      id='create__class-branch'
                      options={gradeList}
                      className='dropdownIcon'
                      getOptionLabel={(option) => option?.grade__grade_name}
                      filterSelectedOptions
                      value={selectedGrades}
                      renderInput={(params) => (
                        <TextField
                          className='create__class-textfield'
                          {...params}
                          variant='outlined'
                          label='Grades'
                          placeholder='Select Grades'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={4} sm={3} xs={3}>
                    <FormControl fullWidth margin='dense' variant='outlined'>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={classStatus || 1}
                        label='Status'
                        name='statusTypeFilter'
                        onChange={(eve) => {
                          setClassStatus(eve.target.value);
                        }}
                      >
                        <MenuItem value={'1'}>All</MenuItem>
                        <MenuItem value={'2'}>Active</MenuItem>
                        <MenuItem value={'3'}>Deactive</MenuItem>
                        <MenuItem value={'4'}>Deleted</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={3} ml={4}>
                    <Button
                      style={{ marginTop: '5px' }}
                      variant='contained'
                      color='primary'
                      onClick={() => getUsersData()}
                      fullWidth={true}
                    >
                      View
                    </Button>
                  </Grid>
                  <Grid item md={3} sm={3} xs={3}>
                    <Button
                      style={{ marginTop: '5px' }}
                      variant='contained'
                      color='primary'
                      onClick={handleExcel}
                      fullWidth={true}
                    >
                      Download
                    </Button>
                  </Grid>
                  <Grid item md={3} sm={3} xs={3}>
                    <Button
                      style={{ marginTop: '5px' }}
                      variant='contained'
                      color='primary'
                      onClick={handleResetFilters}
                      fullWidth={true}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </div>
      <div className='view-users-page'>
        <Dialog open={deactivateAlert} onClose={handleDeleteCancel}>
          <DialogTitle id='draggable-dialog-title'>Deactivate User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Deactivate this user ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeactivateCancel} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleDeactivateUser}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
          <DialogTitle id='draggable-dialog-title'>Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleDeleteConfirm}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Resore user Dialog Box */}
        <Dialog open={restoreAlert} onClose={handleDeleteCancel}>
          <DialogTitle id='draggable-dialog-title'>Restore User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to restore this user ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleRestoreConfirm}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {!isMobile && (
          <Paper className={`${classes.root} common-table`}>
            {loading && <Loader />}
            <TableContainer
              className={`table table-shadow view_users_table ${classes.container}`}
            >
              <Table stickyHeader aria-label='sticky table'>
                <TableHead className={`${classes.columnHeader} table-header-row`}>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Name</TableCell>
                    <TableCell className={classes.tableCell}>ERP Id</TableCell>
                    <TableCell className={classes.tableCell}>Email</TableCell>
                    <TableCell className={classes.tableCell}>Role</TableCell>
                    <TableCell className={classes.tableCell}>Status</TableCell>
                    <TableCell className={classes.tableCell}>Action</TableCell>
                    {/* <TableCell className={classes.tableCell}>Edit</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersData.map((items, i) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={`user_table_index${i}`}
                    >
                      <TableCell className={classes.tableCell}>
                        {items.userName}
                      </TableCell>
                      <TableCell className={classes.tableCell}>{items.erpId}</TableCell>
                      <TableCell className={classes.tableCell}>{items.emails}</TableCell>
                      <TableCell className={classes.tableCell}>{items?.role}</TableCell>
                      <TableCell className={classes.tableCell}>
                        {items && items.status === 'active' ? (
                          <div style={{ color: 'green' }}>Activated</div>
                        ) : items && items.status === 'deleted' ? (
                          <div style={{ color: 'red' }}>Deleted</div>
                        ) : (
                          <div style={{ color: 'red' }}>Deactivated</div>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        className={classes.tableCell}
                      >
                        {items && items.status === 'deleted' ? (
                          <IconButton
                            title='Restore'
                            onClick={() => handleRestore(items.userId, i, '1')}
                          >
                            <RestoreIcon
                              style={{ color: themeContext.palette.primary.main }}
                            />
                          </IconButton>
                        ) : items.status === 'active' ? (
                          <IconButton
                            aria-label='deactivate'
                            onClick={() => handleDeactivate(items.userId, i, '2')}
                            title='Deactivate'
                          >
                            <BlockIcon
                              style={{ color: themeContext.palette.primary.main }}
                            />
                          </IconButton>
                        ) : (
                          <button
                            type='submit'
                            title='Activate'
                            onClick={() => handleStatusChange(items.userId, i, '1')}
                            style={{
                              borderRadius: '50%',
                              backgroundColor: 'green',
                              border: 0,
                              width: '30px',
                              height: '30px',
                              color: '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            A
                          </button>
                        )}
                        {items && items.status !== 'deleted' ? (
                          <>
                            <IconButton
                              title='Delete'
                              onClick={() => handleDelete(items.userId, i, '3')}
                            >
                              <DeleteOutlinedIcon
                                style={{ color: themeContext.palette.primary.main }}
                              />
                            </IconButton>
                            <IconButton
                              title='Edit'
                              onClick={() => handleEdit(items.userId)}
                            >
                              <EditOutlinedIcon
                                style={{ color: themeContext.palette.primary.main }}
                              />
                            </IconButton>{' '}
                          </>
                        ) : (
                          ''
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component='div'
              count={totalCount}
              rowsPerPage={limit}
              page={Number(currentPage) - 1}
              onChangePage={(e, page) => {
                handlePagination(e, page + 1);
              }}
              rowsPerPageOptions={false}
              className='table-pagination'
              classes={{
                spacer: classes.tablePaginationSpacer,
                toolbar: classes.tablePaginationToolbar,
              }}
            />
          </Paper>
        )}
        {isMobile && (
          <>
            <div className={classes.cardsContainer}>
              {usersData.map((user, i) => (
                <ViewUserCard
                  user={user}
                  onEdit={handleEdit}
                  onDelete={(userId) => {
                    handleDelete(userId, i);
                  }}
                  onRestore={(userId) => {
                    handleRestore(userId, i, '1');
                  }}
                  onStatusChange={(userId, status) => {
                    handleStatusChange(userId, i, status);
                  }}
                />
              ))}
            </div>
            <div className={classes.cardsPagination}>
              {/* <Pagination
              page={Number(currentPage)}	
              count={totalPages}
              onChange={handlePagination}
              color='primary'
              className='pagination-white'
            /> */}
              <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={Number(currentPage) - 1}
                onChangePage={(e, page) => {
                  handlePagination(e, page + 1);
                }}
                rowsPerPageOptions={false}
                className='table-pagination'
                classes={{
                  spacer: classes.tablePaginationSpacer,
                  toolbar: classes.tablePaginationToolbar,
                  caption: classes.tablePaginationCaption,
                }}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
});

export default ViewUsers;
