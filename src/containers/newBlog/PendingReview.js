import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import endpoints from '../../config/endpoints';

import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RatingScale from './HoverRating';
import ReactHtmlParser from 'react-html-parser';
import Rating from '@material-ui/lab/Rating';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import {
  TablePagination,
  Grid,
  Drawer,
  Divider,
  TextField,
  Dialog,
} from '@material-ui/core';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

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
  button: {
    background: '#FFFFFF',
    color: '#2A7D4B',
    border: '1px solid #D2E4D9',
    borderRadius: '6px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  root: {
    maxWidth: '95vw',
    width: '100%',
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
    maxWidth: '94vw',
  },
  buttonColor2: {
    color: '#2A7D4B !important',
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
}));

const PendingReview = (props) => {
  const history = useHistory();
  const [value, setValue] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  console.log(ActivityId, 'ActivityId');
  const [inputList, setInputList] = useState([{ remarks: '', id: '', given_rating: '' }]);

  console.log(inputList, 'input');
  const [totalSubmitted, setTotalSubmitted] = useState([]);

  const handleCloseViewMore = () => {
    setView(false);
  };

  const [values, setValues] = useState();

  console.log(values, 'values');
  const [publish, setPublish] = useState(false);
  const createPublish = () => {
    setPublish(true);
  };
  // useEffect(() => {
  //   setValues({
  //     rating: DEFAULT_RATING,
  //   });
  // }, []);
  const [submit, setSubmit] = useState(false);
  const submitReview = () => {
    setView(false);
    props.setValue(1)
    // console.log(ratingReview, 'ratingReview');
    // setSubmit(true);
    let body = ratingReview;
    let overAllIndex =body.findIndex((each) => each?.name === "Overall")
    body[overAllIndex].given_rating = calculateOverallRating()
    // let allRating = body.map((each) => each?.given_rating).slice(0,body?.length -1)
    axios
      .post(`${endpoints.newBlog.pendingReview}`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log(response);
        setAlert('success', 'Successfully Created');
      });
  };

  const [dataId, setDataId] = useState();

  const confirmassign = () => {
    let body = {
      booking_detail: {
        is_bookmarked: true,
        is_reassigned: false,
      },
    };

    axios
      .put(`${endpoints.newBlog.activityReview}${dataId}/`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setAlert('success', 'Activity Successfully Shortlisted');

        console.log(response);
      });
  };

  const handleInputCreativity = (event, index) => {
    console.log(index, 'text');

    let arr = [...ratingReview];
    arr[index].remarks = event.target.value;
    setRatingReview(arr);
  };
  // const [starSet,setStarSet]
  const handleInputCreativityOne = (event, newValue, index) => {
    console.log(index, newValue, 'event');
    let arr = [...ratingReview];

    arr[index].given_rating = Number(event.target.value);
    setRatingReview(arr);
    calculateOverallRating();
  };

  const expandMore = () => {
    setSubmit(false);
  };

  const [maxWidth, setMaxWidth] = React.useState('lg');

  const getTotalSubmitted = () => {
    const branchIds = props.selectedBranch.map((obj) => obj.id);
    console.log(branchIds, 'branchIds');

    axios
      .get(
        `${
          endpoints.newBlog.studentSideApi
        }?section_ids=null&&user_id=null&&activity_detail_id=${
          ActivityId?.id
        }&branch_ids=${branchIds == '' ? null : branchIds}&is_reviewed=False`,
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

  const [ratingReview, setRatingReview] = useState([]);
  console.log(ratingReview, 'ratingReview')
  let array = [];
  const getRatingView = (data) => {
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log(response, 'responses');
        response.data.map((obj, index) => {
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          temp['rating'] = Number(obj.level.rating);
          temp['remarks'] = obj.remarks;
          temp['given_rating'] = obj.given_rating;
          array.push(temp);
        });
        setRatingReview(array);
      });
  };
  const [view, setView] = useState(false);
  const [data, setData] = useState();

  const assignPage = (data) => {
    console.log(data, 'idd');
    setView(true);
    setData(data);
    // setBookingId(data?.id);
    getRatingView(data?.id);
    setDataId(data?.id);
  };

  // let counting = '5';

  useEffect(() => {
    getTotalSubmitted();
  }, [props.selectedBranch]);

  const classes = useStyles();
  const ReviewPage = () => {
    history.push('/blog/addreview');
  };
  const calculateOverallRating = () => {
    // const { ratingParameters } = this.state
    let average = 0
    let ave=0
    let aver;
    ratingReview.map(parameter => {
      average += parameter.given_rating
      ave +=Number(parameter.rating)
      aver=ave - Number("5");
      console.log(average, "average", aver,"ave")
    })
    return (average / aver)*5 
  }

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
                <TableCell className={classes.tableCell}>ERP ID</TableCell>

                {/* <TableCell className={classes.tableCell}></TableCell> */}
                <TableCell className={classes.tableCell}>Submission Date</TableCell>
                <TableCell className={classes.tableCell}>Actions</TableCell>
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
                    {response?.booked_user?.name}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.booked_user?.username}
                  </TableCell>
                  {/* <TableCell className={classes.tableCells}>GRADE 1</TableCell> */}
                  <TableCell className={classes.tableCells}>
                    {response?.submitted_on?.substring(0, 10)}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => assignPage(response)}
                      className={classes.buttonColor2}
                    >
                      Add Review
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
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      width='130'
                      alt='image'
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        ERP Id :
                        <span style={{ fontWeight: 'normal' }}>
                          {data?.booked_user?.username}{' '}
                        </span>
                      </div>
                      <div style={{ fontWeight: 'bold' }}>
                        Name :
                        <span style={{ fontWeight: 'normal' }}>
                          {data?.booked_user?.name}
                        </span>
                      </div>
                    </div>
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
                    Description:
                    <span style={{ fontWeight: 'normal' }}>
                      {data?.activity_detail?.description}
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
                  <div style={{paddingTop: '12px' }}>
                    <div
                      style={{
                        background: `url(${data?.template?.template_path})`,
                        backgroundSize: 'contain',
                        position: 'relative',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(244 245 247 / 25%)',
                        height: '683px',
                      }}
                    >
                      <div className='certificate-text-center certificate-input-box'>
                        <textarea
                          className='certificate-box'
                          style={{ width: '338px', height: '366px' }}
                          value={data?.submitted_work?.html_text}
                          placeholder='type text here...'
                        />
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  paddingTop: '9px',
                }}
              >
                {' '}
                <Button
                  variant='outlined'
                  size='medium'
                  onClick={confirmassign}
                  className={classes.buttonColor1}
                  disabled
                  startIcon={<BookmarksIcon style={{ color: 'grey' }} />}
                >
                  Shortlist
                </Button>{' '}
                &nbsp;
                {/* <Button
                  variant='contained'
                  color='primary'
                  disabled
                  size='medium'
                  className={classes.buttonColor}
                  onClick={createPublish}
                >
                  Published Blog{' '}
                </Button> */}
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
                        {obj?.name === 'Overall' ? (
                          ''
                        ) : (
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
                            max={obj?.rating}
                            // defaultValue={props.defaultValue}
                            onChange={(event, newValue) =>
                              handleInputCreativityOne(event, newValue, index)
                            }
                          />
                        </div>
                        )}
                        {/* {obj} */}
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
                              onChange={(event) => handleInputCreativity(event, index)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div style={{display: "flex",
    justifyContent: "space-between"}} >
                    <div style={{paddingLeft:"13px"}}>
                  Overall
                  </div>
                  <div style={{paddingRight:"13px"}}>
                  <StyledRating
                            name={`rating`}
                            size='small'
                            value={calculateOverallRating()}
                            // max={obj?.rating}
                            precision={0.1}
                            readOnly
                            // defaultValue={props.defaultValue}
                            // onChange={(event, newValue) =>
                            //   handleInputCreativityOne(event, newValue, index)
                            // }
                          />
                          </div>
                          </div>

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
                    <Button
                      variant='contained'
                      color='primary'
                      size='medium'
                      className={classes.buttonColor}
                      onClick={() => submitReview()}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}

              {submit == true && (
                <div
                  style={{
                    border: '1px solid #707070',
                    width: '318px',
                    height: 'auto',
                    marginLeft: '8px',
                    marginRight: '4px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <ExpandMoreIcon onClick={expandMore} />
                  </div>
                  <div
                    style={{
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      paddingTop: '5px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {' '}
                      Overall
                      <RatingScale
                        name='simple-controlled'
                        defaultValue={DEFAULT_RATING}
                        onChange={(event, value) => {
                          setValue((prev) => ({ ...prev, rating: value }));
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingBottom: '9px',
                      }}
                    >
                      Review Submitted
                    </div>
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

export default PendingReview;
