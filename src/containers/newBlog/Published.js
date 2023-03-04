import React, { useEffect, useState, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Rating from '@material-ui/lab/Rating';
import './styles.scss';
import axios from 'axios';
import endpoints from 'config/endpoints';
import Loader from 'containers/sure-learning/hoc/loader';
import {
  UserAddOutlined,
} from '@ant-design/icons';
import { Tag, Table as TableAnt, message } from 'antd';

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
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const classes = useStyles();
  let dataes = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [totalPublish, setTotalPublish] = useState([]);
  const [loading, setLoading] = useState(false);
  // const { setAlert } = useContext(AlertNotificationContext);
  const user_level = dataes?.user_level;
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
      setTotalPublish([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props.flag && currentPage) {
      getTotalPublish();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);

  const getTotalPublish = () => {
    if (props) {
      setLoading(true);
      axios
        .get(
          `${endpoints.newBlog.studentPublishApi}?activity_detail_id=${
            ActivityId?.id
          }&branch_ids=${
            props?.selectedBranch?.id == '' ? null : props?.selectedBranch?.id
          }&grade_id=${props?.selectedGrade}&page=${currentPage}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          props.setFlag(false);
          // setAlert('success', response?.data?.message);
          setTotalPublish(response?.data?.result);
          setCurrentPage(response.data?.page);
          setTotalCount(response?.data?.total);
          setLimit(Number(limit));
          props.setFlag(false);
          // setAlert('success', response?.data?.message);
          setLoading(false);
        });
    }
  };

  const handleUnPublish = (data) => {
    setLoading(true);
    let requestData = {
      booking_id: data?.booking_detail_id,
      is_published: false,
    };
    axios
      .post(`${endpoints.newBlog.publishBlogWallApi}`, requestData, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setLoading(false);
          message.success(res?.data?.message)
          getTotalPublish();
        }
      })
      .catch((err) => {
        console.log(err, 'res4');
        setLoading(false);
        message.error('Server Error')
      });
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
      render: (text, row) => <span className='th-black-1'>{row?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Grade</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.grade}</span>,
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
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          <StyledRating
            // name={`rating${index}`}
            size='small'
            readOnly
            precision={0.5}
            defaultValue={row?.given_rating}
            max={parseInt(row?.rating)}
          />
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      // width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<UserAddOutlined className='th-14' />}
            color='red'
            className='th-br-5 th-pointer py-1'
            onClick={() => handleUnPublish(row)}
          >
            <span className='th-fw-500 th-14'>Un-Publish</span>
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading && <Loader />}
      <div className='col-12 px-0'>
        {user_level == 11 ? (
          ''
        ) : (
          <TableAnt
            columns={columns}
            dataSource={totalPublish}
            className='th-table'
            rowClassName={(record, index) =>
              `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
            }
            loading={loading}
            pagination={false}
            scroll={{ x: totalPublish.length > 0 ? 'max-content' : null, y: 600 }}
          />
        )}
      </div>

      {/* <Paper className={`${classes.root} common-table`} id='singleStudent'>
        {user_level == 11 ? (
          ''
        ) : (
          <TableContainer
            className={`table table-shadow view_users_table ${classes.container}`}
          >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className={`${classes.columnHeader} table-header-row`}>
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    S No.
                  </TableCell>
                  <TableCell className={classes.tableCell}>Student Name</TableCell>
                  <TableCell className={classes.tableCell}>Grade</TableCell>
                  <TableCell className={classes.tableCell}>Submission Date</TableCell>
                  <TableCell className={classes.tableCell}>Overall Score</TableCell>
                  <TableCell className={classes.tableCell}></TableCell>

                  <TableCell style={{ width: '267px' }} className={classes.tableCell}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {totalPublish?.map((response, index) => (
                <TableBody>
                  <TableRow hover role='checkbox' tabIndex={-1}>
                    <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                    <TableCell className={classes.tableCells}>{response?.name}</TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.grade}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.submitted_on.slice(0, 10)}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      <StyledRating
                        name={`rating${index}`}
                        size='small'
                        readOnly
                        precision={0.5}
                        defaultValue={response?.given_rating}
                        max={parseInt(response?.rating)}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {' '}
                      <StarsIcon style={{ color: '#F7B519' }} />
                    </TableCell>

                    <TableCell className={classes.tableCells}>
                      <Button
                        variant='outlined'
                        size='small'
                        className={classes.buttonColor1}
                        onClick={() => handleUnPublish(response)}
                      >
                        Un-Publish
                      </Button>
                      &nbsp;&nbsp;
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
        )}
      </Paper> */}
    </>
  );
};

export default Published;
