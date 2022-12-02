/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Layout from '../../../Layout';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import '../academic/style.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Table, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import { LeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Button, Form, Select, message } from 'antd';




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


const TeacherSubject = (props) => {
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

  const branchId = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch?.branch?.id
);
const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [collapseData, setCollapseData] = useState([]);

  //volume data
  const { Option } = Select;

  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState();
  const [volumeName, setVolumeName] = useState('');

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
  const volumeOptions = volumeListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });

  const handlevolume = (e) => {
    if (e?.value) {
      setVolumeId(e.value);
      setVolumeName(e.children);
    } else {
      setVolumeId('');
      setVolumeName('');
    }
  };
  const handleClearVolume = () => {
    setVolumeId('');
    setVolumeName('');
  };

  const onTableRowExpand = (expanded, record) => {
    console.log(record , volumeId );
    if(volumeId != null || volumeId != undefined ){
    teacherSubjectTable({
      acad_session: acad_sess_id,
      session_year: acad_session_id,
      branch_id: branchId,
      central_gs_mappings: record?.central_gs_mappings.toString(),
      grade_id: record?.grade_id,
      sections_count: record?.section_count,
      volume: volumeId 
    })
  } else {
    teacherSubjectTable({
      acad_session: acad_sess_id,
      session_year: acad_session_id,
      branch_id: branchId,
      central_gs_mappings: record?.central_gs_mappings.toString(),
      grade_id: record?.grade_id,
      sections_count: record?.section_count,
    })
  }
    console.log(record);
    const keys = [];
    if (expanded) {
      keys.push(record.grade_id);
    }

    setExpandedRowKeys(keys);
  };


  useEffect(() => {
    console.log(history?.location?.state, 'Mobile99999999')
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_sess_id);
    setBranchName(history?.location?.state?.branchName)
  }, [history]);

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    fetchVolumeListData()
  }, [branchId, moduleId]);


  const acad_session_id = selectedAcademicYear?.id
  const acad_sess_id = selectedBranch?.id


  const teacherSubjectTable = (params = {}) => {
    console.log(params);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.teacherSubjectWiseReport}`, {
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
    if (volumeId == null) {
      gradeTeacherTable({
        acad_session: history?.location?.state?.acad_sess_id,
        session_year: history?.location?.state?.acad_session_id,
        branch_id: branchId
      });
    } else {
      gradeTeacherTable({
        acad_session: history?.location?.state?.acad_sess_id,
        session_year: history?.location?.state?.acad_session_id,
        branch_id: branchId,
        volume: volumeId
      });
    }
    setExpandedRowKeys([])
  }, [acad_session_id, volumeId]);

  const gradeTeacherTable = (params = {}) => {
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
        setTeacherData(res?.data?.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };


  const columns1 = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>GRADE NAME</span>,
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
      render: (data) => <span className='th-black-1 th-16'>{data.toFixed(0)}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS CONDUCTED</span>,
      dataIndex: 'completed_periods_sum',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{Math.floor(data)}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL PERIODS PENDING</span>,
      dataIndex: 'pending_periods',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{Math.floor(data)}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
      dataIndex: 'avg',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data.toFixed(2)} %</span>,
    },

  ];
  const handleBack = () => {
    history.goBack();
  }

  const datagen = (data) => {
    console.log(data);
    let sec_name = data && data.map((sec) => sec?.section_name)

    console.log(JSON.stringify(sec_name));
    return <span className='th-black th-16'>{sec_name.toString()}</span>
  }

  const expandedRowRender = (record, index) => {
    console.log(record, 'rec');
    const innerColumn = [
      {
        title: <span className='th-white '>SUBJECT NAME</span>,
        dataIndex: 'subject_name',
        align: 'center',
        width: tableWidthCalculator(20) + '%',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      // {
      //   title: <span className='th-white '>Grade</span>,
      //   align: 'center',
      //   width: '15%',
      //   dataIndex: 'grade_name',
      //   render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      // },
      {
        title: <span className='th-white '>SECTION LIST</span>,
        dataIndex: 'sections',
        align: 'center',
        width: '15%',
        render: (data) => datagen(data),
      },
      {
        title: <span className='th-white '>AVG. TOTAL PERIODS</span>,
        dataIndex: 'total_periods',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>AVG. PERIODS PENDING</span>,
        dataIndex: 'pending_periods',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data}</span>,
      },
      {
        title: <span className='th-white '>AVG. COMPLETION</span>,
        dataIndex: 'avg_completion',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data}%</span>,
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
                pathname: `/curriculum-completion-chapter/${branchId}/${record?.grade_id}`,
                state: {
                  grade: teacherData[index]?.grade_id,
                  gradeName: history?.location?.state?.grade_name,
                  subject_id: row?.subject_id,
                  acad_session_id: acad_session_id,
                  acad_sess_id: acad_sess_id,
                  module_id: moduleId,
                  branchName: branchName,
                  selectedDate: dateToday,
                  teacherView: false,
                  central_gs: row?.central_gs,
                  branch_id: branchId
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
        rowKey={(record) => record?.subject_id}
        pagination={false}
        rowClassName='th-pointer'
        className='th-inner-head'
        // showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
        onRow={(row, rowindex) => {
          return {

            onClick: (e) =>
              history.push({
                pathname: `/curriculum-completion-chapter/${branchId}/${record?.grade_id}`,
                state: {
                  grade: record.grade_id,
                  gradeName: history?.location?.state?.grade_name,
                  subject_id: row?.subject_id,
                  acad_session_id: acad_session_id,
                  acad_sess_id: acad_sess_id,
                  module_id: moduleId,
                  branchName: branchName,
                  selectedDate: dateToday,
                  teacherView: false,
                  central_gs: row?.central_gs,
                  branch_id: branchId
                },
              })
          }
        }}
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
            {/* <Space direction="vertical">
              <DatePicker onChange={onChangeDate} />
            </Space> */}
            <Button onClick={handleBack} icon={<LeftOutlined />} className={clsx(classes.backButton)} >Back</Button>

            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left pl-md-1'>Volume</div>
              <Form.Item name='volume'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Volume'
                  defaultValue='All'
                  allowClear
                  showSearch
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
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {volumeOptions}
                </Select>
              </Form.Item>
            </div>
          </Grid>

          <div className='row '>
            <div className='col-12'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
                }
                loading={loading}
                columns={columns1}
                rowKey={(record) => record?.grade_id}
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
            </div>

          </div>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(TeacherSubject);
