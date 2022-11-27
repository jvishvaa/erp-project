import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';

const { RangePicker } = DatePicker;

const SubjectwiseDiaryReport = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const history = useHistory();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [subjectwiseReport, setSubjectwiseReport] = useState([]);
  const [subjectwiseStats, setSubjectwiseStats] = useState();
  const [teacherwiseReport, setTeacherwiseReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInner, setLoadingInner] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [diaryType, setDiaryType] = useState(null);
  const [tableExpanded, setTableExpanded] = useState(false);

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const onTableRowExpand = (expanded, record) => {
    setTableExpanded(false);
    const keys = [];
    setTeacherwiseReport([]);
    if (expanded) {
      setTableExpanded(true);
      keys.push(record.subject_id);
      fetchTeacherwiseReport({
        acad_session_id: selectedBranch?.id,
        dairy_type: diaryType,
        grade_id: selectedSection?.grade_id,
        section_mapping: selectedSection?.section_mapping,
        subject_id: record.subject_id,
        start_date: startDate,
        end_date: endDate,
      });
    }

    setExpandedRowKeys(keys);
  };
  const fetchSubjectwiseReport = (params = {}) => {
    setSubjectwiseReport([]);
    setLoading(true);
    setExpandedRowKeys([]);
    axios
      .get(`${endpoints.diaryReport.subjectwiseReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSubjectwiseReport(res?.data?.result?.data);
          setSubjectwiseStats(res?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchTeacherwiseReport = (params = {}) => {
    setLoadingInner(true);
    axios
      .get(`${endpoints.diaryReport.subjectTeacherReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setTeacherwiseReport(res?.data?.result?.data);
        }
        setLoadingInner(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingInner(false);
      });
  };

  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        dataIndex: 'subject__subject_name',
        align: 'center',
        width: tableWidthCalculator(30) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        align: 'center',
        width: '20%',
        // render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'name',
        align: 'center',
        width: '30%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'dairy_count',
        align: 'center',
        width: '20%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'icon',
        align: 'center',
        width: '5%',
        render: () => <RightOutlined className='th-grey th-pointer' />,
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={teacherwiseReport}
        // rowKey={(record) => record?.id}
        pagination={false}
        loading={loadingInner}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
        rowClassName={(record, index) => 'th-pointer th-row'}
        onRow={(row, rowIndex) => {
          return {
            onClick: (event) => {
              history.push({
                pathname: '/teacher-diary-report',
                state: {
                  data: row,
                  selectedSection,
                  diaryType,
                  startDate,
                  endDate,
                },
              });
            },
          };
        }}
      />
    );
  };

  useEffect(() => {
    if (startDate && endDate && diaryType) {
      fetchSubjectwiseReport({
        acad_session_id: selectedBranch?.id,
        dairy_type: diaryType,
        grade_id: selectedSection?.grade_id,
        section_mapping: selectedSection?.section_mapping,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, [startDate, endDate, diaryType]);

  useEffect(() => {
    if (history.location.state) {
      setSelectedSection(history.location.state.data);
      setStartDate(history.location.state.startDate);
      setEndDate(history.location.state.endDate);
      setDiaryType(history.location.state.diaryType);
    }
  }, [window.location.pathname]);

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>SUBJECTS</span>,
      dataIndex: 'subject_name',
      align: 'left',
      width: '30%',
      render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL TEACHERS</span>,
      dataIndex: 'teacher_count',
      align: 'center',
      width: '20%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
    {
      title: (
        <span className='th-white th-fw-700'>
          {tableExpanded ? "TEACHER'S NAME" : null}
        </span>
      ),
      align: 'center',
      width: '30%',
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL ASSIGNED</span>,
      dataIndex: 'dairy_count',
      align: 'center',
      width: '20%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
  ];

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16 th-pointer'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className='th-grey th-16 th-pointer'
              onClick={() =>
                history.push({
                  pathname: '/gradewise-diary-report',
                  state: {
                    startDate,
                    endDate,
                  },
                })
              }
            >
              Diary Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Subjectwise Report
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 mt-3 mt-sm-0 text-right'>
          <div>
            <RangePicker
              disabledDate={(current) => {
                let customDate = moment().format('YYYY-MM-DD');
                return current && current > moment(customDate, 'YYYY-MM-DD');
              }}
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              showToday={false}
              suffixIcon={<DownOutlined />}
              value={[moment(startDate), moment(endDate)]}
              onChange={(value) => handleDateChange(value)}
              className='th-range-picker th-br-4'
              separator={'to'}
              format={'DD/MM/YYYY'}
            />
          </div>
          <div className='th-date-range'>
            <img src={CalendarIcon} />
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-2 col-6 text-capitalize'>
            <span className='th-fw-500'>{selectedSection?.grade_name}</span>
          </div>
          <div className='col-md-2 col-6 text-capitalize'>
            <span className='th-fw-500'>{selectedSection?.section_name}</span>
          </div>
        </div>
        {subjectwiseStats && (
          <div className='row mt-3 th-black-2'>
            <div className='col-md-3'>
              Total No. of Subjects :{' '}
              <span className='th-primary'>{subjectwiseStats?.no_of_subjects}</span>
            </div>
            <div className='col-md-3 pt-2 px-1 pt-md-0'>
              Total No. of Diaries Assigned :{' '}
              <span className='th-primary'>{subjectwiseStats?.dairy_count}</span>
            </div>
          </div>
        )}
        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                `th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
              }
              loading={loading}
              columns={columns}
              expandRowByClick={true}
              rowKey={(record) => record?.subject_id}
              expandable={{ expandedRowRender }}
              dataSource={subjectwiseReport}
              pagination={false}
              expandIconColumnIndex={5}
              expandedRowKeys={expandedRowKeys}
              onExpand={onTableRowExpand}
              expandIcon={({ expanded, onExpand, record }) =>
                expanded ? (
                  <UpOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <DownOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                )
              }
              scroll={{ x: 'max-content', y: 600 }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubjectwiseDiaryReport;
