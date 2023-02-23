import React, { useState, useRef, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TablePagination } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loader from 'components/loader/loader';

const useStyles = makeStyles({
  button: {
    color: '#2A7D4B',
    background: '#FFFFFF',
    border: '1px solid #D2E4D9',
    borderRadius: '6px',
  },

  root: {
    // maxWidth: '90vw',
    width: '99%',
    // margin: '20px auto',
    // marginTop: theme.spacing(4),
    paddingLeft: '20px',
    boxShadow: 'none',
  },
  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },

  container: {
    maxHeight: '70vh',
    maxWidth: '95vw',
  },
  columnHeader: {
    // color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  buttonUnPub: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    borderRadius: '6px',
    border: '1px solid #FF6161',
    opacity: 1,
    marginRight: '15px',
    color: '#FF6161',
  },
  blogWall: {
    background: '#FFFFFF',
    borderRadius: '6px',
    border: '1px solid #D2E4D9',
    color: '#554FB8',
    opacity: 1,
  },
  buttonColor1: {
    color: '#FF6161 !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: '#554FB8 !important',
    backgroundColor: 'white',
  },
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function createData(slno, name, grade, actions) {
  return { slno, name, grade, actions };
}

const rows = [
  createData('1', 'Student Name', 'Grade:1A', '1'),
  createData('2', 'Student Name', 'Grade:1A', '1'),
  createData('3', 'Student Name', 'Grade:1A', '1'),
  createData('4', 'Student Name', 'Grade:1A', '1'),
  createData('5', 'Student Name', 'Grade:1A', '1'),
];

const NotSubmitted = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [checked, setChecked] = React.useState();
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);
      axios
        .get(
          `${
            endpoints.newBlog.studentSideApi
          }?section_ids=null&user_id=null&activity_detail_id=null&branch_ids=${
            props?.selectedBranch?.id == '' ? null : props?.selectedBranch?.id
          }&grade_id=${
            props?.selectedGrade
          }&is_submitted=False&page=${currentPage}&page_size=${limit}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          props.setFlag(false);
          setTotalCount(response?.data?.count);
          setTotalPages(response?.data?.page_size);
          setCurrentPage(response?.data?.page);
          setLimit(Number(limit));
          setAlert('success', response?.data?.message);
          setTotalSubmitted(response?.data?.result);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);

  const handlePagination = (event, page) => {
    setIsClicked(true);
    setCurrentPage(page);
  };

  return (
    <div>
      {loading && <Loader />}
      <Paper className={`${classes.root} common-table`} id='singleStudent'>
        <TableContainer
          className={`table table-shadow view_users_table ${classes.container}`}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className={`${classes.columnHeader} table-header-row`}>
              <TableRow>
                <TableCell className={classes.tableCell} style={{ whiteSpace: 'nowrap' }}>
                  S No.
                </TableCell>
                <TableCell className={classes.tableCell}>Student Name</TableCell>

                <TableCell className={classes.tableCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted.map((response, index) => (
              <TableBody>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  // key={`user_table_index${i}`}
                >
                  <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.booked_user?.name}
                  </TableCell>
                  {/* <TableCell className={classes.tableCells}>GRADE 1</TableCell> */}

                  <TableCell className={classes.tableCells}>
                    <Button
                      variant='outlined'
                      size='small'
                      className={classes.buttonColor1}
                    >
                      Send Notification{' '}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
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
        </TableContainer>
      </Paper>
    </div>
  );
};

export default NotSubmitted;
