/* eslint-disable dot-notation */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-debugger */
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
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CustomMultiSelect from '../../communication/custom-multiselect/custom-multiselect';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './view-users.css';
import ViewUserCard from '../../../components/view-user-card';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '90%',
    marginLeft: '50px',
    marginTop: '50px',
  },
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
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
  },
}));

// eslint-disable-next-line no-unused-vars
const ViewUsers = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [grade, setGrade] = useState(['All']);
  const [roleList, setRoleList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [isNewSeach, setIsNewSearch] = useState(true);
  const [searchText, setSearchText] = useState('');

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

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

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.branches, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setBranchList(result.data.data);
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
        `${endpoints.communication.grades}?branch_id=${selectedBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.grade__grade_name));
        if (selectedBranch) {
          setGrade(['All', ...resultOptions]);
        }
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
      rolesId.push(selectedRoles);
    }
    if (selectedGrades.length && !selectedGrades.includes('All')) {
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
    }
    let getUserListUrl = `${endpoints.communication.userList}?page=${currentPage}&page_size=15`;
    if (rolesId.length && selectedRoles !== 'All') {
      getUserListUrl += `&role=${rolesId.toString()}`;
    }
    if (gradesId.length && !selectedGrades.includes('All')) {
      getUserListUrl += `&grade=${gradesId.toString()}`;
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
        const tempGroupData = usersData.slice();
        tempGroupData[index].active = usersData[index].active
          ? !usersData[index].active
          : true;
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
    getBranchApi();
  }, []);
  useEffect(() => {
    getUsersData();
  }, [currentPage]);
  useEffect(() => {
    if (selectedBranch) {
      setGrade(['All']);
      setSelectedGrades([]);
      getGradeApi();
    }
  }, [selectedBranch]);
  useEffect(() => {
    if (isNewSeach) {
      setIsNewSearch(false);
      setCurrentPage(1);
      getUsersData();
    }
  }, [isNewSeach]);

  return (
    <Layout>
      <Container className='view_users__page'>
        <CommonBreadcrumbs
          componentName='User Management'
          childComponentName='View users'
        />
        <Grid container spacing={2} style={{ padding: '1rem' }}>
          <Grid item xs={12}>
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<SettingsBackupRestoreOutlined />}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant='outlined' className={classes.formControl} fullWidth>
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
          <Grid item xs={12} md={3}>
            <FormControl variant='outlined' className={classes.formControl} fullWidth>
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
          <Grid item xs={12} md={3}>
            <FormControl variant='outlined' className={classes.formControl} fullWidth>
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
          </Grid>
          {selectedBranch && (
            <Grid item xs={12} md={3}>
              <CustomMultiSelect
                selections={selectedGrades}
                setSelections={setSelectedGrades}
                nameOfDropdown='Grade'
                optionNames={grade}
              />
            </Grid>
          )}
        </Grid>

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
        {deleteAlert ? (
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
        ) : null}
        <Paper className={classes.root}>
          <TableContainer
            className={`table table-shadow view_users_table ${classes.container}`}
          >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='view_groups_header'>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>ERP Id</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='view_groups_body'>
                {usersData.map((items, i) => (
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={`user_table_index${i}`}
                  >
                    <TableCell>{items.userName}</TableCell>
                    <TableCell>{items.erpId}</TableCell>
                    <TableCell>{items.emails}</TableCell>
                    <TableCell>
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
                    >
                      <TableCell>{items.userName}</TableCell>
                      <TableCell>{items.erpId}</TableCell>
                      <TableCell>{items.emails}</TableCell>
                      <TableCell>
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
                      >
                        {items.active ? (
                          <IconButton
                            aria-label='deactivate'
                            onClick={() => handleStatusChange(items.userId, i, '2')}
                            title='Deactivate'
                          >
                            <BlockIcon color='secondary' />
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
                            className='group_view_activate_button group_view_button'
                            title='Activate'
                            onClick={() => handleStatusChange(items.userId, i, '1')}
                            style={{ borderRadius: '50%' }}
                          >
                            A
                          </button>
                        )}

                        <IconButton
                          title='Delete'
                          className='group_view_button group_view_delete_button'
                          onClick={() => handleDelete(items.userId, i)}
                        >
                          <DeleteIcon color='secondary' />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          className='group_view_button group_view_delete_button'
                          title='Edit'
                          onClick={() => handleEdit(items.userId)}
                        >
                          <EditIcon color='secondary' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className={`${classes.root} pagenation_view_groups`}>
              <Pagination
                page={Number(currentPage)}
                size='large'
                className='books__pagination'
                onChange={handlePagination}
                count={totalPages}
              />
            </div>
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
              <Pagination
                page={Number(currentPage)}
                count={totalPages}
                onChange={handlePagination}
                color='primary'
              />
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
});

export default ViewUsers;
