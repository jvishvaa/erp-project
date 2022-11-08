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

const TeacherDiaryReport = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const history = useHistory();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [selectedTeacher, setSelectedTeacher] = useState();
  const [diaryType, setDiaryType] = useState();
  const [teacherDiaryStats, setTeacherDiaryStats] = useState();
  const [teacherDiaryData, setTeacherDiaryData] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const fetchTeacherDiaryData = (params = {}) => {
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
          setTeacherDiaryData(res?.data?.result?.data);
          setTeacherDiaryStats(res?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

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

  console.log('history', history.location.state);

  useEffect(() => {
    if (history.location.state) {
      setSelectedSection(history.location.state.selectedSection);
      setSelectedTeacher(history.location.state.data);
      setStartDate(history.location.state.startDate);
      setEndDate(history.location.state.endDate);
      setDiaryType(history.location.state.diaryType);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchTeacherDiaryData({
        session_year: selectedAcademicYear?.id,
        diary_type: diaryType,
        grade_id: selectedSection?.grade_id,
        section_id: selectedSection?.section_id,
        subject_id: selectedTeacher?.subject_id,
        teacher_erp: selectedTeacher?.erp_id,
        start_date: startDate,
        end_date: endDate,
        // till_date: 1,
      });
    }
  }, [diaryType, startDate, endDate]);

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-16' href='/gradewise-diary-report'>
              Diary Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-16' onClick={() => history.goBack()}>
              Subjectwise Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Teacherwise Report
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
              defaultValue={[moment(), moment()]}
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
          <div className='col-2'>
            <span className='th-bg-white'>{selectedSection?.grade_name}</span>
          </div>
          <div className='col-2'>
            <span className='th-bg-white'>{selectedSection?.section_name}</span>
          </div>
          <div className='col-2'>
            <span className='th-bg-white'>{selectedTeacher?.subject__subject_name}</span>
          </div>
        </div>
        {teacherDiaryStats && (
          <div className='row mt-3'>
            <div className='col-md-3 th-black-2'>
              Total No. of Diaries Assigned :{' '}
              <span className='th-primary'>{teacherDiaryStats?.no_of_daires}</span>
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
              rowKey={(record) => record?.grade_id}
              dataSource={teacherDiaryData}
              pagination={false}
              scroll={{ x: 'max-content', y: 600 }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDiaryReport;
