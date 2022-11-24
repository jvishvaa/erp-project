/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
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
  const [teacherView, setTeacherView] = useState(false)
  const [dateToday, setDateToday] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [collapseData, setCollapseData] = useState([]);
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState([]);
  const [volumeName, setVolumeName] = useState('');
  const [teacherErp, setTeacherErp] = useState('')

  const onTableRowExpand = (expanded, record) => {
    console.log(record);
    setTeacherErp(record?.teacher_erp_id)
    teacherSubjectTable({
      session_year: selectedAcademicYear?.id,
      teacher_erp_id: record?.teacher_erp_id,
      acad_session: acad_sess_id,
      central_gs: record?.central_gs.toString(),
      branch_id: branchId
    })
    console.log(record);
    const keys = [];
    if (expanded) {
      keys.push(record.teacher_erp);
    }

    setExpandedRowKeys(keys);
  };

  const {
    match: {
      params: { branchId },
    },
  } = props;

  useEffect(() => {
    fetchVolumeListData()
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_sess_id);
    setBranchName(history?.location?.state?.branchName)
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
      console.log(selectedAcademicYear);
      if (volumeId != null) {
        gradeListTable({
          acad_session: acad_sess_id,
          session_year: selectedAcademicYear?.id,
          volume: volumeId,
          branch_id: branchId,
        });
      } else {
        gradeListTable({
          acad_session: acad_sess_id,
          session_year: selectedAcademicYear?.id,
          branch_id: branchId,
        });
      }
    } else {
      if (volumeId != null) {
        gradeTeacherTable({
          acad_session: acad_sess_id,
          session_year: selectedAcademicYear?.id,
          branch_id: branchId,
          volume: volumeId,
        });
      } else {

        gradeTeacherTable({
          acad_session: acad_sess_id,
          branch_id: branchId,
          session_year: selectedAcademicYear?.id,
        });
      }
    }
  }, [acad_session_id, volumeId, teacherView]);

  const gradeListTable = (params = {}) => {
    setLoading(true);

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
          Pending: Math.round(ele?.pending_periods),
          grade_name: ele?.grade_name,
          grade_id: ele?.grade_id,
          name: 'Pending',
          avg: ele?.avg,
          Completed: Math.round(ele?.completed_periods_sum),
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

  const handleViewChange = () => {
    setData([])
    if (teacherView == false) {
      setTeacherView(true)
    } else {
      setTeacherView(false)
    }
  }


  const config = {
    data,
    autoFit: true,
    xField: 'grade_name',
    yField: 'avg',
    tooltip: {
      fields: ['Completed', 'Pending'],
    }
    ,
    width: window.innerWidth > 600 && window.innerWidth < 1400 ? 900 : window.innerWidth > 1400 ? 1200 : window.innerWidth > 1200 ? 1150 : 350,
    height: window.innerHeight > 600 ? 700 : 200,
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
      title: <span className='th-white pl-4 th-fw-700 '>Teacher's Name</span>,
      dataIndex: 'teacher_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'total_periods',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS CONDUCTED</span>,
      dataIndex: 'avg_conducted_periods',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data.toFixed(2)}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS PENDING</span>,
      dataIndex: 'avg_pending_periods',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data.toFixed(2)}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
      dataIndex: 'avg_completion_percentage',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data} %</span>,
    },

  ];

  const datagen = (data) => {
    console.log(data);
    let sec_name = data.map((sec) => sec?.section_name)

    console.log(JSON.stringify(sec_name));
    return <span className='th-green th-16'>{sec_name.toString()}</span>
  }

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
        dataIndex: 'sections',
        align: 'center',
        width: '15%',
        render: (data) => datagen(data),
      },
      {
        title: <span className='th-white '>Total Periods Conducted</span>,
        dataIndex: 'total_periods',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>Avg. Completion</span>,
        dataIndex: 'avg_completion',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data} %</span>,
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
                  central_gs: row?.central_gs
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
        className='th-inner-head'
        // showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
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
            {/* <Button onClick={downloadReport} className={clsx(classes.viewButton)} >Download Report</Button> */}
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
          </Grid>
          {!teacherView ?
            <div style={{ width: '100%', marginTop: '5%' }}>

              {data?.length > 0 ?
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
                            },
                          })
                        })
                      }
                      } />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '20px', fontWeight: 600, margin: '2% 0' }}>Grades</div>
                </>
                :
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '40px', margin: '5% 0' }} >
                  <span>No Data Found</span>
                </div>

              }
            </div>
            :
            <>
              <div className='row '>
                <div className='col-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading}
                    columns={columns1}
                    rowKey={(record) => record?.teacher_erp}
                    expandable={{ expandedRowRender }}
                    dataSource={teacherData?.data}
                    pagination={{ total: teacherData?.total_pages }}
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
            </>
          }
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletion);
