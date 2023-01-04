import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';

const TeacherwiseDiaryReport = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const history = useHistory();
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [teacherwiseReport, setTeacherwiseReport] = useState([]);
  const [teacherwiseStats, setTeacherwiseStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [diaryType, setDiaryType] = useState(null);

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD'));
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
    if (date && selectedSection) {
      fetchTeacherwiseReport({
        acad_session_id: selectedBranch?.id,
        dairy_type: diaryType,
        grade_id: selectedSection?.grade_id,
        section_mapping: selectedSection?.section_mapping,
        date,
      });
    }
  }, [date, diaryType]);

  useEffect(() => {
    if (history.location.state) {
      setSelectedSection(history.location.state.data);
      setDate(history.location.state.date);
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
      title: null,
      align: 'center',
      width: '30%',
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
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16 th-pointer'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className='th-grey th-16 th-pointer'
              onClick={() =>
                history.push({
                  pathname: '/gradewise-diary-report',
                  state: {
                    date,
                    diaryType,
                  },
                })
              }
            >
              General Diary Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Teacher Report</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 mt-3 mt-sm-0 text-right'>
          <DatePicker
            disabledDate={(current) => current.isAfter(moment())}
            allowClear={false}
            value={moment(date)}
            placement='bottomLeft'
            onChange={(event, value) => handleDateChange(value)}
            showToday={false}
            bordered={false}
            suffixIcon={<DownOutlined className='th-black-1' />}
            className='th-black-2 pl-0 th-date-picker th-br-6'
            format={'DD/MM/YYYY'}
          />
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
            </div>
            {teacherwiseStats && (
              <div className='row py-1 th-black-2'>
                <div className='col-md-3 pt-2 pt-md-0 pr-0'>
                  Total No. of Diaries Assigned :{' '}
                  <span className='th-primary'>{teacherwiseStats?.no_of_daires}</span>
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
              rowKey={(record) => record?.subject_id}
              dataSource={teacherwiseReport}
              pagination={false}
              scroll={{ x: teacherwiseReport.length > 0 ? 'max-content' : null, y: 600 }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherwiseDiaryReport;
