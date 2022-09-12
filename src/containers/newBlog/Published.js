import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarsIcon from '@material-ui/icons/Stars';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import RatingScale from './RatingScale';

import './styles.scss';
import { TablePagination } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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

  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
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
}));

function createData(slno, name, grade, submissiondate, overallscore, actions) {
  return { slno, name, grade, submissiondate, overallscore, actions };
}

const rows = [
  createData('1', 'Student Name', 'Grade:1A', '18 / 02 / 2022', '2', '1'),
  createData('2', 'Student Name', 'Grade:1A', '18 / 02 / 2022', '2', '1'),
  createData('3', 'Student Name', 'Grade:1A', '18 / 02 / 2022', '2', '1'),
  createData('4', 'Student Name', 'Grade:1A', '18 / 02 / 2022', '2', '1'),
  createData('5', 'Student Name', 'Grade:1A', '18 / 02 / 2022', '2', '1'),
];

const Published = () => {
  const [value, setValue] = React.useState();
  const classes = useStyles();

  return (
    // <TableContainer style={{ width: '100%' }} component={Paper}>
    //   <Table className={classes.table} aria-label='simple table'>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Sl.No </TableCell>
    //         <TableCell>Student Name</TableCell>
    //         <TableCell></TableCell>
    //         <TableCell>Submission Date</TableCell>
    //         <TableCell>Overall Score</TableCell>
    //         <TableCell>Actions</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {rows.map((row) => (
    //         <TableRow key={row.slno}>
    //           <TableCell component='th' scope='row'>
    //             {row.slno}
    //           </TableCell>
    //           <TableCell align='right'>{row.name}</TableCell>
    //           <TableCell align='right'>{row.grade}</TableCell>
    //           <TableCell align='right'>{row.submissiondate}</TableCell>
    //           <TableCell align='right'>
    //             {row.overallscore == 2 ? (
    //               <div>
    //               <Rating
    //                   name='simple-controlled'
    //                   value={value}
    //                   onChange={(event, newValue) => {
    //                     setValue(newValue);
    //                   }}
    //                 />
    //               </div>
    //             ) : null}
    //           </TableCell>
    //           <TableCell align='right'>
    //             {row.actions == 1 ? (
    //               <div>
    //                 <Button className={classes.buttonUnPub}>Un-Publish</Button>
    //                 <Button className={classes.blogWall}>View in Blog Wall</Button>
    //               </div>
    //             ) : null}
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>

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
              <TableCell className={classes.tableCell}></TableCell>
              <TableCell className={classes.tableCell}>Submission Date</TableCell>
              <TableCell className={classes.tableCell}>Overall Score</TableCell>
              <TableCell className={classes.tableCell}></TableCell>

              <TableCell  style={{width:"267px"}} className={classes.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          {/* {assingeds.map((response, index)=> (     */}
          <TableBody>
            <TableRow
              hover
              role='checkbox'
              tabIndex={-1}
              // key={`user_table_index${i}`}
            >
              <TableCell className={classes.tableCells}>1</TableCell>
              <TableCell className={classes.tableCells}>hafHS</TableCell>
              <TableCell className={classes.tableCells}>GRADE 1</TableCell>
              <TableCell className={classes.tableCells}>22/10/2022</TableCell>
              <TableCell className={classes.tableCells}>
                <RatingScale />
              </TableCell>
              <TableCell className={classes.tableCells}>
                {' '}
                <StarsIcon style={{ color: '#F7B519' }} />
              </TableCell>

              <TableCell className={classes.tableCells}>
                <Button variant='outlined' size='small' className={classes.buttonColor1}>
                  Un-Publish
                </Button>
                &nbsp;&nbsp;
                <Button variant='outlined' size='small' className={classes.buttonColor2}>
                  View in Blog Wall
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          {/* ) )}  */}
        </Table>
        <TablePagination
          component='div'
          // count={totalCount}
          // rowsPerPage={limit}
          // page={Number(currentPage) - 1}
          // onChangePage={(e, page) => {
          // handlePagination(e, page + 1);
          // }}
          rowsPerPageOptions={false}
          className='table-pagination'
          classes={{
            spacer: classes.tablePaginationSpacer,
            toolbar: classes.tablePaginationToolbar,
          }}
        />
      </TableContainer>
    </Paper>
  );
};

export default Published;
