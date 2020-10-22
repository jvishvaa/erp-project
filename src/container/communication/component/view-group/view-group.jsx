/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import TableRow from '@material-ui/core/TableRow';
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
  // const [groups, setGroups] = useState([]);
  const book = [
    { book_status: '2' },
    { book_status: '2' },
    { book_status: '2' },
    { book_status: '2' },
  ];
  return (
    <div className='creategroup__page'>
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
              {book.map((items, i) => {
                return items.book_status !== '3' ? (
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={`group_table_index${i}`}
                  >
                    <TableCell>test1</TableCell>
                    <TableCell>test2</TableCell>
                    <TableCell>test3</TableCell>
                    <TableCell>test4</TableCell>
                    <TableCell>
                      {items.book_status === '0' ? (
                        <div className='text-primary h6'>Pending</div>
                      ) : items.book_status === '1' ? (
                        <div className='text-success h6'>Activated</div>
                      ) : items.book_status === '2' ? (
                        <div className='text-danger h6'>Deactivated</div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {book.book_status === '1' ? (
                        <button
                          className='group_view_activate_button'
                          title='Activated'
                          disabled
                        >
                          A
                        </button>
                      ) : (
                        <button
                          className='group_view_activate_button group_view_button'
                          title='Activate'
                          // onClick={(e) => actionHandler(e, book.id, 1, i)}
                        >
                          A
                        </button>
                      )}
                      {book.book_status === '2' ? (
                        <button
                          className='group_view_deactivate_button group_view_button'
                          title='Deactivated'
                          disabled
                        >
                          D
                        </button>
                      ) : (
                        <button
                          className='group_view_deactivate_button group_view_button'
                          title='Deactivate'
                          // onClick={(e) => actionHandler(e, book.id, 2, i)}
                        >
                          D
                        </button>
                      )}
                      <button
                        className='btn btn-outline-danger'
                        title='Delete'
                        // onClick={(e) => actionHandler(e, book.id, 3, i)}
                      >
                        Dlt
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        className='btn btn-link'
                        title='Edit the book'
                        onClick={() => {}}
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ) : null;
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <div className={`${classes.root} pagenation_view_groups`}>
          <Pagination
            className='p-3 w-100'
            count={10}
            color='primary'
            rowsPerPage={20}
            showFirstButton
            showLastButton
            page={1}
            // onChange={handleChangePage}
          />
        </div>
      </Paper>
    </div>
  );
});

export default ViewGroup;
