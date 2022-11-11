import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message, Select } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TeacherwiseDiaryReport = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const history = useHistory();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [teacherwiseReport, setTeacherwiseReport] = useState([]);
  const [teacherwiseStats, setTeacherwiseStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [diaryType, setDiaryType] = useState(null);

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const fetchTeacherwiseReport = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.diaryReport.teacherReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setTeacherwiseReport(res?.data?.result?.data);
          setTeacherwiseStats(res?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchTeacherwiseReport({
        session_year: selectedAcademicYear?.id,
        diaryType,
        grade_id: selectedSection?.grade_id,
        section_id: selectedSection?.section_id,
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
      title: <span className='th-white pl-4 th-fw-700 '>TEACHER'S NAME</span>,
      dataIndex: 'created_by__erpusers__name',
      align: 'left',
      width: '40%',
      render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ASSIGNED DATE</span>,
      dataIndex: 'date',
      align: 'center',
      width: '30%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ASSIGNED TIME</span>,
      dataIndex: 'created_at__time',
      align: 'center',
      width: '30%',
      render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
    },
  ];

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-16' href='/gradewise-diary-report'>
              General Diary Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Teacher Report</Breadcrumb.Item>
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
            {selectedSection?.grade_name}
          </div>
          <div className='col-md-2 col-6 text-capitalize'>
            {selectedSection?.section_name}
          </div>
        </div>
        {teacherwiseStats && (
          <div className='row mt-3 th-black-2'>
            <div className='col-md-3 pt-2 pt-md-0'>
              Total No. of Diaries Assigned :{' '}
              <span className='th-primary'>{teacherwiseStats?.no_of_daires}</span>
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
              rowKey={(record) => record?.subject_id}
              dataSource={teacherwiseReport}
              pagination={false}
              scroll={{ x: 'max-content', y: 600 }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherwiseDiaryReport;
