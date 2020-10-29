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
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import EditGroup from '../edit-group/edit-group';
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
  },
  container: {
    maxHeight: 440,
  },
}));

// eslint-disable-next-line no-unused-vars
const ViewGroup = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [groupsData, setGroupsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [editGroupId, setEditGroupId] = useState(0);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupGrades, setEditGroupGrades] = useState([]);
  const [editGroupSections, setEditGroupSections] = useState([]);
  const [editGroupRole, setEditGroupRole] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const getGroupsData = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.getGroups}?page=${currentPage}`
      );
      const resultGroups = [];
      if (result.status === 200) {
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
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };
  const handleStatusChange = async (id, index) => {
    try {
      const statusChange = await axiosInstance.put(
        `${endpoints.communication.editGroup}${id}/change-group-status/`
      );
      if (statusChange.status === 200) {
        setAlert('success', statusChange.data.message);
        const tempGroupData = groupsData.slice();
        tempGroupData[index].active = groupsData[index].active
          ? !groupsData[index].active
          : true;
        setGroupsData(tempGroupData);
      } else {
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handleDelete = async (id, index) => {
    try {
      const statusChange = await axiosInstance.delete(
        `${endpoints.communication.editGroup}${id}/delete-group/`
      );
      if (statusChange.status === 200) {
        setAlert('success', statusChange.data.message);
        const tempGroupData = groupsData.slice();
        tempGroupData.splice(index, 1);
        setGroupsData(tempGroupData);
      } else {
        setAlert('error', statusChange.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
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
    <div className='creategroup__page'>
      <div className='viewgroup_heading'>Communication &gt; View Group</div>
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
      <Paper className={classes.root}>
        <TableContainer className={`table table-shadow ${classes.container}`}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className='view_groups_header'>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Role Type</TableCell>
                <TableCell>Grades</TableCell>
                <TableCell>Sections</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Edit</TableCell>
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
                      ? items.sections.map((sections) => sections.section__section_name)
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
  );
});

export default ViewGroup;
