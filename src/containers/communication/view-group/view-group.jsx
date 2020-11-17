/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-debugger */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableRow from '@material-ui/core/TableRow';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Layout from '../../Layout';
import EditGroup from '../edit-group/edit-group';
import Loading from '../../../components/loader/loader';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './view-group.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '90%',
    marginLeft: '50px',
    marginTop: '50px',
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
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
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [groupsData, setGroupsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [editGroupId, setEditGroupId] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
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
        `${endpoints.communication.getGroups}?page=${currentPage}&page_size=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultGroups = [];
      if (result.status === 200) {
        setLoading(false);
        result.data.data.results.map((items) =>
          resultGroups.push({
            groupId: items.id,
            groupName: items.group_name,
            roleType: items.role.role_name,
            grades: items.grade,
            sections: items.mapping_bgs,
            active: items.is_active,
          })
        );
        setGroupsData(resultGroups);
        setTotalPages(result.data.data.total_pages);
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
    setCurrentPage(page);
  };
  const handleStatusChange = async (id, index) => {
    try {
      setLoading(true);
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.editGroup}${id}/change-group-status/`,
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
        tempGroupData[index].active = groupsData[index].active
          ? !groupsData[index].active
          : true;
        setGroupsData(tempGroupData);
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
        setGroupsData(tempGroupData);
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
    setEditGroupRole(groupsData[index].roleType);
    setEditGroupGrades(groupsData[index].grades);
    setEditGroupSections(groupsData[index].sections);
    setEditing(true);
  };
  useEffect(() => {
    getGroupsData();
  }, [currentPage]);
  useEffect(() => {
    if (!editing && editGroupId) {
      setEditGroupId(0);
      setEditGroupName('');
      setEditGroupRole('');
      setEditGroupGrades([]);
      setEditGroupSections([]);
      getGroupsData();
    }
  }, [editing]);
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='creategroup__page'>
          <CommonBreadcrumbs
            componentName='Communication'
            childComponentName='View Group'
          />
          {editing ? (
            <EditGroup
              editId={editGroupId}
              editClose={setEditing}
              groupName={editGroupName}
              groupRole={editGroupRole}
              groupGrades={editGroupGrades}
              groupSections={editGroupSections}
              setGroupName={setEditGroupName}
            />
          ) : null}
          {deleteAlert ? (
            <div className='view_group_delete_alert_wrapper'>
              <span className='view_group_delete_alert_tag'>
                Do you want to Delete the Group
              </span>
              <div className='view_group_delete_alert_button_wrapper'>
                <input
                  className='view_group_delete_alert_button'
                  type='button'
                  onClick={handleDeleteConfirm}
                  value='Delete'
                />
                <input
                  className='view_group_delete_alert_button'
                  type='button'
                  onClick={handleDeleteCancel}
                  value='cancel'
                />
              </div>
            </div>
          ) : null}
          <Paper className={` view_group_table_wrapper ${classes.root}`}>
            <TableContainer
              className={`table table-shadow view_group_table ${classes.container}`}
            >
              <Table stickyHeader aria-label='sticky table'>
                <TableHead className={`${classes.columnHeader} view_groups_header`}>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Group Name</TableCell>
                    <TableCell className={classes.tableCell}>Role Type</TableCell>
                    <TableCell className={classes.tableCell}>Grades</TableCell>
                    <TableCell className={classes.tableCell}>Sections</TableCell>
                    <TableCell className={classes.tableCell}>Status</TableCell>
                    <TableCell className={classes.tableCell}>Action</TableCell>
                    <TableCell className={classes.tableCell}>Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className='view_groups_body'>
                  {groupsData.map((items, i) => (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={`group_table_index${i}`}
                    >
                      <TableCell>{items.groupName}</TableCell>
                      <TableCell>{items.roleType}</TableCell>
                      <TableCell>
                        {items.grades.length
                          ? items.grades.map((grades) => grades.grade_name)
                          : null}
                      </TableCell>
                      <TableCell>
                        {items.sections.length
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
                      <TableCell>
                        {items.active ? (
                          <button
                            type='submit'
                            className='group_view_deactivate_button group_view_button'
                            title='Deactivate'
                            onClick={() => handleStatusChange(items.groupId, i)}
                          >
                            D
                          </button>
                        ) : (
                          <button
                            type='submit'
                            className='group_view_activate_button group_view_button'
                            title='Activate'
                            onClick={() => handleStatusChange(items.groupId, i)}
                          >
                            A
                          </button>
                        )}

                        <span
                          className='group_view_button group_view_delete_button'
                          title='Delete'
                          onClick={() => handleDelete(items.groupId, i)}
                        >
                          <DeleteIcon />
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className='group_view_button group_view_delete_button'
                          title='Edit'
                          onClick={() => handleEdit(items.groupId, i)}
                        >
                          <EditIcon />
                        </span>
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
        </div>
      </Layout>
    </>
  );
});

export default ViewGroup;
