/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import moment from 'moment';
import useStyles from './useStyles';
import { useSelector } from 'react-redux';
import './styles.scss';
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';

const columns = [
  //   { id: 'id', label: 'Id', minWidth: 170 },
  { id: 'sl-no', label: 'SL_NO.', minWidth: 100 },
  { id: 'id', label: 'ROLE ID', minWidth: 100 },
  { id: 'role_name', label: 'Role', minWidth: 100 },
  { id: 'created_at', label: 'Created at', minWidth: 100 },
  { id: 'created_by', label: 'Created by', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];

const RolesTable = ({ roles, onEdit, onDelete, count, limit, page, onChangePage }) => {
  const classes = useStyles();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  // const isOrchids =
  //   window.location.host.split('.')[0] === 'orchids' ||
  //   window.location.host.split('.')[0] === 'localhost:3000'
  //     ? true
  //     : false;
  const isOrchids = IsOrchidsChecker();
  return (
    <Paper className={`${classes.root} roles-table`}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead className='table-header-row'>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={classes.columnHeader}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles &&
              roles.length > 0 &&
              roles.map((role, index) => {
                const transformedRole = {
                  'sl-no': (page - 1) * limit + index + 1,
                  ...role,
                };
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={role.id}>
                    {columns.map((column) => {
                      const value = transformedRole[column.id];
                      if (column.id === 'actions') {
                        return (
                          <TableCell
                            className={classes.tableCell}
                            key={column.id}
                            align={column.align}
                          >
                            <IconButton
                              onClick={() => {
                                onEdit(role);
                              }}
                              title='Edit role'
                            >
                              <EditOutlinedIcon color='primary' />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                onDelete(role);
                              }}
                              title='Delete role'
                            >
                              <DeleteOutlinedIcon color='primary' />
                            </IconButton>
                          </TableCell>
                        );
                      }
                      if (column.id === 'created_at') {
                        return (
                          <TableCell
                            className={classes.tableCell}
                            key={column.id}
                            align={column.align}
                          >
                            {value ? moment(value).format('DD-MM-YYYY') : ''}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          className={classes.tableCell}
                          key={column.id}
                          align={column.align}
                        >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value || '--'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={count || 0}
        rowsPerPage={limit || 0}
        page={page - 1 || 0}
        onChangePage={(e, pageNo) => {
          onChangePage(pageNo + 1);
        }}
        rowsPerPageOptions={false}
        className='table-pagination'
        classes={{
          spacer: classes.tablePaginationSpacer,
          toolbar: classes.tablePaginationToolbar,
          caption: classes.tablePaginationCaption,
        }}
      />
    </Paper>
  );
};

export default RolesTable;
