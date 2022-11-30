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
import Loader from 'components/loader/loader';

import axios from 'axios';
import './images.css';
const DEFAULT_RATING = 0;
const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: '#E1C71D',
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
  buttonColor9: {
    color: '#bdbdbd !important',
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
    maxWidth: '95vw',
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
  const [imageData, setImageData] = useState();
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [submit, setSubmit] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const [totalCount,setTotalCount] = useState(0);
  const [currentPage,setCurrentPage] = useState(1)
  const [totalPages,setTotalPages] = useState(0);
  const [limit,setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonFlag,setButtonFlag] = useState(false);
  const [loading,setLoading] = useState(false);

  let array = [];
  const getRatingView = (data) => {
    setLoading(true)
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
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false)
      });
  };

  const confirmassign = (response) => {
    setLoading(true)
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
        setButtonFlag(true)
        getTotalSubmitted();

        console.log(response);
        setLoading(false)
      });
  };

  const getTotalSubmitted = () => {
    if(props){
      setLoading(true)
      const branchIds = props.selectedBranch.map((obj) => obj.id);
      const gradeIds = props?.selectedGrade?.id
  
      axios
        .get(
          `${endpoints.newBlog.studentSideApi}?section_ids=null&&user_id=null&branch_ids=${branchIds==""?null:branchIds}&grade_id=${gradeIds}&activity_detail_id=${ActivityId?.id}&is_reviewed=True&page=${currentPage}&page_size${limit}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          setTotalCount(response?.data?.count)
          setTotalPages(response?.data?.page_size)
          setCurrentPage(response?.data?.page)
          setLimit(Number(limit))
          props.setFlag(false)
          setAlert('success', response?.data?.message)
          setTotalSubmitted(response?.data?.result);
          setLoading(false)
        });
      
    }
  };

  const assignPage = (data) => {
    if(data?.length !== 0){
      setView(true);
      setImageData(JSON?.parse(data?.template?.html_file))
      setData(data);
      setDataId(data?.id);
  
      getRatingView(data?.id);
    }
  };


  useEffect(()=>{
    if(props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0){
      setTotalSubmitted([])
    }

  },[props.selectedBranch, props.selectedGrade, props.flag])

  useEffect(() => {
    if(props?.flag && currentPage){
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade,props.flag, currentPage]);
  const [view, setView] = useState(false);
  const [data, setData] = useState();
  const handleCloseViewMore = () => {
    setView(false);
  };

  const handlePagination = (event, page) =>{
    setIsClicked(true);
    setCurrentPage(page);
  }

  return (
    <>
    {loading && <Loader/>}
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
                <TableCell className={classes.tableCell}>Reviewed By</TableCell>
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
                    {response?.booked_user?.name}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.booked_user?.username}
                  </TableCell>
                  {/* <TableCell className={classes.tableCells}>GRADE 1</TableCell> */}
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.submitted_on?.substring(0, 10)}
                  </TableCell>
                  <TableCell className={classes.tableCells}>{response?.reviewer}</TableCell>
                  <TableCell className={classes.tableCells}>
                    <StyledRating
                      name={`rating${index}`}
                      size='small'
                      readOnly
                      // rating={response?.user_reviews?.given_rating}
                      defaultValue={response?.user_reviews?.given_rating}
                      max={parseInt(response?.user_reviews?.level?.rating)}
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
                      className={response?.is_bookmarked ? classes.buttonColor9 : classes.buttonColor1}
                      onClick={() => confirmassign(response)}
                      disabled={response?.is_bookmarked }


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
            count={totalCount}
            rowsPerPage={limit}
            page={Number(currentPage) - 1}
            onChangePage={(e, page) => {
            handlePagination(e, page);
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

      <Drawer
        anchor='right'
        maxWidth={maxWidth}
        open={view}
        onClose={handleCloseViewMore}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div style={{ width: '100%', marginTop: '72px' }}>
          <div style={{ fontSize: '24px', display:'flex', justifyContent:'space-between' }}>
            <strong>Preview</strong>
            <strong  onClick={handleCloseViewMore} style={{marginRight:'10px', cursor:'pointer'}}>x</strong>
          </div>
          <Divider />

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  border: '1px solid #813032',
                  width: '583px',
                  // background: '#47B8CF',
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
          background: `url(${data?.template?.template_path})`,
          backgroundSize: "contain",
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(244 245 247 / 25%)",
    height: "683px",
        }}
      >
        <div className="certificate-text-center certificate-input-box" style={{top: imageData ? `calc(279px + ${imageData[0]?.x_cordinate.concat('px')})` : '', left: imageData ? `calc(232px + ${imageData[0]?.y_cordinate.concat('px')})` : ''}}>
          <textarea className="certificate-box" style={{width: imageData ?  `${imageData[0]?.width.concat('px')}` : '',
    height: imageData ? `${imageData[0]?.height.concat('px')}` : ''}} value={data?.submitted_work?.html_text} placeholder="type text here..." />
         
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
                            // rating={obj?.given_rating}
                            defaultValue={obj?.given_rating}
                            precision={0.1}
                            max={parseInt(obj?.level)}
                            readOnly
                            // defaultValue={props.defaultValue}
                          />
                        </div>
                        {/* {obj?.name == 'Overall' ? (
                          ''
                        ) : ( */}
                          <div>
                            <TextField
                              id='outlined-basic'
                              size='small'
                              variant='outlined'
                              value={obj?.remarks}
                              style={{ width: '264px' }}
                              inputProps={
                                { readOnly: true, }
                              }
                            />
                          </div>
                        {/* // )} */}
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
