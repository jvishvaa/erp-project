/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect ,useCallback} from 'react';
import { withRouter } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import BlockIcon from '@material-ui/icons/Block';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Layout from '../../Layout';
import CreateGroup from '../create-group/createGroup';
import Loading from '../../../components/loader/loader';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './view-group.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';
import NoFilterData from 'components/noFilteredData/noFilterData';
import UpdateGroup from '../update-group';
import _ from 'lodash';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '95%',
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
      marginLeft: '5px',
      marginTop: '5px',
    },
  },
  container: {
    maxHeight: 440,
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
    color: `${theme.palette.secondary.main} !important`,
  },
  tablebody: {
    color: `${theme.palette.secondary.main} !important`,
  },
}));


const debounce = (fn, delay) => {
  let timeoutId;
  return function(...args) {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

// eslint-disable-next-line no-unused-vars
const ViewGroup = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [groupsData, setGroupsData] = useState([]);
  const [seachedData, setSeachedData] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [editGroupId, setEditGroupId] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupBranch, setEditGroupBranch] = useState([]);
  const [editGroupGrades, setEditGroupGrades] = useState([]);
  const [editGroupSections, setEditGroupSections] = useState([]);
  const [editGroupRole, setEditGroupRole] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [selectedbranch, setSelectedbranch] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [selectedSection, setSelectedSection] = useState([]);
  const [editData , SetEditData] = useState()
  const [searchData,setSearchData] = useState('')
  const [isNewSeach, setIsNewSearch] = useState(true);
  const [isFilter,setisFilter] = useState(false)


  // const delayedCallback = _.debounce(() => {
  //   getGroupsData();
  // }, 2000);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    if(moduleId) getBranch()
  }, [moduleId]);
  
  const getGroupsData = async () => {
    if(!selectedbranch) return setAlert('error','Please Select Branch')
    else if(!selectedGrade) return setAlert('error','Please Select Grade')
    else {
      try {
      setLoading(true);
      let url = `${endpoints.communication.userGroups}?page=${currentPage}&page_size=15&group_type=1&acad_session=${selectedbranch?.id}&grade=${selectedGrade?.grade_id}`
      if(searchData){
        url += `&search=${searchData}`
      }
      const result = await axiosInstance.get(url);
      const resultGroups = [];
      if (result.status === 200) {
        setLoading(false);
        result.data.results.forEach((items) => {
          resultGroups.push({
            groupId: items.id,
            groupname: items.group_name,
            // roleType: items.role,
            branch: items?.group_section_mapping.length ? items?.group_section_mapping[0].group_branch : '',
            branchId : items?.group_section_mapping.length ? items?.group_section_mapping[0].group_branch_id : '',
            grades: items?.group_section_mapping.length ? items?.group_section_mapping[0].group_grade : '',
            gradeId: items?.group_section_mapping.length ? items?.group_section_mapping[0].group_grade_id : '',
            sections: items?.group_section_mapping?.map((item) => item.group_section),
            sectionIds : items?.group_section_mapping?.map((item) => item.group_section_id) , 
            sectionData : items?.group_section_mapping.map((item) => ({
              section_id : item?.group_section_id,
              section__section_name : item.group_section,
              id : item?.section_mapping_id
            })),
            usersData : items?.group_users,
            sessionYearId : items?.group_section_mapping.length ? items?.group_section_mapping[0].group_session_year_id : '',
            active : items?.is_active
          });
        });
        setGroupsData(resultGroups);
        setTotalPages(result.data.count);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  }
  };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'User Groups') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const getBranch = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          // const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(res?.data?.data?.results);
        } else {
          setBranchList([]);
        }
      });
  };

  const getGrade = (value) => {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${value?.branch?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
        } else {
          setBranchList([]);
        }
      });
  };

  const getSection = (value) => {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedbranch?.branch?.id}&grade_id=${value?.grade_id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionList(res?.data?.data);
        } else {
          setSectionList([]);
        }
      });
  };

  const handleSearch = (e , value) => {
    if(!selectedbranch) return setAlert('error', 'Please Select Branch !')
    else if(!selectedGrade) return setAlert('error', 'Please Select Grade !')
    else {
      // delayedCallback();
      let search = e.target.value;
      // setSearchText(e.target.value);
      setSearchData(e.target.value)
      if(search.length >= 0) {
        debounceCallback(search);
      }
      else {
        setIsNewSearch(false);
      }
    }

  }

const handlefilter = () => {
  setisFilter(true)
  getGroupsData()
}
  const handleBranch = (e,value={}) =>{	
    setSelectedbranch()
    setSelectedGrade()
    // const Ids = value.map((i)=>i.id)
    if(value){	
      setSelectedbranch(value)	
      getGrade(value)
      // setSelectBranchId(Ids)	
    }else{	
    // setSelectBranchId([])	
    setSelectedbranch()	
    setSelectedGrade()
    setSelectedSection([])
    }	
  }


const handleGrade = (e, value)=> {
  if(value){
    setSelectedGrade(value)
    getSection(value)
  }else{
    setSelectedGrade()
    setSelectedSection([])
  }
}


const handleSection = (e, value) => {
    if (value?.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.section_id);
      const sectionMappingIds = value.map((el) => el.id);
    setSelectedSection(data)
  }else {
    setSelectedSection([])
  }
}

  const handlePagination = (event, page) => {
    setCurrentPage(page + 1);
  };
  const handleStatusChange = async (id, index) => {
    try {
      setLoading(true);
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.editGroup}${id}/update-retrieve-delete-groups/`,{
          is_active :groupsData[index].active ? !groupsData[index].active : true
        }
      );
      if (statusChange.status === 200) {
        setLoading(false);
        setAlert('success', statusChange.data.message);
        const tempGroupData = groupsData.slice();
        tempGroupData[index].active = groupsData[index].active
          ? !groupsData[index].active
          : true;
        setGroupsData(tempGroupData || []);
      } else {
        setAlert('error', statusChange.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const handleDelete = async (id, index) => {
    setDeleteId(id);
    setDeleteIndex(index);
    setDeleteAlert(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const statusChange = await axiosInstance.delete(
        `${endpoints.communication.editGroup}${deleteId}/update-retrieve-delete-groups/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (statusChange.status === 200) {
        setLoading(false);
        setAlert('success', statusChange.data.message);
        const tempGroupData = groupsData.slice();
        tempGroupData.splice(deleteIndex, 1);
        setGroupsData(tempGroupData || []);
        setDeleteId(null);
        setDeleteIndex(null);
        setDeleteAlert(false);
      } else {
        setAlert('error', statusChange.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteIndex(null);
    setDeleteAlert(false);
  };
  // const handleEdit = (id, index) => {
  //   setEditGroupId(id);
  //   setEditGroupName(groupsData[index].groupName);
  //   setEditGroupBranch(groupsData[index].branch);
  //   setEditGroupRole(groupsData[index].roleType);
  //   setEditGroupGrades(groupsData[index].grades);
  //   setEditGroupSections(groupsData[index].sections);
  //   setEditing(true);
  // };
  const toggleHide = () => {
    setIsHidden(!isHidden);
  };
  // useEffect(() => {
  //   if(!editing)
  //   getGroupsData();
  // }, [editing]);

  const handleEditing = (isEdit) => {
    setEditing(isEdit)
    if(isEdit === false){
      getGroupsData()
    }
    
  }
  // useEffect(() => {
  //   if (!editing && editGroupId) {
  //     setEditGroupId(0);
  //     setEditGroupName('');
  //     setEditGroupRole('');
  //     setEditGroupBranch([]);
  //     setEditGroupGrades([]);
  //     setEditGroupSections([]);
  //     getGroupsData();
  //   }
  // }, [editing]);

  function handleCreate() {
      history.push({
        pathname: '/addgroup',
        // state: { ...data,
        // isEdit : true
        // },
      });
  }

  useEffect(() => {
    if (isNewSeach && moduleId && isFilter ) {
      setIsNewSearch(false);
      getGroupsData();
    }
  }, [isNewSeach, moduleId,isFilter]);

  const handleEdit= (item) => {
    SetEditData(item)
    // setEditing(true)
    handleEditing(true)
  }


  const debounceCallback = useCallback(
    debounce(value => {
      setIsNewSearch(true);
    }, 500),
    []
  );



  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      {editing ? (
        <UpdateGroup
        editData = {editData}
        handleEditing = {handleEditing}

          // preSelectedGroupId={editGroupId}
          // edit
          // editClose={setEditing}
          // preSelectedGroupName={editGroupName}
          // preSeletedRoles={editGroupRole}
          // preSeletedBranch={editGroupBranch}
          // preSeletedGrades={editGroupGrades}
          // preSeletedSections={editGroupSections}
          // setGroupName={setEditGroupName}
        />
      ) : (
        <Layout>
          <div className='creategroup__page'>
            <div className='view_group_breadcrumb_container'>
              <CommonBreadcrumbs
                componentName='User Management'
                childComponentName='View Group'
              />
              <Grid container item spacing={3}>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleBranch}
                    id='branch_id'
                    className='dropdownIcon'
                    value={selectedbranch || []}
                    options={branchList || []}
                    getOptionLabel={(option) => option?.branch?.branch_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Branch'
                        placeholder='Branch'
                        required
                      />
                    )}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleGrade}
                    id='branch_id'
                    className='dropdownIcon'
                    value={selectedGrade || ''}
                    options={gradeList || []}
                    getOptionLabel={(option) => option?.grade__grade_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Grade'
                        placeholder='Grade'
                        required
                      />
                    )}
                  />
                </Grid>

                {/* <Grid item md={3} xs={12}>
                  <Autocomplete
                    multiple
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleSection}
                    id='section'
                    // className='dropdownIcon'
                    value={selectedSection || []}
                    options={sectionList || []}
                    getOptionLabel={(option) => option?.section__section_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Section'
                        placeholder='Section'
                      />
                    )}
                  />
                </Grid> */}
                <Grid item md={3} xs={12}>
                  <Button
                    color='primary'
                    variant='contained'
                    width='100%'
                    style={{ color: 'white' }}
                    onClick={() => handlefilter()}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} style={{display:'flex',justifyContent:'flex-end'}}>
                  <Button
                    color='primary'
                    variant='contained'
                    width='100%'
                    style={{ color: 'white' }}
                    onClick={() => handleCreate()}
                  >
                    Create Group
                  </Button>
                </Grid>
                <Grid item md={4}>
                  <Paper elevation={3} className='search'>
                    <div>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder=' Search'
                      onChange={(e) => handleSearch(e)}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>
            {deleteAlert ? (
              <Dialog
                open={deleteAlert}
                onClose={handleDeleteCancel}
                className='view_group_delete_modal'
              >
                <DialogTitle id='draggable-dialog-title'>Delete Group</DialogTitle>
                <DialogContent>
                  <DialogContentText className='view_group_delete_alert_tag'>
                    Do you want to Delete the Group
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={handleDeleteCancel}
                    className='labelColor cancelButton'
                  >
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
            ) : null}
            <div className='view_group_white_space_wrapper'>
              {isHidden ? (
                <span className='message_log_expand_manage' onClick={toggleHide}>
                  View more
                </span>
              ) : (
                <span className='message_log_expand_manage' onClick={toggleHide}>
                  View less
                </span>
              )}
              {groupsData.length === 0 ? (
                <NoFilterData data='No Data Found' />
              ) : (
                <Paper className={` view_group_table_wrapper ${classes.root}`}>
                  <TableContainer
                    className={`table table-shadow view_group_table ${classes.container}`}
                  >
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead className={`${classes.columnHeader} view_groups_header`}>
                        <TableRow>
                          <TableCell className={classes.tableCell}>Group Name</TableCell>
                          <TableCell
                          className={`${classes.tableCell} ${isHidden ? 'hide' : 'show'}`}
                        >
                          Branch
                        </TableCell>
                          <TableCell
                            className={`${classes.tableCell} ${
                              isHidden ? 'hide' : 'show'
                            }`}
                          >
                            Grades
                          </TableCell>
                          {/* <TableCell
                          className={`${classes.tableCell} ${isHidden ? 'hide' : 'show'}`}
                        >
                          Sections
                        </TableCell> */}
                          <TableCell className={classes.tableCell}>Status</TableCell>
                          <TableCell
                            className={`${classes.tableCell} ${
                              isHidden ? 'hide' : 'show'
                            }`}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tablebody}>
                        {groupsData?.map((items, i) => (
                          <TableRow
                            hover
                            role='checkbox'
                            tabIndex={-1}
                            key={`group_table_index${i}`}
                          >
                            <TableCell className={classes.tableCell}>
                              {items?.groupname}
                            </TableCell>
                            {/* <TableCell className={`${isHidden ? 'hide' : 'show'} ${classes.tableCell}`}>
                            {items.roleType.length
                              ? items.roleType.map((roles, index) => {
                                if (index + 1 === items.roleType.length) {
                                  return roles.role_name;
                                }
                                return `${roles.role_name}, `;
                              })
                              : null}
                          </TableCell> */}
                          <TableCell
                              className={`view_group_table_sections ${
                                isHidden ? 'hide' : 'show'
                              } ${classes.tableCell}`}
                            >
                              {items?.branch}                                
                            </TableCell>
                            <TableCell
                              className={`view_group_table_sections ${
                                isHidden ? 'hide' : 'show'
                              } ${classes.tableCell}`}
                            >
                              {items?.grades}                                
                            </TableCell>
                            {/* <TableCell
                            className={`view_group_table_sections ${isHidden ? 'hide' : 'show'} ${classes.tableCell}`}
                          >
                            {items.sections && items.sections.length
                              ? items.sections.map((sections, index) => {
                                if (index + 1 === items.sections.length) {
                                  return sections.section__section_name;
                                }
                                return `${sections.section__section_name}, `;
                              })
                              : null}
                          </TableCell> */}
                            <TableCell>
                              {items?.active ? (
                                <div style={{ color: 'green' }}>Activated</div>
                              ) : (
                                <div style={{ color: 'red' }}>Deactivated</div>
                              )}
                            </TableCell>
                            <TableCell className={`${isHidden ? 'hide' : 'show'}`}>
                              {items?.active ? (
                                <IconButton
                                  aria-label='deactivate'
                                  onClick={() => handleStatusChange(items.groupId, i)}
                                  title='Deactivate'
                                >
                                  <BlockIcon />
                                </IconButton>
                              ) : (
                                <button
                                  type='submit'
                                  title='Activate'
                                  onClick={() => handleStatusChange(items.groupId, i)}
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
                                onClick={() => handleDelete(items.groupId, i)}
                              >
                                <DeleteOutlinedIcon color='primary' />
                              </IconButton>
                              <IconButton
                                title='Edit'
                                style={{ padding: '5px' }}
                                onClick={() => handleEdit(items)}
                                // onClick={() => handleEdit(items.groupId, i)}
                              >
                                <EditOutlinedIcon color='primary' />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className={`${classes.root} pagenation_view_groups`}>
                    <TablePagination
                      component='div'
                      count={totalPages}
                      rowsPerPage={15}
                      page={Number(currentPage) - 1}
                      onChangePage={handlePagination}
                      rowsPerPageOptions={false}
                      className='table-pagination-view-group'
                    />
                  </div>
                </Paper>
              )}
            </div>
          </div>
        </Layout>
      )}
    </>
  );
});

export default ViewGroup;
