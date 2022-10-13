import React, { useEffect, useState, useContext } from 'react';
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
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';

import './styles.scss';
import { TablePagination } from '@material-ui/core';
import axios from 'axios';
import endpoints from 'config/endpoints';

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



const Published = (props) => {
  const [value, setValue] = React.useState();
  const  ActivityId  = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const classes = useStyles();
  let dataes = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [totalPublish,setTotalPublish] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const user_level = dataes?.user_level;



  useEffect(() => {
    if(props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0){
      setTotalPublish([])
    }
  },[props.selectedBranch,props.selectedGrade,props.flag])

  useEffect(() =>{
    if(props.flag){
      getTotalPublish();
    }
  },[props.selectedBranch,props.selectedGrade, props.flag])


  const getTotalPublish = () => {
    if(props){
      setLoading(true)
      const branchIds = props.selectedBranch.map((obj) => obj?.id);
      const gradeIds = props.selectedGrade?.id

      axios
      .get(`${endpoints.newBlog.studentPublishApi}?activity_detail_id=${ActivityId?.id}&branch_ids=${branchIds==""?null:branchIds}&grade_id=${gradeIds}`, 
      {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        props.setFlag(false);
        setTotalPublish(response?.data?.result);
        setLoading(false);

      })
    }
  }

  const handleUnPublish = (data) => {
    let requestData = {
      "booking_id" : data?.booking_detail_id,
      "is_published": false,
    }
    axios
    .post(`${endpoints.newBlog.publishBlogWallApi}`, requestData , {
      headers : {
        'X-DTS-HOST' : X_DTS_HOST,
      }
    })
    .then((res) => {
      console.log(res,'res3')
      if(res?.data?.status_code == 200) {
        setLoading(false)
        setAlert('success', res?.data?.message)
        getTotalPublish()
      }
    })
    .catch((err) => {
      console.log(err,'res4')
      setLoading(false)
      setAlert('error',"Server Error")
    })

  }

  return (
    

    <Paper className={`${classes.root} common-table`} id='singleStudent'>
      {user_level==11?"":
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
              <TableCell className={classes.tableCell}>Grade</TableCell>
              <TableCell className={classes.tableCell}>Submission Date</TableCell>
              <TableCell className={classes.tableCell}>Overall Score</TableCell>
              <TableCell className={classes.tableCell}></TableCell>

              <TableCell  style={{width:"267px"}} className={classes.tableCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          {totalPublish?.map((response,index) => (

          <TableBody>
            <TableRow
              hover
              role='checkbox'
              tabIndex={-1}
              // key={`user_table_index${i}`}
            >
              <TableCell className={classes.tableCells}>{index +1}</TableCell>
              <TableCell className={classes.tableCells}>{response?.name}</TableCell>
              <TableCell className={classes.tableCells}>{response?.grade}</TableCell>
              <TableCell className={classes.tableCells}>{response?.submitted_on}</TableCell>
              <TableCell className={classes.tableCells}>
                <RatingScale />
              </TableCell>
              <TableCell className={classes.tableCells}>
                {' '}
                <StarsIcon style={{ color: '#F7B519' }} />
              </TableCell>

              <TableCell className={classes.tableCells}>
                <Button variant='outlined' size='small' className={classes.buttonColor1} onClick ={ () => handleUnPublish(response)} >
                  Un-Publish
                </Button>
                &nbsp;&nbsp;
                <Button variant='outlined' size='small' className={classes.buttonColor2}>
                  View in School Wall
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          ))}
        </Table>
        {/* <TablePagination
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
        /> */}
      </TableContainer>
}
    </Paper>
  );
};

export default Published;
