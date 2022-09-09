/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Layout from 'containers/Layout';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message,Avatar } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import demoPic from 'v2/Assets/images/student_pic.png'


const StaffAttendance = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };

  const getStaffWiseState = (params = {}) => {
    setLoading(true);
    axios
      .get(
        `${endpoints.adminDashboard.staffStats}` , {     
          params : { ...params },
          headers: {
            'X-DTS-Host': X_DTS_HOST,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setAdminData(res?.data?.result);
        if (res.status !== 200) {
          alert.warning('something went wrong please try again ');
          setLoading(true);
        }
      })
      .catch((err) => {
        setLoading(true);
        console.log(err);
      });
  };

  useEffect(() => {
    let selected_branch;
    if(history?.location?.state?.selectedbranchData){
      selected_branch = history?.location?.state?.selectedbranchData
    }
    getStaffWiseState({
        role_id : history?.location?.state?.role?.erp_user__roles_id[0],
        acad_session_id : selected_branch?.acadsession__id.toString(),
        date_range_type : date


    });
  }, [date]);

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>NAME</span>,
      dataIndex: 'erp_user__name',
      width: '20%',
      align: 'left',
      render: (text, row) => (
        <div className='d-flex align-items-center pl-4'>
          <Avatar size={40} src={demoPic} />
          <div className='d-flex flex-column px-2 '>
            <span className='th-black-1 th-16'>{row.erp_user__name}</span>
            <span className='th-grey th-14'>{row.erp_user__erp_id}</span>
          </div>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>PRESENT</span>,
      dataIndex: 'total_present',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ABSENT</span>,
      dataIndex: 'total_absent',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-red th-16'>{data}</span>,
    },
  ];


  return (
    <Layout>
    <div className='row th-16 py-3 px-2'>
      <div className='col-md-8'>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item className='th-black-1 th-pointer' onClick={() => history.goBack()} >Rolewise Attendance</Breadcrumb.Item>
          <Breadcrumb.Item className='th-black-1'>{history?.location?.state?.role?.erp_user__roles__role_name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
        <span className='th-br-4 p-1 th-bg-white'>
          <img src={calendarIcon} className='pl-2' />
          <DatePicker
            disabledDate={(current) => current.isAfter(moment())}
            allowClear={false}
            bordered={false}
            placement='bottomRight'
            defaultValue={moment()}
            onChange={(value) => handleDateChange(value)}
            showToday={false}
            suffixIcon={<DownOutlined className='th-black-1' />}
            className='th-black-2 pl-0 th-date-picker'
            format={'YYYY-MM-DD'}
          />
        </span>
      </div>

      <div className='row mt-3'>
        <div className='col-12'>
          <Table
            className='th-table'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            loading={loading}
            columns={columns}
            rowKey={(record) => record?.id}
            dataSource={adminData}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default withRouter(StaffAttendance);
