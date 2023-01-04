import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const RoleWiseAttendance = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const history = useHistory();
  const [date, setDate] = useState(history?.location?.state?.date);
  const [rolewiseAttendanceData, setRolewiseAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };

  const fetchRolewiseAttendanceData = (params = {}) => {
    setLoading(true);
    axios
    .get(
      `${endpoints.adminDashboard.staffRoleStates}`,{
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      }
    )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setRolewiseAttendanceData(response?.data?.result);
          // setAttendanceCountData(response?.data?.result);
          setLoading(false);
        } else {
          setLoading(false);
          setRolewiseAttendanceData([]);
          // setAttendanceCountData([]);
        }
      })
      .catch((error) => {
        message.error(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    let selected_branch;
    if(history?.location?.state?.selectedbranchData){
      selected_branch = history?.location?.state?.selectedbranchData
    }
    fetchRolewiseAttendanceData({
      acad_session_id: selected_branch?.acadsession__id || selectedBranch?.id,
      date_range_type: date,
    });
  }, [date]);

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>ROLE</span>,
      dataIndex: 'erp_user__roles__role_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'total_people',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>MARKED</span>,
      // dataIndex: 'total_marked',
      width: '15%',
      align: 'center',
      render: (text, row) => <span className='th-green th-16'>{row?.total_absent + row?.total_present}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>UNMARKED</span>,
      // dataIndex: 'total_unmarked',
      width: '15%',
      align: 'center',
      render: (text, row) => <span className='th-green th-16'>{row?.total_people - (row?.total_absent + row?.total_present)}</span>,
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
    {
      // title: 'icon',
      align: 'center',
      width: '5%',
      key: 'icon',
      render: (text, row) => (
        <span
          onClick={() =>{
            if(row?.erp_user__roles__role_name === 'Student'){
              history.push({
                pathname : './gradewise-attendance',
                state : {
                  selectedbranchData : history?.location?.state?.selectedbranchData || selectedBranch,
                }
              })
            }else{
              history.push({
                pathname : './Staff-attendance',
                state : {
                  selectedbranchData : history?.location?.state?.selectedbranchData || selectedBranch,
                  role : row
                }
              })
            }   
          }
        }
        >
          <RightOutlined className='th-grey th-pointer' />
        </span>
      ),
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
            <Breadcrumb.Item onClick={() => history.goBack()} className='th-grey th-pointer'>
            Branchwise Attendance
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Rolewise Attendance</Breadcrumb.Item>
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
              value={moment(date)}
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
                index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.grade_id}
              dataSource={rolewiseAttendanceData}
              pagination={false}
              scroll={{ x: 'max-content' }}
              onRow={(row, rowindex) => {
                return {
      
                  onClick: (e) =>
                    {row?.erp_user__roles__role_name === 'Student' ? 
                    history.push({
                      pathname : './gradewise-attendance',
                      state : {
                        selectedbranchData : history?.location?.state?.selectedbranchData || selectedBranch,
                        date: date
                      }
                    }) : 
                    history.push({
                      pathname : './Staff-attendance',
                      state : {
                        selectedbranchData : history?.location?.state?.selectedbranchData || selectedBranch,
                        role : row,
                        date: date
                      }
                    }) }
                }
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleWiseAttendance;
