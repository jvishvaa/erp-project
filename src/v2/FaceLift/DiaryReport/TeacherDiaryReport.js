import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';

const { RangePicker } = DatePicker;

const TeacherDiaryReport = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
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
    setTeacherDiaryData([]);
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

  useEffect(() => {
    if (history.location.state) {
      setSelectedSection(history.location.state.selectedSection);
      setSelectedTeacher(history.location.state.data);
      setStartDate(history.location.state.startDate);
      setEndDate(history.location.state.endDate);
      setDiaryType(history.location.state.diaryType);
    }
  }, []);
  useEffect(() => {
    if (startDate && endDate && diaryType) {
      fetchTeacherDiaryData({
        acad_session_id: selectedBranch?.id,
        diary_type: diaryType,
        grade_id: selectedSection?.grade_id,
        section_mapping: selectedSection?.section_mapping,
        subject_id: selectedTeacher?.subject_id,
        teacher_id: selectedTeacher?.user_id,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, [diaryType, startDate, endDate]);

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
            <Breadcrumb.Item
              className='th-grey th-16 th-pointer'
              onClick={() =>
                history.push({
                  pathname: '/subjectwise-diary-report',
                  state: {
                    diaryType,
                    data: selectedSection,
                    startDate,
                    endDate,
                  },
                })
              }
            >
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
        {!loading && (
          <div
            className='row mt-3 mx-3 th-bg-white th-br-10'
            style={{ border: '1px solid #d9d9d9' }}
          >
            <div className='row py-2'>
              <div className='col-3 text-capitalize th-fw-500 th-grey'>
                Grade :{' '}
                <span className='th-primary'>
                  {selectedSection?.grade_name},{selectedSection?.section_name}
                </span>
              </div>
              <div className='col-3 text-capitalize th-fw-500 th-grey pl-1'>
                Subject :{' '}
                <span className='th-primary'>{selectedTeacher?.subject_name}</span>
              </div>
            </div>
            {teacherDiaryStats && (
              <div className='row py-1'>
                <div className='col-md-3 th-grey'>
                  Total No. of Diaries Assigned :{' '}
                  <span className='th-primary'>{teacherDiaryStats?.no_of_daires}</span>
                </div>
              </div>
            )}
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
