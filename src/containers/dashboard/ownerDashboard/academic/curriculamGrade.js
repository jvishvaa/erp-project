/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, createRef } from 'react';
import {
  Grid,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Layout from '../../../Layout';
import {
  Button, Form,
  message, Select
} from 'antd';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import '../academic/style.scss';
import { Table, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Column } from '@ant-design/plots';
import axios from 'axios';
import { Switch, Pagination, Radio } from 'antd';
const { Option } = Select;

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
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
  const [data, setData] = React.useState([]);
  const [teacherData, setTeacherData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [moduleId, setModuleId] = React.useState('');
  const [acadeId, setAcadeId] = React.useState('');
  const [gradeApiData, setGradeApiData] = React.useState([]);
  const [branchName, setBranchName] = React.useState([]);
  const [teacherView, setTeacherView] = useState(1)
  const [dateToday, setDateToday] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { is_superuser } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [collapseData, setCollapseData] = useState([]);
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState([]);
  const [volumeName, setVolumeName] = useState('');
  const [teacherErp, setTeacherErp] = useState('')
  const [page, setPage] = useState(1)
  const [isCompletionReportUnable, setIsCompletionReportUnable] = useState(false);
  const [completionReportLoader, setCompletionReportLoader] = useState(false);  

  const formRef = createRef();

  useEffect(() => fetchReportPipelineConfig(), [user_level]);

  const onTableRowExpand = (expanded, record) => {
    console.log(record);
    setTeacherErp(record?.teacher_erp_id)
    if (volumeId != null) {
      teacherSubjectTable({
        session_year: selectedAcademicYear?.id,
        teacher_erp_id: record?.teacher_erp_id,
        // acad_session: acad_sess_id,
        acad_session: selectedBranch?.id,
        central_gs: record?.central_gs.toString(),
        branch_id: branchId,
        volume: volumeId,
      })
    } else {
      teacherSubjectTable({
        session_year: selectedAcademicYear?.id,
        teacher_erp_id: record?.teacher_erp_id,
        // acad_session: acad_sess_id,
        acad_session: selectedBranch?.id,
        central_gs: record?.central_gs.toString(),
        branch_id: branchId
      })
    }
    console.log(record);
    const keys = [];
    if (expanded) {
      keys.push(record.teacher_erp);
    }

    setExpandedRowKeys(keys);
  };

  // const {
  //   match: {
  //     params: { branchId },
  //   },
  // } = props;

  const branchId = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch?.branch?.id
  );

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch)


  useEffect(() => {
    fetchVolumeListData()
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_sess_id);
    setBranchName(history?.location?.state?.branchName)
    if (history?.location?.state?.teacherView == 2) {
      setTeacherView(2)
    } else {
      setTeacherView(1)
    }
  }, [history]);

  const handlevolume = (e) => {
    console.log(e);
    if (e != undefined) {
      setVolumeId(e.value);
      setVolumeName(e.children);
    }

  };
  const handleClearVolume = () => {
    setVolumeId(null);
    setVolumeName('');
    formRef.current.setFieldsValue({
      volume: 'All',
    });
  };
  const volumeOptions = volumeListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });
  const fetchVolumeListData = () => {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setVolumeListData(result?.data?.result?.results);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const { acad_session_id, module_id, acad_sess_id } = history.location.state;

  console.log(history.location.state);



  const teacherSubjectTable = (params = {}) => {
    console.log({params});
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
    if (teacherView == 1) {
      console.log(selectedAcademicYear);
      if (volumeId != null) {
        gradeListTable({
          acad_session: selectedBranch?.id,
          session_year: selectedAcademicYear?.id,
          volume: volumeId,
          branch_id: branchId,
        });
      } else {
        gradeListTable({
          acad_session: selectedBranch?.id,
          session_year: selectedAcademicYear?.id,
          branch_id: branchId,
        });
      }
    } else {
      if (volumeId != null) {
        gradeTeacherTable({
          acad_session: selectedBranch?.id,
          session_year: selectedAcademicYear?.id,
          branch_id: branchId,
          volume: volumeId,
          page: page
        });
      } else {

        gradeTeacherTable({
          acad_session: selectedBranch?.id,
          branch_id: branchId,
          session_year: selectedAcademicYear?.id,
          page: page
        });
      }
    }
  }, [acad_session_id, volumeId, teacherView, page]);

  const gradeListTable = (params = {}) => {
    setLoading(true);
    setExpandedRowKeys([])
    axiosInstance
      .get(`${endpoints.ownerDashboard.gradeWise}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res);
        setTableData(res?.data?.result);
        // setData(res?.data?.result?.data)
        setLoading(false);
        transData(res?.data?.result?.data)

      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const gradeTeacherTable = (params = {}) => {
    setLoading(true);
    setExpandedRowKeys([])
    axiosInstance
      .get(`${endpoints.ownerDashboard.teacherWise}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
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
  let newData = [];
  const transData = (data) => {
    if (data?.length > 0) {
      data && data.map((ele) => {
        let pending = {
          Total_Pending: Math.round(ele?.pending_periods),
          grade_name: ele?.grade_name,
          grade_id: ele?.grade_id,
          name: 'Pending',
          avg: ele?.avg,
          Total_Completed: Math.round(ele?.completed_periods_sum),
        }
        let completed = {
          periods: ele?.completed_periods_sum,
          grade_name: ele?.grade_name,
          grade_id: ele?.grade_id,
          name: 'Completed',
          avg: ele?.avg
        }
        newData.push(pending)
        newData.push(completed)
      })
    }
    console.log(newData);
    setData(newData)
  }

  const handleViewChange = (e) => {
    setData([])
    console.log(e.target.value);
    setTeacherView(e.target.value)
    // if (teacherView == false) {
    //   setTeacherView(true)
    // } else {
    //   setTeacherView(false)
    // }
  }


  const config = {
    data,
    autoFit: true,
    xField: 'grade_name',
    yField: 'avg',
    tooltip: {
      fields: ['Total_Completed', 'Total_Pending'],
    },
    columnStyle: {
      cursor: 'pointer'
    },
    width: window.innerWidth > 600 && window.innerWidth < 1400 ? 1200 : window.innerWidth > 1400 ? 1300 : window.innerWidth > 1200 ? 1350 : 350,
    height: window.innerHeight > 600 ? 400 : 200,
    minColumnWidth: 70,
    maxColumnWidth: 70,
    label: {
      position: 'middle',
      content: (item) => {
        return `${item.avg.toFixed(2)}%`;
      },
      layout: [

      ],
    },
  };

  const columns1 = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>TEACHER'S NAME</span>,
      dataIndex: 'teacher_name',
      width: '30%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
      width: '30%',
      align: 'center',
      dataIndex: 'total_periods',
      render: (data) => <span className='th-black-1 th-16'>{data.toFixed(0)}</span>,
    },
    // {
    //   title: <span className='th-white th-fw-700'>AVG PERIODS CONDUCTED</span>,
    //   dataIndex: 'avg_conducted_periods',
    //   width: '15%',
    //   align: 'center',
    //   render: (data) => <span className='th-green th-16'>{Math.floor(data)}</span>,
    // },
    // {
    //   title: <span className='th-white th-fw-700'>AVG PERIODS PENDING</span>,
    //   dataIndex: 'avg_pending_periods',
    //   width: '15%',
    //   align: 'center',
    //   render: (data) => <span className='th-green th-16'>{Math.floor(data)}</span>,
    // },
    {
      title: <span className='th-white th-fw-700'>AVG COMPLETION</span>,
      dataIndex: 'avg_completion_percentage',
      width: '30%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data.toFixed(2)} %</span>,
    },

  ];

  const datagen = (data) => {
    console.log(data);
    // let sec_name = data.map((sec) => sec?.section_name.replace(/sec|section/gi, "SEC"))
    let sec_name = data.map((sec) => sec?.section_name)

    console.log(JSON.stringify(sec_name));
    return <span className='th-green th-16'>{sec_name.toString()}</span>
  }

  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        title: <span className='th-white '>SUBJECT NAME</span>,
        dataIndex: 'subject_name',
        align: 'center',
        width: tableWidthCalculator(20) + '%',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>GRADE</span>,
        align: 'center',
        width: '15%',
        dataIndex: 'grade_name',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>SECTION LIST</span>,
        dataIndex: 'sections',
        align: 'center',
        width: '15%',
        render: (data) => datagen(data),
      },
      {
        title: <span className='th-white '>AVG PERIODS CONDUCTED</span>,
        dataIndex: 'conducted_periods',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data.toFixed(1)}</span>,
      },
      {
        title: <span className='th-white '>AVG PERIODS PENDING</span>,
        dataIndex: 'pending_periods',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data.toFixed(1)}</span>,
      },
      {
        title: <span className='th-white '>AVG COMPLETION</span>,
        dataIndex: 'avg_completion',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data.toFixed(2)} %</span>,
      },
      // {
      //   title: <span className='th-white '>Total Periods Pending</span>,
      //   dataIndex: 'pending_periods',
      //   align: 'center',
      //   width: '15%',
      //   render: (data) => <span className='th-red th-16'>{data}</span>,
      // },
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
                  teacher_id: teacherErp,
                  branch_id: branchId,
                  central_gs: row?.central_gs,
                  volumeId: volumeId,
                  pathname: `${window.location.pathname}`

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
        dataSource={collapseData}
        rowKey={(record) => record?.id}
        pagination={false}
        expandRowByClick={true}
        className='th-inner-head'
        rowClassName='th-pointer'
        // showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
        onRow={(row, rowindex) => {
          return {

            onClick: (e) =>
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
                  teacher_id: teacherErp,
                  branch_id: branchId,
                  central_gs: row?.central_gs,
                  volumeId: volumeId,
                  pathname: `${window.location.pathname}`

                },
              })
          }
        }}
      />
    );
  };

  const downloadReport = () => {
    const data = {
      acad_session: acad_sess_id,
      session_year: selectedAcademicYear?.id,
      branch_id: branchId,
    }
    axiosInstance
      .get(`${endpoints.ownerDashboard.gradeWiseReport}`, {
        params: data,
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res);
        setTeacherData(res?.data?.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  const handlePageChange = (page, pageSize) => {
    console.log(page, pageSize);
    setPage(page)
  }

  const handleCompletionReport = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const schoolName = ['dev', 'qa', 'test', 'localhost:3000']?.includes(
      window?.location?.host?.split('.')[0]
    )
      ? 'olvorchidnaigaon'
      : window?.location?.host?.split('.')[0];

    const obj = {
      school_name: schoolName,
      report_name: 'completion_report',
      requested_by: `${userDetails?.first_name} ${userDetails?.last_name}`,
    };
    axios
      .post(`${endpoints?.reportPipeline?.viewReportPipeline}`, obj, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          message.success(result?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => history.push('/report-pipeline'));
  };

  const fetchReportPipelineConfig = () => {
    setCompletionReportLoader(true)
    axios
      .get(
        `${endpoints?.reportPipeline?.reportPipelineConfig}?user_level=${is_superuser ? 1 :user_level}`,
        {
          headers: {
            'x-api-key': 'vikash@12345#1231',
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setIsCompletionReportUnable(result?.data?.result?.access);
        }
      })
      .catch((error) => {
        console.log(error?.message);
      }).
      finally(() => setCompletionReportLoader(false));
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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '25%', fontSize: '16px', fontWeight: '600', margin: 'auto 0' }} >
              {/* <span>Grade View</span>
              <Switch onChange={handleViewChange} />
              <span>Teacher View</span> */}
              <Radio.Group onChange={handleViewChange} value={teacherView}>
                <Radio value={1}>Grade View</Radio>
                <Radio value={2}>Teacher View</Radio>
              </Radio.Group>

            </div>
            <div style={{ width: '40%' }} >
              <Form ref={formRef} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                <div className='col-md-3 col-6 pl-md-1'>
                  <div className='text-left pl-md-1'>Volume</div>
                  <Form.Item name='volume'>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder='Select Volume'
                      showSearch
                      defaultValue='All'
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handlevolume(value);
                      }}
                      onClear={handleClearVolume}
                      allowClear
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {volumeOptions}
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </Grid>
          {teacherView == 1 ?
            <div style={{ width: '100%', marginTop: '5%' }}>

              {data?.length > 0 ?
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '95%' }}>
                    <div style={{ alignItems: 'center', display: 'flex', fontWeight: '600', fontSize: '20px' }} >
                      <p style={{ transform: 'rotate(270deg' }}>Avg Completion %</p>
                    </div>
                    <div>
                      {console.log({ ...config })}
                      <Column {...config} onReady={(plot) => {
                        plot.on('element:click', (e) => {
                          console.log(e?.data?.data);
                          history.push({
                            pathname: `/curriculum-completion-subject/${branchId}/${e?.data?.data?.grade_id}`,
                            state: {
                              grade: e?.data?.data?.grade_id,
                              gradeName: e?.data?.data?.grade_name,
                              acad_session_id: acad_session_id,
                              acad_sess_id: acad_sess_id,
                              module_id: moduleId,
                              branchName: branchName,
                              selectedDate: dateToday,
                              teacherView: teacherView,
                              branch_id: branchId,
                              volumeId: volumeId
                            },
                          })
                        })
                      }
                      } />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '20px', fontWeight: 600, margin: '2% 0' }}>Grade</div>
                </>
                :
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '40px', margin: '5% 0' }} >
                  <span>No Data Found</span>
                </div>

              }
            </div>
            :
            <>
              {isCompletionReportUnable && <div className='w-100 d-flex justify-content-end mb-2 mr-3'>
                <Button loading={completionReportLoader} className='rounded th-br-4' type='primary' onClick={handleCompletionReport}>
                  Download Completion Report
                </Button>
              </div>}
              <div className='row '>
                <div className='col-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
                    }
                    loading={loading}
                    columns={columns1}
                    rowKey={(record) => record?.teacher_erp}
                    expandable={{ expandedRowRender }}
                    dataSource={teacherData?.data}
                    pagination={false}
                    expandIconColumnIndex={6}
                    expandedRowKeys={expandedRowKeys}
                    expandRowByClick={true}
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
                  <Pagination defaultCurrent={page} total={teacherData?.total_pages ? teacherData?.total_pages * 10 : 10} showSizeChanger={false} onChange={handlePageChange} style={{ display: 'flex', justifyContent: 'center' }} />
                </div>

              </div>
            </>
          }
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletion);
