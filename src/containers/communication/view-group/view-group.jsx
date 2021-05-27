/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
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
import CreateGroup from '../create-group/create-group';
import Loading from '../../../components/loader/loader';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './view-group.css';

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
    color: theme.palette.secondary.main,
  },
}));

// eslint-disable-next-line no-unused-vars
const ViewGroup = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [groupsData, setGroupsData] = useState([]);
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
  const getGroupsData = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.getGroups}?page=${currentPage}&page_size=15`
      );
      const resultGroups = [];
      if (result.status === 200) {
        setLoading(false);
        result.data.data.results.forEach((items) => {
          resultGroups.push({
            groupId: items.id,
            groupName: items.group_name,
            roleType: items.role,
            branch: items.branch,
            grades: items.grade,
            sections: items.section_mapping,
            active: items.is_active,
          });
        });
        setGroupsData(resultGroups);
        setTotalPages(result.data.data.count);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };
  const handlePagination = (event, page) => {
    setCurrentPage(page + 1);
  };
  const handleStatusChange = async (id, index) => {
    try {
      setLoading(true);
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.editGroup}${id}/change-group-status/`
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
        `${endpoints.communication.editGroup}${deleteId}/delete-group/`,
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
  const handleEdit = (id, index) => {
    setEditGroupId(id);
    setEditGroupName(groupsData[index].groupName);
    setEditGroupBranch(groupsData[index].branch);
    setEditGroupRole(groupsData[index].roleType);
    setEditGroupGrades(groupsData[index].grades);
    setEditGroupSections(groupsData[index].sections);
    setEditing(true);
  };
  const toggleHide = () => {
    setIsHidden(!isHidden);
  };
  useEffect(() => {
    getGroupsData();
  }, [currentPage]);
  useEffect(() => {
    if (!editing && editGroupId) {
      setEditGroupId(0);
      setEditGroupName('');
      setEditGroupRole('');
      setEditGroupBranch([]);
      setEditGroupGrades([]);
      setEditGroupSections([]);
      getGroupsData();
    }
  }, [editing]);

  function handleUpdate(data) {
    console.log('The data handle', data);
    history.push({
      pathname: '/communication/updategroup',
      state: { ...data },
    });
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      {editing ? (
        <CreateGroup
          preSelectedGroupId={editGroupId}
          edit
          editClose={setEditing}
          preSelectedGroupName={editGroupName}
          preSeletedRoles={editGroupRole}
          preSeletedBranch={editGroupBranch}
          preSeletedGrades={editGroupGrades}
          preSeletedSections={editGroupSections}
          setGroupName={setEditGroupName}
        />
      ) : (
        <Layout>
          <div className='creategroup__page'>
            <div className='view_group_breadcrumb_container'>
              <CommonBreadcrumbs
                componentName='Communication'
                childComponentName='View Group'
              />
            </div>
            {deleteAlert ? (
              <Dialog
                open={deleteAlert}
                onClose={handleDeleteCancel}
                className='view_group_delete_modal'
              >
                <DialogTitle
                  className='view_group_delete_modal_title'
                  style={{ cursor: 'move' }}
                  id='draggable-dialog-title'
                >
                  Delete Group
                </DialogTitle>
                <DialogContent>
                  <DialogContentText className='view_group_delete_alert_tag'>
                    Do you want to Delete the Group
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={handleDeleteCancel}
                    className='view_group_delete_alert_button_cancel'
                    color='secondary'
                  >
                    Cancel
                  </Button>
                  <Button
                    className='view_group_delete_alert_button'
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
                          Role Type
                        </TableCell>
                        <TableCell
                          className={`${classes.tableCell} ${isHidden ? 'hide' : 'show'}`}
                        >
                          Grades
                        </TableCell>
                        <TableCell
                          className={`${classes.tableCell} ${isHidden ? 'hide' : 'show'}`}
                        >
                          Sections
                        </TableCell>
                        <TableCell className={classes.tableCell}>Status</TableCell>
                        <TableCell
                          className={`${classes.tableCell} ${isHidden ? 'hide' : 'show'}`}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className='view_groups_body'>
                      {groupsData?.map((items, i) => (
                        <TableRow
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={`group_table_index${i}`}
                        >
                          <TableCell>{items.groupName}</TableCell>
                          <TableCell className={`${isHidden ? 'hide' : 'show'}`}>
                            {items.roleType.length
                              ? items.roleType.map((roles, index) => {
                                  if (index + 1 === items.roleType.length) {
                                    return roles.role_name;
                                  }
                                  return `${roles.role_name}, `;
                                })
                              : null}
                          </TableCell>
                          <TableCell
                            className={`view_group_table_sections ${
                              isHidden ? 'hide' : 'show'
                            }`}
                          >
                            {items.grades.length
                              ? items.grades.map((grades, index) => {
                                  if (index + 1 === items.grades.length) {
                                    return grades.grade_name;
                                  }
                                  return `${grades.grade_name}, `;
                                })
                              : null}
                          </TableCell>
                          <TableCell
                            className={`view_group_table_sections ${
                              isHidden ? 'hide' : 'show'
                            }`}
                          >
                            {items.sections && items.sections.length
                              ? items.sections.map((sections, index) => {
                                  if (index + 1 === items.sections.length) {
                                    return sections.section__section_name;
                                  }
                                  return `${sections.section__section_name}, `;
                                })
                              : null}
                          </TableCell>
                          <TableCell>
                            {items.active ? (
                              <div style={{ color: 'green' }}>Activated</div>
                            ) : (
                              <div style={{ color: 'red' }}>Deactivated</div>
                            )}
                          </TableCell>
                          <TableCell className={`${isHidden ? 'hide' : 'show'}`}>
                            {items.active ? (
                              <IconButton
                                aria-label='deactivate'
                                onClick={() => handleStatusChange(items.groupId, i)}
                                title='Deactivate'
                              >
                                <BlockIcon style={{ color: '#ff6b6b' }} />
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
                              <DeleteOutlinedIcon style={{ color: '#ff6b6b' }} />
                            </IconButton>
                            <IconButton
                              title='Edit'
                              style={{ padding: '5px' }}
                              onClick={() => handleUpdate(items)}
                              // onClick={() => handleEdit(items.groupId, i)}
                            >
                              <EditOutlinedIcon style={{ color: '#ff6b6b' }} />
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
            </div>
          </div>
        </Layout>
      )}
    </>
  );
});

export default ViewGroup;
