import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import {
  UserOutlined,
  MonitorOutlined,
  CloseOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Avatar, Tag, Table as TableAnt, Input, Drawer, Space, message } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import endpoints from '../../config/endpoints';
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
  // const { setAlert } = useContext(AlertNotificationContext);
  const [dataId, setDataId] = useState();
  let datas = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = datas?.token;
  const user_level = datas?.user_level;

  const [values, setValues] = useState();
  const [imageData, setImageData] = useState();
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [submit, setSubmit] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  let array = [];
  const getRatingView = (data) => {
    setLoading(true);
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
          temp['remarks'] = obj.remarks;
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false);
      });
  };

  const confirmassign = (response) => {
    setLoading(true);
    let body = {
      booking_detail: {
        is_bookmarked: true,
        is_reassigned: false,
      },
    };

    axios
      .put(`${endpoints.newBlog.activityReview}${response?.id}/`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        message.success('Activity Successfully Shortlisted');
        setButtonFlag(true);
        getTotalSubmitted();

        console.log(response);
        setLoading(false);
      });
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);

      axios
        .get(
          `${
            endpoints.newBlog.studentSideApi
          }?section_ids=null&&user_id=null&branch_ids=${
            props?.selectedBranch?.id == '' ? null : props?.selectedBranch?.id
          }&grade_id=${props?.selectedGrade}&activity_detail_id=${
            ActivityId?.id
          }&is_reviewed=True&page=${currentPage}&page_size${limit}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          setTotalCount(response?.data?.count);
          setTotalPages(response?.data?.page_size);
          setCurrentPage(response?.data?.page);
          setLimit(Number(limit));
          props.setFlag(false);
          // setAlert('success', response?.data?.message);
          setTotalSubmitted(response?.data?.result);
          setLoading(false);
        });
    }
  };

  const assignPage = (data) => {
    if (data?.length !== 0) {
      setView(true);
      setImageData(JSON?.parse(data?.template?.html_file));
      setData(data);
      setDataId(data?.id);

      getRatingView(data?.id);
    }
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props?.flag && currentPage) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);
  const [view, setView] = useState(false);
  const [data, setData] = useState();
  const handleCloseViewMore = () => {
    setView(false);
  };

  const handlePagination = (event, page) => {
    setIsClicked(true);
    setCurrentPage(page);
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      // width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Student's Name</span>,
      // dataIndex: 'title',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.booked_user?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP ID</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.booked_user?.username}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Submission Date</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.submitted_on?.substring(0, 10)}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Reviewed By</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.reviewer}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          <StyledRating
            // name={`rating${index}`}
            size='small'
            readOnly
            defaultValue={row?.user_reviews?.given_rating}
            max={parseInt(row?.user_reviews?.level?.rating)}
          />
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<UserAddOutlined className='th-14' />}
            color='green'
            className='th-br-5 th-pointer py-1'
            onClick={() => confirmassign(row)}
            disabled={row?.is_bookmarked}
          >
            <span className='th-fw-500 th-14'> Shortlist</span>
          </Tag>
          <Tag
            icon={<MonitorOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => assignPage(row)}
          >
            <span className='th-fw-500 th-14'>Check Review</span>
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='col-12 px-0'>
        <TableAnt
          columns={columns}
          dataSource={totalSubmitted}
          className='th-table'
          rowClassName={(record, index) =>
            `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
          }
          loading={loading}
          pagination={false}
          scroll={{ x: totalSubmitted.length > 0 ? 'max-content' : null, y: 600 }}
        />
      </div>
      <Drawer
        title={<span className='th-fw-500'>Preview</span>}
        placement='right'
        onClose={handleCloseViewMore}
        zIndex={1300}
        visible={view}
        width={'70vw'}
        closable={false}
        className='th-resources-drawer'
        extra={
          <Space>
            <CloseOutlined onClick={handleCloseViewMore} />
          </Space>
        }
      >
        <div>
          <div className='row'>
            <div className='col-12 px-0 th-bg-white '>
              <div className='row'>
                <div className='col-8 px-1'>
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
                    <div style={{ paddingTop: '12px' }}>
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
                  </div>
                </div>
                <div className='col-4 px-1'>
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      alt='image'
                      style={{
                        height: 100,
                        objectFit: 'fill',
                      }}
                    />
                  </div>
                  <div className='d-flex align-items-center pr-1'>
                    <Avatar
                      size={50}
                      aria-label='recipe'
                      icon={
                        <UserOutlined
                          color='#F3F3F3'
                          style={{ color: '#F3F3F3' }}
                          twoToneColor='white'
                        />
                      }
                    />
                    <div className='text-left ml-3'>
                      <div className=' th-fw-600 th-16'> {data?.booked_user?.name}</div>
                      <div className=' th-fw-500 th-14'>{data?.branch?.name}</div>
                      <div className=' th-fw-500 th-14'>{data?.grade?.name}</div>
                    </div>
                  </div>
                  <div className='col-12 px-0'>
                    <div
                      className='th-bg-grey py-3 px-2 th-br-8'
                      style={{ outline: '1px solid #d9d9d9' }}
                    >
                      <div className=' th-16 th-black-2'>
                        Title :{' '}
                        <span className='th-16 th-fw-500 th-black-1'>
                          {data?.activity_detail?.title}
                        </span>
                      </div>
                      <div
                        className='mt-2'
                        style={{ overflowY: 'auto', maxHeight: '25vh' }}
                      >
                        <span className='th-16 th-black-2'>Description :&nbsp;</span>
                        <span className='th-16 th-fw-400 th-black-1'>
                          {data?.activity_detail?.description}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <div className='th-fw-500 th-16 mb-2'>Review</div>
                    <div
                      className='px-1 py-2 th-br-5'
                      style={{ outline: '1px solid #D9D9D9' }}
                    >
                      {/* {ratingReview?.map((obj, index) => {
                        return (
                          <div className='col-12 px-1'>
                            <div
                              key={index}
                              className='th-black d-flex'
                              style={{ justifyContent: 'space-between' }}
                            >
                              {obj?.name}
                              <StyledRating
                                name={`rating`}
                                size='small'
                                defaultValue={obj?.given_rating}
                                precision={0.1}
                                max={parseInt(obj?.level)}
                                readOnly
                              />
                              <div>
                              <Input
                                  value={obj?.remarks}
                                  readOnly
                                  placeholder='Mandatory'
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })} */}

                      {ratingReview.map((obj, index) => {
                        return (
                          <div className='col-12 px-1'>
                            {obj?.name === 'Overall' ? (
                              <div
                                key={index}
                                className='th-black d-flex'
                                style={{ justifyContent: 'space-between' }}
                              >
                                {' '}
                                <b>{obj?.name}</b>
                                <StyledRating
                                  name={`rating`}
                                  size='small'
                                  defaultValue={obj?.given_rating}
                                  precision={0.1}
                                  max={parseInt(obj?.level)}
                                  readOnly
                                />
                              </div>
                            ) : (
                              <div
                                key={index}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                {obj?.name}
                                <StyledRating
                                  name={`rating${index}`}
                                  size='small'
                                  defaultValue={obj?.given_rating}
                                  precision={0.1}
                                  max={parseInt(obj?.level)}
                                  readOnly
                                />
                              </div>
                            )}
                            {obj?.name == 'Overall' ? (
                              <div>
                                <Input value={obj?.remarks} placeholder='Mandatory' />
                              </div>
                            ) : (
                              <div>
                                <Input value={obj?.remarks} placeholder='Optional' />
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
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* {loading && <Loader />}
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
                <TableRow hover role='checkbox' tabIndex={-1}>
                  <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.booked_user?.name}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.booked_user?.username}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.submitted_on?.substring(0, 10)}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.reviewer}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    <StyledRating
                      name={`rating${index}`}
                      size='small'
                      readOnly
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
                      className={
                        response?.is_bookmarked
                          ? classes.buttonColor9
                          : classes.buttonColor1
                      }
                      onClick={() => confirmassign(response)}
                      disabled={response?.is_bookmarked}
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
      </Paper> */}

      {/* <Drawer
        anchor='right'
        maxWidth={maxWidth}
        open={view}
        onClose={handleCloseViewMore}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div style={{ width: '100%', padding: '10px' }}>
          <div
            style={{ fontSize: '24px', display: 'flex', justifyContent: 'space-between' }}
          >
            <strong>Preview</strong>
            <strong
              onClick={handleCloseViewMore}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            >
              {' '}
              <CancelIcon />
            </strong>
          </div>
          <Divider />

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  border: '1px solid #813032',
                  width: '583px',
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
                    height: 'auto',
                    marginTop: '12px',
                    marginBottom: '29px',
                  }}
                >
                  <div style={{ paddingLeft: '30px', paddingTop: '12px' }}>
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
                      <div
                        className='certificate-text-center certificate-input-box'
                        style={{
                          top: imageData
                            ? `calc(279px + ${imageData[0]?.x_cordinate.concat('px')})`
                            : '',
                          left: imageData
                            ? `calc(232px + ${imageData[0]?.y_cordinate.concat('px')})`
                            : '',
                        }}
                      >
                        <textarea
                          className='certificate-box'
                          style={{
                            width: imageData ? `${imageData[0]?.width.concat('px')}` : '',
                            height: imageData
                              ? `${imageData[0]?.height.concat('px')}`
                              : '',
                          }}
                          value={data?.submitted_work?.html_text}
                          placeholder='type text here...'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item>
              <div>
                <div style={{ display: 'flex', width: '100%', padding: '0.5rem 1rem' }}>
                  <div style={{ padding: '5px' }}>
                    <Avatar
                      aria-label='recipe'
                      icon={
                        <UserOutlined
                          color='#f3f3f3'
                          style={{ color: '#f3f3f3' }}
                          twoToneColor='white'
                        />
                      }
                    ></Avatar>
                  </div>
                  <div style={{ padding: '0 0.5rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>
                      {data?.booked_user?.name}
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>
                      {data?.branch?.name}
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '12px' }}>
                      {data?.grade?.name}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: '#f9f9f9',
                  margin: '0.5rem 1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  marginTop: '10px',
                  height: 'auto',
                  border: '1px solid #dbdbdb',
                  width: '21vw',
                  overflowY: 'auto',
                  maxHeight: '16vh',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    fontWeight: 'bold',
                    paddingLeft: '10px',
                    marginTop: '10px',
                  }}
                >
                  <span style={{ fontWeight: 'normal', fontSize: '16px' }}>
                    Title: {data?.activity_detail?.title}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    fontWeight: 'bold',
                    paddingLeft: '10px',
                    paddingBottom: '10px',
                  }}
                >
                  <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px' }}>
                    Description: {data?.activity_detail?.description}
                  </span>
                </div>
              </div>
              <Divider />

              {submit == false ? (
                <div style={{ padding: '10px' }}>Review</div>
              ) : (
                <div style={{ padding: '8px' }}>Edit Review</div>
              )}
              {submit == false && (
                <div
                  style={{
                    border: '1px solid grey',
                    width: '295px',
                    height: 'auto',
                    margin: 'auto',
                    background: '#f4f5f9',
                    borderRadius: '5px',
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
                            defaultValue={obj?.given_rating}
                            precision={0.1}
                            max={parseInt(obj?.level)}
                            readOnly
                          />
                        </div>
                        <div>
                          <TextField
                            id='outlined-basic'
                            size='small'
                            variant='outlined'
                            value={obj?.remarks}
                            style={{ width: '264px', background: 'white' }}
                            inputProps={{ readOnly: true }}
                          />
                        </div>
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
                  ></div>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </Drawer> */}
    </>
  );
};

export default Reviewed;
