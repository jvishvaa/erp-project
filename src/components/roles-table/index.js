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
import useStyles from './useStyles';

const columns = [
  //   { id: 'id', label: 'Id', minWidth: 170 },
  { id: 'role_name', label: 'Role', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];

const RolesTable = ({ roles, onEdit, onDelete }) => {
  const classes = useStyles();
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
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
            {roles.map((role) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={role.id}>
                  {columns.map((column) => {
                    const value = role[column.id];
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
                          >
                            <EditOutlinedIcon color='primary' />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              onDelete(role);
                            }}
                          >
                            <DeleteOutlinedIcon color='primary' />
                          </IconButton>
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
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
};

export default RolesTable;
