/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Divider,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  TableFooter,
  Paper,
  // Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Collapse,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ChevronRight as ArrowCircleRightIcon,
} from '@material-ui/icons';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { DatePicker, Space } from 'antd';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import { fetchAllSectionsPerGrade } from 'containers/Finance/src/components/Finance/store/actions';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import communicationStyles from 'containers/Finance/src/components/Finance/BranchAccountant/Communication/communication.styles';
import '../academic/style.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Table, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';




// import { TableCell, TableRow } from 'semantic-ui-react';

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
    // marginTop: '15px',
  },
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
  },
  gradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '55vh',
    overflowY: 'scroll',
    backgroundColor: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3) ',
      borderRadius: '10px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      '-webkit-box-shadow': ' inset 0 0 6px rgba(0,0,0,0.5)',
    },
    //   ::-webkit-scrollbar {
    //     width: 12px;
    // }
  },
  eachGradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px 8px',
    margin: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachGradeName: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '4px',
    borderRadius: '5px',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  TableTextLeft: {
    textAlign: 'center !important',
    fontSize: '13px',
  },
  TableTextRight: {
    textAlign: 'right !important',
    fontSize: '14px'
  },
  TableTextRightContainer: {
    textAlign: 'right !important',
    paddingRight: '48px',
  },
  TableHeaderColor: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
    color: 'black',
  },
  tableStateMent: {
    color: `${theme.palette.v2Color1.primaryV2} !important`,
    fontWeight: 'bolder'
  },
  viewButton: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
  },
}));


const CurriculumCompletion = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [tableData, setTableData] = React.useState([]);
  const [teacherData, setTeacherData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [moduleId, setModuleId] = React.useState('');
  const [acadeId, setAcadeId] = React.useState('');
  const [gradeApiData, setGradeApiData] = React.useState([]);
  const [branchName, setBranchName] = React.useState([]);
  const [teacherView, setTeacherView] = useState(false)
  const [dateToday, setDateToday] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [collapseData, setCollapseData] = useState([]);


  const onTableRowExpand = (expanded, record) => {
    console.log(record);
    teacherSubjectTable({
      date: dateToday,
      session_year: selectedAcademicYear?.id,
      teacher_erp: record?.erp_id
    })
    console.log(record);
    const keys = [];
    if (expanded) {
      keys.push(record.erp_id);
    }

    setExpandedRowKeys(keys);
  };

  const {
    match: {
      params: { branchId },
    },
  } = props;

  useEffect(() => {
    // console.log(history?.location?.state, 'Mobile99999999')
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_session_id);
    setBranchName(history?.location?.state?.branchName)
  }, [history]);

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    gradeData(branchId);
  }, [branchId, moduleId]);

  const { acad_session_id, module_id, acad_sess_id } = history.location.state;

  const handleCurrSubject = (gradeId, gradeName) => {
    if (teacherView == true) {
      history.push({
        pathname: `/curriculum-completion-subject/${branchId}/${gradeId}`,
        state: {
          grade: gradeId,
          gradeName: gradeName,
          acad_session_id: acad_session_id,
          acad_sess_id: acad_sess_id,
          module_id: moduleId,
          branchName: branchName,
          selectedDate: dateToday,
          teacherView: teacherView
        },
      });
    } else {
      history.push({
        pathname: `/curriculum-completion-subject/${branchId}/${gradeId}`,
        state: {
          grade: gradeId,
          gradeName: gradeName,
          acad_session_id: acad_session_id,
          acad_sess_id: acad_sess_id,
          module_id: moduleId,
          branchName: branchName,
          selectedDate: dateToday,
          teacherView: teacherView
        },
      });
    }
  };

  const gradeData = (branchId) => {
    if (moduleId !== '' || null || undefined) {
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&module_id=${moduleId}`
        )
        .then((res) => {
          setGradeApiData(res?.data?.data);
        })
        .catch(() => { });
    }
  };


  const teacherSubjectTable = (params = {}) => {
    console.log(params);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.teacherSubjectWise}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res);
        setCollapseData(res?.data?.result);
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log(dateToday);
    if (teacherView == false) {
      gradeListTable({
        // acad_session_id: acad_sess_id,
        session_year: selectedAcademicYear?.id,
        date: moment(dateToday).format('YYYY-MM-DD')
      });
    } else {
      gradeTeacherTable({
        // acad_session_id: acad_sess_id,
        session_year: selectedAcademicYear?.id,
        date: moment(dateToday).format('YYYY-MM-DD')
      });
    }
  }, [acad_session_id, dateToday, teacherView]);

  const gradeListTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.gradeWise}`, {
        params: { ...params },
        headers: {
          // 'X-DTS-Host': window.location.host,
          'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        console.log(res);
        setTableData(res?.data?.result);
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const gradeTeacherTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.teacherWise}`, {
        params: { ...params },
        headers: {
          // 'X-DTS-Host': window.location.host,
          'X-DTS-Host': X_DTS_HOST,
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        console.log(res);
        setTeacherData(res?.data?.result);
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleViewChange = () => {
    if (teacherView == false) {
      setTeacherView(true)
    } else {
      setTeacherView(false)
    }
  }

  const onChangeDate = (value) => {
    console.log(value);
    if (value) {
      setDateToday(moment(value).format('YYYY-MM-DD'));
    }
  }

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>GRADE</span>,
      dataIndex: 'grade_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'total_periods_sum',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS CONDUCTED</span>,
      dataIndex: 'completed_periods_sum',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS PENDING</span>,
      dataIndex: 'pending_periods',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
      dataIndex: 'avg',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data} %</span>,
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      key: 'icon',
      render: (text, row) => (
        <span
          onClick={(e) =>
            history.push({
              pathname: `/curriculum-completion-subject/${branchId}/${row?.grade_id}`,
              state: {
                grade: row?.grade_id,
                gradeName: row?.grade_name,
                acad_session_id: acad_session_id,
                acad_sess_id: acad_sess_id,
                module_id: moduleId,
                branchName: branchName,
                selectedDate: dateToday,
                teacherView: teacherView,
              },
            })
          }
        >
          <RightOutlined className='th-grey th-pointer' />
        </span>
      ),
    },
  ];

  const columns1 = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>Teacher's Name</span>,
      dataIndex: 'name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'total_periods_sum',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS CONDUCTED</span>,
      dataIndex: 'completed_periods_sum',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS PENDING</span>,
      dataIndex: 'pending_periods',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
      dataIndex: 'avg',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data} %</span>,
    },
    // {
    //   title: <span className='th-white th-fw-700'></span>,
    //   dataIndex: '',
    //   width: '15%',
    //   align: 'center',
    //   render: (data) => <span className='th-red th-16'>{data}</span>,
    // },
  ];


  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        title: <span className='th-white '>Subject Name</span>,
        dataIndex: 'subject_name',
        align: 'center',
        width: tableWidthCalculator(20) + '%',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>Grade</span>,
        align: 'center',
        width: '15%',
        dataIndex: 'grade_name',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>Section List</span>,
        dataIndex: 'section_name',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>Total Periods</span>,
        dataIndex: 'total_periods_sum',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>Total Periods Conducted</span>,
        dataIndex: 'completed_periods_sum',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>Total Periods Pending</span>,
        dataIndex: 'pending_periods',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data}</span>,
      },
      {
        title: '',
        align: 'center',
        width: '5%',
        key: 'icon',
        render: (text, row) =>
        (
          <span
            onClick={(e) =>
              history.push({
                pathname: `/curriculum-completion-chapter/${branchId}/${row?.grade_id}`,
                state: {
                  grade: row?.grade_id,
                  gradeName: row?.grade_name,
                  subject_id: row?.subject_id,
                  acad_session_id: acad_session_id,
                  acad_sess_id: acad_sess_id,
                  module_id: moduleId,
                  branchName: branchName,
                  selectedDate: dateToday,
                  teacherView: teacherView,
                  teacher_id: row?.erp_id
                },
              })
            }
          >
            <RightOutlined className='th-grey th-pointer' />
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={collapseData?.data}
        rowKey={(record) => record?.id}
        pagination={false}
        className='th-inner-head'
        // showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
              >
                Curriculum Completion
              </Breadcrumb.Item>
            </Breadcrumb>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }} >
            <Button onClick={handleViewChange} className={clsx(classes.viewButton)} >{teacherView ? 'Grade View' : "Teacher's View"}</Button>
            {/* <Space direction="vertical">
              <DatePicker onChange={onChangeDate} />
            </Space> */}
            <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
              <span className='th-br-4 p-1 th-bg-white'>
                <img src={calendarIcon} className='pl-2' />
                <DatePicker
                  disabledDate={(current) => current.isAfter(moment())}
                  allowClear={false}
                  bordered={false}
                  placement='bottomRight'
                  defaultValue={moment()}
                  onChange={(value) => onChangeDate(value)}
                  showToday={false}
                  suffixIcon={<DownOutlined className='th-black-1' />}
                  className='th-black-2 pl-0 th-date-picker'
                  format={'YYYY/MM/DD'}
                />
              </span>
            </div>
          </Grid>
          {!teacherView ?
            <div className='row '>
                <div className='row mt-3'>
                <div className='col-12'>
                  <div className='row pt-2 align-items-center th-bg-white th-br-4 th-13 th-grey th-fw-500'>
                    <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding w-100'>
                      Total Periods:{' '}
                      <span className='th-primary'>{tableData?.total_periods ? tableData?.total_periods : ''}</span>
                    </div>
                    <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                      Total Periods Conducted:{' '}
                      <span className='th-green'>{tableData?.completed_periods ? tableData?.completed_periods : ''}</span>
                    </div>
                    <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                      Total Periods Pending:{' '}
                      <span className='th-fw-500 th-red'>
                        {tableData?.pending_periods ? tableData?.pending_periods : ''}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
              <div className='col-12'>
                <Table
                  className='th-table'
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                  }
                  loading={loading}
                  columns={columns}
                  rowKey={(record) => record?.grade_id}
                  dataSource={tableData?.data}
                  pagination={false}
                  expandIconColumnIndex={6}

                  scroll={{ x: 'max-content' }}
                />
              </div>
            
            </div>
            :
            <div className='row '>
              <div className='col-12'>
              <div className='row mt-3'>
                <div className='col-12'>
                  <div className='row pt-2 align-items-center th-bg-white th-br-4 th-13 th-grey th-fw-500'>
                    <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding w-100'>
                      Total Periods:{' '}
                      <span className='th-primary'>{teacherData?.total_periods ? teacherData?.total_periods : ''}</span>
                    </div>
                    <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                      Total Periods Conducted:{' '}
                      <span className='th-green'>{teacherData?.completed_periods ? teacherData?.completed_periods : ''}</span>
                    </div>
                    <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                      Total Periods Pending:{' '}
                      <span className='th-fw-500 th-red'>
                        {teacherData?.pending_periods ? teacherData?.pending_periods : ''}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
                <Table
                  className='th-table'
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                  }
                  loading={loading}
                  columns={columns1}
                  rowKey={(record) => record?.erp_id}
                  expandable={{ expandedRowRender }}
                  dataSource={teacherData?.data}
                  pagination={false}
                  expandIconColumnIndex={6}
                  expandedRowKeys={expandedRowKeys}
                  onExpand={onTableRowExpand}
                  expandIcon={({ expanded, onExpand, record }) =>
                    expanded ? (
                      <UpOutlined
                        className='th-black-1 th-pointer'
                        onClick={(e) => onExpand(record, e)}
                      />
                    ) : (
                      <DownOutlined
                        className='th-black-1 th-pointer'
                        onClick={(e) => onExpand(record, e)}
                      />
                    )
                  }
                  scroll={{ x: 'max-content' }}
                />
              </div>
           
            </div>
          }
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletion);
