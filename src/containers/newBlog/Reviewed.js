import React, { useState, useRef, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Grid, Drawer, TextField, Divider, withStyles } from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';


import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import RatingScale from './RatingScale';
import ReactHtmlParser from 'react-html-parser';
import { TablePagination } from '@material-ui/core';
import endpoints from '../../config/endpoints';

import axios from 'axios';
import './images.css';
const DEFAULT_RATING = 0;
const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: 'yellow',
  },
  root: {
    '& .MuiSvgIcon-root': {
      color: 'currentColor',
    },
  },
  iconHover: {
    color: 'yellow',
  },
}))(Rating);
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
  buttonColor1: {
    color: '#FF6161 !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: '#2A7D4B !important',
    backgroundColor: 'white',
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
  buttonDiv: {},
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

const Reviewed = (props) => {
  const [value, setValue] = React.useState();
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [dataId, setDataId] = useState();
  let datas = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = datas?.token;
  const user_level = datas?.user_level;


  const [values, setValues] = useState();
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [submit, setSubmit] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);

  let array = [];
  const getRatingView = (data) => {
    axios
      .get(
        `${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'responses');
        response.data.map((obj, index) => {
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          temp['remarks'] = obj.remarks;
          temp['given_rating'] = obj.given_rating;
          array.push(temp);
        });
        setRatingReview(array);
      });
  };

  const confirmassign = (response) => {
    let body = {
      booking_detail: {
        is_bookmarked: true,
        is_reassigned: false,
      },
    };

    axios
      .put(
        `${endpoints.newBlog.activityReview}${response?.id}/`,
        body,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        setAlert('success', 'Activity Successfully Shortlisted');
        getTotalSubmitted();

        console.log(response);
      });
  };

  const getTotalSubmitted = () => {
    const branchIds = props.selectedBranch.map((obj) => obj.id);

    axios
      .get(
        `${endpoints.newBlog.studentSideApi}?section_ids=null&&user_id=null&branch_ids=${branchIds==""?null:branchIds}&activity_detail_id=${ActivityId?.id}&is_reviewed=True`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'response');
        setTotalSubmitted(response?.data?.result);
      });
  };

  const assignPage = (data) => {
    console.log(data, 'idd');
    setView(true);
    setData(data);
    setDataId(data?.id);

    getRatingView(data?.id);
  };

  useEffect(() => {
    getTotalSubmitted();
  }, [props.selectedBranch]);
  const [view, setView] = useState(false);
  const [data, setData] = useState();
  const handleCloseViewMore = () => {
    setView(false);
  };

  return (
    <>
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
                {/* <TableCell className={classes.tableCell}></TableCell> */}
                <TableCell className={classes.tableCell}>Submission Date</TableCell>
                <TableCell className={classes.tableCell}>Overall Score</TableCell>
                <TableCell className={classes.tableCell}></TableCell>

                <TableCell className={classes.tableCell} style={{ width: '261px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted?.map((response, index) => (
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
                    {response?.booked_user?.username}
                  </TableCell>
                  {/* <TableCell className={classes.tableCells}>GRADE 1</TableCell> */}
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.submitted_on?.substring(0, 10)}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    <RatingScale
                      name={`rating${index}`}
                      size='small'
                      readOnly
                      rating={response?.user_reviews?.given_rating}
                      // defaultValue={props.defaultValue}
                    />
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.is_bookmarked == true ? (
                      <BookmarksIcon style={{ color: 'gray' }} />
                    ) : (
                      ''
                    )}
                  </TableCell>

                  <TableCell className={classes.tableCells}>
                    <Button
                      variant='outlined'
                      size='small'
                      className={classes.buttonColor1}
                      onClick={() => confirmassign(response)}
                      disabled={user_level==11}


                    >
                      Shortlist
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant='outlined'
                      size='small'
                      className={classes.buttonColor2}
                      onClick={() => assignPage(response)}
                    >
                      Check Review
                    </Button>{' '}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
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

      <Drawer
        anchor='right'
        maxWidth={maxWidth}
        open={view}
        onClose={handleCloseViewMore}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div style={{ width: '100%', marginTop: '72px' }}>
          <div style={{ fontSize: '24px' }}>
            <strong>Preview</strong>
          </div>
          <Divider />

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  border: '1px solid #813032',
                  width: '583px',
                  background: '#47B8CF',
                  height: 'auto',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    width: '554px',
                    marginLeft: '13px',
                    marginTop: '5px',
                  }}
                >
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      width='130'
                      alt='image'
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    marginTop: '16px',
                    height: 'auto',
                  }}
                >
                  <div
                    style={{ paddingLeft: '30px', paddingTop: '7px', fontWeight: 'bold' }}
                  >
                    Title:{' '}
                    <span style={{ fontWeight: 'normal' }}>
                      {data?.activity_detail?.title}
                    </span>
                  </div>
                  <div
                    style={{
                      paddingLeft: '30px',
                      paddingTop: '10px',
                      paddingBottom: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    <span style={{ fontWeight: 'normal' }}>
                      Description: {data?.activity_detail?.description}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    height: 'auto',
                    marginTop: '12px',
                    marginBottom: '29px',
                  }}
                >
                  <div style={{ paddingLeft: '30px', paddingTop: '12px' }}>
                    {/* <img
                      src={data?.activity_detail?.template_path}
                      width='130'
                      alt='image'
                    /> */}
                    <div
        style={{
          background: `url(${"https://activities-k12.s3.amazonaws.com/dev/olvorchidnaigaon/activity_templates/7/newcakeimage.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQWJOGETZRNTK4YK6%2F20220912%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220912T102957Z&X-Amz-Expires=21600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEAn9ksrCbz%2FOFZkFJe%2FX1pNfTFDC%2FvwngVSI2oRE8nQmACIQCq%2FZUSNlTsGerghxWnjnwcgyIvRcpIV8STLbmu8LAd6SrfBAiL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAMaDDA0Nzg3ODM4MjgzNSIM2bTWFILUiUd%2F8dTSKrMEVaoV1OyRDrmQ8kN1CO2thaXofbrRTMevFBYfQMWMZG1Ez4uXm%2Bv4zWt%2BBVx3DsV9YKXCdiMPSQ%2FpOmCpzC3p9wP5JOg1qMm40djbdha1zd9qggRkLfKTw5AzRFxXcKbyPScYaAZHNkPACGjhdOpORjDfp1ADLyFOY11vEiHCYUMiBq4%2F4Dca6R9mSAlyHXJ%2Bdwp3870GZ6YLgllA8szIrbHhj3x2a1d%2BYOVzJqpb4q%2BsgKgBLzNJCuUrXEBcSGtEajjA0X2jaKHK88fzM0eKHdXXKqKj9qTWYHp3Oq1VVqvCSZlcw5wPyXvkiOVVJXCe2s0QWZ91cNxX65j8gzl7%2FluszeU%2BQ9XRmrbx9oA%2BzENAPrKY4vwnD7kQFY%2F7Rl2%2Btgg565Qi0HhTq0bTvjKmjQP9MoD6ruXzBkdbEt6t3NHdpjCfQBryUjqp%2Fzk94x9YJ1MG9VoBxtlTGVT2ZLDWyXIgOZB7UDKNNtRzcGN0iLLLh15SNQxQ96QUkYwBqOIxPtFRjTsZx2p1YrH3GojlqxSbhM8LWnF3UIgX8i532M4r8bxOE1%2F6N6gilcOdUq58YI%2FQ0JFK0xIUqR0IKYf5Aqi9Fh7HdM1wEtvCsC4lMu27TpdS2ro96U2v%2FIWGcqTaVVwKpHRiB3%2FWfZ4mosX6bt61EiYvmW4xtDU7VOdTjcWKtjXyA7xMWrau1L0XyNOP6uLkSkzT1ybvwrjLhyCA5sh4Duerf%2FR4hre6MXlq91xu3xgwmI78mAY6qAHjU8jaQEK0GdIVFnLtXhb%2FQh3%2FC3Bgyn9WoCRpteyo0QsGe9od%2FkzXwahfpvJ%2FZcT1N4EqsvSLYH%2B73lLBmW4HcpVLqhqVtKU6pAX8Uu1idZDsBWCQ7qvdtZG69OnTb%2FAFVm6SB%2BjzE3ZAh5%2ByVQXuz1V%2BWTPQWb1Wf%2B8JMGgQa2CVXq3w%2BEOcVubvoozB0wM0GmisAqLv55dRgGoiDyf%2BHawnAzNQvAc%3D&X-Amz-Signature=19465bd2a27ed8fdc44bef3c024d5b113788fde6cd4ae21a710c7fc7a6faf79e"
        })`,
          backgroundSize: "contain",
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(244 245 247 / 25%)",
    height: "683px",
        }}
      >
        <div className="certificate-text-center certificate-input-box">
          <textarea className="certificate-box" style={{width: "338px",
    height: "366px"}} value={data?.submitted_work?.html_text} placeholder="type text here..." />
         
        </div>
      </div>
                  </div>
                  {/* <div
                    style={{
                      paddingLeft: '30px',
                      paddingTop: '12px',
                      paddingBottom: '6px',
                    }}
                  >
                    {ReactHtmlParser(data?.submitted_work?.html_text)}
                  </div> */}
                </div>
              </div>
            </Grid>
            <Grid item>
              {submit == false ? (
                <div style={{ paddingLeft: '10px' }}>Add Review</div>
              ) : (
                <div style={{ paddingLeft: '8px' }}>Edit Review</div>
              )}
              {submit == false && (
                <div
                  style={{
                    border: '1px solid #707070',
                    width: '295px',
                    height: 'auto',
                    marginLeft: '11px',
                    marginRight: '10px',
                  }}
                >
                  {ratingReview?.map((obj, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          paddingLeft: '15px',
                          paddingRight: '15px',
                          paddingTop: '5px',
                        }}
                      >
                        <div
                          key={index}
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          {' '}
                          {obj?.name}
                          <StyledRating
                            name={`rating${index}`}
                            size='small'
                            value={obj?.given_rating}
                            // defaultValue={props.defaultValue}
                          />
                        </div>
                        {obj?.name == 'Overall' ? (
                          ''
                        ) : (
                          <div>
                            <TextField
                              id='outlined-basic'
                              size='small'
                              variant='outlined'
                              value={obj?.remarks}
                              style={{ width: '264px' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginRight: '10px',
                      marginLeft: '6px',
                      marginBottom: '15px',
                      marginTop: '32px',
                    }}
                  >
                    {' '}
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </Drawer>
    </>
  );
};

export default Reviewed;
