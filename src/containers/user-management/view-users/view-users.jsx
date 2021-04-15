/* eslint-disable dot-notation */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import Chip from '@material-ui/core/Chip';
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
import './styles.scss';

const useStyles = makeStyles((theme) => ({
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
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
}));

// eslint-disable-next-line no-unused-vars
const ViewUsers = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [gradeIds, setGradeIds] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
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

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

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

  const getYearApi = async () => {
    try {
      const result = await axiosInstance.get(`/erp_user/list-academic_year/?module_id=${moduleId}`);
      if (result.status === 200) {
        setAcademicYearList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };


  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.branches}?session_year=${selectedYear.id}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        const transformedResponse = result?.data?.data?.results.map(obj => ((obj && obj.branch) || {}));
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
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch.id}&module_id=${moduleId}`);
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
    const rolesId = [];
    const gradesId = [];
    if (selectedRoles && selectedRoles !== 'All') {
      rolesId.push(selectedRoles.id);
    }
    /*
    if (selectedGrades.length && !selectedGrades.includes('All')) {
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
    }
    */
    let getUserListUrl = `${endpoints.communication.userList}?page=${currentPage}&page_size=${limit}&module_id=${moduleId}`;
    if (rolesId.length && selectedRoles !== 'All') {
      getUserListUrl += `&role=${rolesId.toString()}`;
    }
    /*
    if (gradesId.length && !selectedGrades.includes('All')) {
      getUserListUrl += `&grade=${gradesId.toString()}`;
    }
    */
    if (gradeIds.length && !selectedGrades.includes('All')) {
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
      if (result.status === 200) {
        setTotalCount(result.data.count);
        result.data.results.map((items) =>
          resultUsers.push({
            userId: items.id,
            userName: `${items.user.first_name} ${items.user.last_name}`,
            erpId: items.erp_id,
            emails: items.user.email,
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
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setSelectedYear('');
    setSelectedRoles('')
    setSelectedBranch(null);
    setSelectedGrades([]);
    setSelectedRoles(null);
    setCurrentPage(1);
    setIsNewSearch(true);
  };

  const handleTextSearch = (e) => {
    setIsNewSearch(true);
    setSearchText(e.target.value);
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
        setUsersData(tempGroupData);
      } else {
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handleDelete = async (id, index) => {
    setDeleteId(id);
    setDeleteIndex(index);
    setDeleteAlert(true);
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
        setDeleteIndex(null);
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
    setDeleteAlert(false);
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
    if (moduleId) getYearApi();
  }, [moduleId]);

  useEffect(() => {
    if(moduleId) {
      getUsersData();
    }
  }, [currentPage,moduleId]);

  useEffect(() => {
    if (selectedYear) {
      getBranchApi();
    }
  }, [selectedYear]);

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
  }, [isNewSeach,moduleId]);

  const handleYear = (event, value) => {
    setSelectedYear('');
    setSelectedBranch('');
    setBranchList([]);
    setGradeList([]);
    setSelectedGrades([]);
    if (value) {
      setSelectedYear(value);
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
    console.log(value);

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
      <div className='view-users-page'>
        <div className='inner-container'>
          <div className='bread-crumbs-container'>
            <CommonBreadcrumbs
              componentName='User Management'
              childComponentName='View Users'
            />
          </div>
          <Grid container spacing={4} className='form-container spacer'>
            <Grid item xs={12} md={3}>
              <FormControl
                variant='outlined'
                className={classes.formControl}
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
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                //onChange={(e) => setSelectedRoles(e.target.value)}
                onChange={(event, value) => {
                  setSelectedRoles(value);
                }}
                id='role_id'
                //className='dropdownIcon'
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
            {/*
            <Grid item xs={12} md={3}>
              <FormControl
                variant='outlined'
                className={classes.formControl}
                fullWidth
                size='small'
              >
                <InputLabel>Role</InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={selectedRoles}
                  onChange={(e) => setSelectedRoles(e.target.value)}
                  label='Role'
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {roleList.map((items, index) => (
                    <MenuItem key={`role_user_details_${index}`} value={items.id}>
                      {items.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            */}
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                //onChange={(e) => setSelectedBranch(e.target.value)}
                onChange={handleYear}
                id='branch_id'
                //className='dropdownIcon'
                value={selectedYear || ''}
                options={academicYearList || []}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Select Year'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                //onChange={(e) => setSelectedBranch(e.target.value)}
                onChange={handleBranch}
                id='branch_id'
                //className='dropdownIcon'
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

            {/*
            <Grid item xs={12} md={3}>
              <FormControl
                variant='outlined'
                className={classes.formControl}
                fullWidth
                size='small'
              >
                <InputLabel id='demo-simple-select-outlined-label'>Branch</InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  label='Branch'
                  color='primary'
                >
                  <MenuItem value='' style={{position: 'relative'}}>
                    <em>None</em>
                  </MenuItem>
<<<<<<< HEAD
                  {branchList.map((items, index) => (
                    <MenuItem key={`branch_user_details_${index}`} value={items.id} style={{position: 'relative'}}>
=======
<<<<<<< HEAD
                  {branchList?.map((items, index) => (
                    <MenuItem key={`branch_user_details_${index}`} value={items.id}>
=======
                  {branchList.map((items, index) => (
                    <MenuItem key={`branch_user_details_${index}`} value={items.id} style={{position: 'relative'}}>
>>>>>>> develop
>>>>>>> dd73581248eaccccae2e5476c720dfe72c22c21b
                      {items.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            */}
            <Grid item xs={12} sm={3}>
              <Autocomplete
                //key={clearKey}
                multiple
                size='small'
                onChange={handleGrade}
                id='create__class-branch'
                options={gradeList}
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

            {/* selectedBranch && selectedBranch.id && (
              <Grid item xs={12} md={3}>
                <FormControl
                  variant='outlined'
                  className={classes.formControl}
                  fullWidth
                  size='small'
                >
                  <InputLabel id='demo-simple-select-outlined-label'>Grade</InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    variant='outlined'
                    value={selectedGrades}
                    onChange={(e) => {
                      const values = e.target.value;
                      if (values.includes('none')) {
                        setSelectedGrades([]);
                      } else {
                        setSelectedGrades(e.target.value);
                      }
                    }}
                    label='Grade'
                    color='primary'
                    multiple
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value, index) => (
                          <Chip
                            key={`${value}_${index}`}
                            label={value}
                            className={classes.chip}
                            onDelete={() => {
                              setSelectedGrades(
                                selectedGrades.filter((item) => item !== value)
                              );
                            }}
                            onMouseDown={(event) => {
                              event.stopPropagation();
                            }}
                          />
                        ))}
                      </div>
                    )}
                  >
                    <MenuItem value='none'>
                      <em>None</em>
                    </MenuItem>
                    {grade.map((item, index) => (
                      <MenuItem key={`branch_user_details_${index}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
                    ) */}
          </Grid>
          <Grid container className='spacer'>
            <Grid item xs={12} md={2}>
              <Box
                style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
              >
                <Button
                  variant='contained'
                  onClick={handleResetFilters}
                  className='disabled-btn'
                  fullWidth
                >
                  CLEAR ALL
                </Button>
              </Box>
            </Grid>
          </Grid>
        </div>
        {/* <span className='view_users__reset_icon' onClick={handleResetFilters}>
          <SettingsBackupRestoreIcon />
        </span> */}
        {/* <div className='view_users_filter_wrapper'>
          <div className='user_details_role_wrapper'>
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel id='demo-simple-select-outlined-label'>Role</InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={selectedRoles}
                onChange={(e) => setSelectedRoles(e.target.value)}
                label='Role'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {roleList.map((items, index) => (
                  <MenuItem key={`role_user_details_${index}`} value={items.id}>
                    {items.role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='user_details_branch_wrapper'>
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel id='demo-simple-select-outlined-label'>Branch</InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                label='Branch'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {branchList.map((items, index) => (
                  <MenuItem key={`branch_user_details_${index}`} value={items.id}>
                    {items.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {selectedBranch ? (
            <div>
              <CustomMultiSelect
                selections={selectedGrades}
                setSelections={setSelectedGrades}
                nameOfDropdown='Grade'
                optionNames={grade}
              />
            </div>
          ) : null}
        </div> */}
        <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
          <DialogTitle
            style={{ cursor: 'move', color: '#014b7e' }}
            id='draggable-dialog-title'
          >
            Delete User
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button color='primary' onClick={handleDeleteConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/* {deleteAlert ? (
        <div className='view_users_delete_alert_wrapper'>
          <span className='view_users_delete_alert_tag'>
            Do you want to Delete the user
          </span>
          <div className='view_users_delete_alert_button_wrapper'>
            <input
              className='view_users_delete_alert_button'
              type='button'
              onClick={handleDeleteConfirm}
              value='Delete'
            />
            <input
              className='view_users_delete_alert_button'
              type='button'
              onClick={handleDeleteCancel}
              value='cancel'
            />
          </div>
        </div>
      ) : null} */}
        {!isMobile && (
          <Paper className={`${classes.root} common-table`}>
            <TableContainer
              className={`table table-shadow view_users_table ${classes.container}`}
            >
              <Table stickyHeader aria-label='sticky table'>
                <TableHead className={`${classes.columnHeader} table-header-row`}>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Name</TableCell>
                    <TableCell className={classes.tableCell}>ERP Id</TableCell>
                    <TableCell className={classes.tableCell}>Email</TableCell>
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
                      <TableCell className={classes.tableCell}>
                        {items.active ? (
                          <div style={{ color: 'green' }}>Activated</div>
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
                        {items.active ? (
                          <IconButton
                            aria-label='deactivate'
                            onClick={() => handleStatusChange(items.userId, i, '2')}
                            title='Deactivate'
                          >
                            <BlockIcon
                              style={{ color: themeContext.palette.primary.main }}
                            />
                          </IconButton>
                        ) : (
                          // <button
                          //   type='submit'
                          //   className='group_view_deactivate_button group_view_button'
                          //   title='Deactivate'
                          //   onClick={() => handleStatusChange(items.userId, i, '2')}
                          // >
                          //   D
                          // </button>
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

                        <IconButton
                          title='Delete'
                          onClick={() => handleDelete(items.userId, i)}
                        >
                          <DeleteOutlinedIcon
                            style={{ color: themeContext.palette.primary.main }}
                          />
                        </IconButton>
                        <IconButton title='Edit' onClick={() => handleEdit(items.userId)}>
                          <EditOutlinedIcon
                            style={{ color: themeContext.palette.primary.main }}
                          />
                        </IconButton>
                      </TableCell>
                      {/* <TableCell className={classes.tableCell}>
                      
                    </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <div className={`${classes.root} pagenation_view_groups`}>
              <Pagination
                page={Number(currentPage)}
                size='large'
                className='books__pagination'
                onChange={handlePagination}
                count={totalPages}
              />
            </div> */}
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
