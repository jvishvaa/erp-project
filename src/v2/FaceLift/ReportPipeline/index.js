import React, { useEffect, useState } from 'react';
import { message, Table, Breadcrumb, Button, DatePicker } from 'antd';
import Layout from 'containers/Layout';
import axios from 'axios';
import endpoints from 'config/endpoints';
import moment from 'moment';

const ReportPipeline = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const schoolName = ['dev', 'qa', 'test', 'localhost:3000']?.includes(
    window?.location?.host?.split('.')[0]
  )
    ? 'olvorchidnaigaon'
    : window?.location?.host?.split('.')[0];

  useEffect(
    () =>
      fetchReportStatus({
        school_name: schoolName,
        erp_id: userDetails?.erp,
        current_date: moment().format('YYYY-MM-DD'),
      }),
    []
  );

  const fetchReportStatus = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints?.reportPipeline?.viewReportPipeline}`, {
        params: { ...params },
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setReportData(result?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => setLoading(false));
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Report Name</span>,
      dataIndex: 'report_name',
      key: 'report_name',
      align: 'center',
      //   width: '25%',
      render: (data) => (
        <span class='text-capitalize th-black-2'>{data.split('_').join(' ')}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Date</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      //   width: '25%',
      render: (data) => (
        <span className='th-black-2'>{moment(data).format('DD-MM-YYYY')}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Time</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      //   width: '25%',
      render: (data) => (
        <span className='th-black-2'>{moment(data).format('hh:mm a')}</span>
      ),
    },

    {
      title: <span className='th-white th-fw-700 '>Requested By</span>,
      dataIndex: 'requested_by',
      key: 'requested_by',
      align: 'center',
      //   width: '25%',
      render: (data) => <span className='th-black-2'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Report Link</span>,
      key: 's3_path',
      align: 'center',
      //   width: '25%',
      render: (data) => (
        <span className='th-black-2'>
          {data?.is_published ? (
            <Button
              type='primary'
              href={data?.s3_path}
              target='_blank'
              className='th-br-4'
            >
              Download Report
            </Button>
          ) : (
            'Report is being published.'
          )}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className='row th-16 px-1'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Report</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-12 mt-3'>
          <div className='p-2 bg-white'>
            <div className='d-flex justify-content-end'>
              <div className='col-md-2 col-12 mb-2 p-0 mr-1'>
                <DatePicker
                  className='w-100 th-black-2 pl-0 th-date-picker th-pointer'
                  allowClear={false}
                  defaultValue={moment()}
                  format={'DD-MM-YYYY'}
                  disabledDate={(current) => {
                    return current && current > moment().endOf('day');
                  }}
                  onChange={(e) => {
                    fetchReportStatus({
                      school_name: schoolName,
                      erp_id: userDetails?.erp,
                      current_date: moment(e).format('YYYY-MM-DD'),
                    });
                  }}
                />
              </div>
            </div>
            <Table
              className='th-table '
              columns={columns}
              dataSource={reportData}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPipeline;
