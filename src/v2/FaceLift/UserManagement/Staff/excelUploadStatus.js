import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Pagination, Select, Table, Tag, message } from 'antd';
import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchBranchesForCreateUser } from 'redux/actions';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const ExcelUploadStatus = () => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const { Option } = Select;
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(15);
  const history = useHistory();

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [moduleId, selectedYear]);

  const fetchBranches = () => {
    if (selectedYear) {
      fetchBranchesForCreateUser(selectedYear?.id, moduleId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
          acadId: obj.acadId,
        }));
        setBranches(transformedData);
      });
    }
  };

  const branchListOptions = branches?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each.id}
        branch_code={each?.branch_code}
        acadId={each?.acadId}
      >
        {each?.branch_name}
      </Option>
    );
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Date - Time</span>,
      dataIndex: 'created_at',
      render: (data) => (
        <span className='th-black-1 th-14'>
          {moment(data).format('YYYY-MM-DD - hh:mm')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Success Count</span>,
      dataIndex: 'success_count',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Failure Count</span>,
      dataIndex: 'failure_count',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Uploaded Excel</span>,
      dataIndex: 'user_file',
      render: (data) => (
        <span className='th-black-1 th-14'>
          <a href={data} target='_blank'>
            <Tag
              icon={<DownloadOutlined />}
              className='th-br-6 th-bg-primary th-white'
              style={{ cursor: 'pointer' }}
            >
              Download
            </Tag>
          </a>
        </span>
      ),
    },
  ];

  const handleUserBranch = (e, data) => {
    setPageNo(1);
    setSelectedBranch(e);
    if (e != undefined) {
      let params = `${endpoints.nonAcademicStaff.bulkUpload}?page=${1}&page_size=${pageLimit}`;
      if (selectedYear) params += `&academic_year=${selectedYear?.id}`;
      if (e) params += `&branch=${e}`;
      getUploadStatus(params);
    } else {
      setStatusData([]);
    }
  };

  const getUploadStatus = (url) => {
    setLoading(true);
    axiosInstance
      .get(url)
      .then((res) => {
        if (res?.status === 200) {
          setTotalPage(res?.data?.result?.count);
          setStatusData(res?.data?.result?.results);
          setLoading(false);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error);
      });
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3 px-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href='/user-management/non-academic-staff'
                className='th-grey th-16'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Bulk Upload Status
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* <div className='bg-white th-br-8 mx-3 py-3'> */}
        <div className='row my-3 px-3'>
          <div className='col-md-3'>
            <Select
              allowClear={true}
              className='th-grey th-bg-white  w-100 text-left'
              placement='bottomRight'
              showArrow={true}
              onChange={(e, value) => handleUserBranch(e, value)}
              dropdownMatchSelectWidth={false}
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              showSearch
              getPopupContainer={(trigger) => trigger.parentNode}
              placeholder='Select Branch'
            >
              {branchListOptions}
            </Select>
          </div>
          {/* <div className='col-md-6'></div>
          <div className='col-md-3'>
            <Button
              onClick={() => history.push(`/user-management/create-non-academic-staff`)}
              className='btn-block th-br-4'
              type='primary'
              icon={<PlusCircleOutlined style={{ color: '#fffff' }} />}
            >
              Create Staff
            </Button>
          </div> */}
          <div className='col-md-12 mt-2 academic-staff'>
            <Table
              className='th-table mt-3'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={statusData}
              pagination={false}
              scroll={{
                x: window.innerWidth < 600 ? 'max-content' : null,
                y: 'calc(300px)',
              }}
            />

            {statusData?.length > 0 && (
              <div className='pt-3 '>
                <Pagination
                  current={pageNo}
                  total={totalPage}
                  showSizeChanger={false}
                  pageSize={pageLimit}
                  onChange={(current) => {
                    let params = `${endpoints.nonAcademicStaff.bulkUpload}?page=${current}&page_size=${pageLimit}`;
                    if (selectedYear) params += `&academic_year=${selectedYear?.id}`;
                    if (selectedBranch) params += `&branch=${selectedBranch}`;
                    setPageNo(current);
                    getUploadStatus(params);
                  }}
                  className='text-center'
                />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default ExcelUploadStatus;
