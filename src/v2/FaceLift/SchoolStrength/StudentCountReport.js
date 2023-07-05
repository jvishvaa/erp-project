import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Select, Button, message, Table, Spin } from 'antd';

import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { Option } = Select;

const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const StudentCountReport = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const formRef = createRef();
  const [branchList, setBranchList] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [filterData, setFilterData] = useState([]);
  const [tableColumn, setTableColumn] = useState([]);

  useEffect(() => {
    setBranchId(null);
    setFilterData([]);
    setTableColumn([]);
    fetchBranchList(selectedAcademicYear?.id);
  }, []);

  const filterDataValidate = () => {
    if (!branchId) {
      message.error('Please Select Branch');
      return;
    } else {
      getStudentCountReportData(selectedAcademicYear?.id, branchId);
    }
  };

  const getStudentCountReportData = (acadYear, branch) => {
    if (acadYear !== undefined && branch !== undefined)
      axios
        .get(
          `${endpoints.academics.getStudentCountReportDataV2}?session_year=${
            acadYear !== undefined ? acadYear : ''
          }&branch_id=${branch !== undefined ? branch : ''}`
        )
        .then((res) => {
          const list = res.data || [];
          const firstObject = list[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              title: <span className='th-white th-fw-700 text-capitalize'> {key} </span>,
              dataIndex: key,
              align: 'center',
              render: (text, row) => <p>{text}</p>,
            };
            cols.push(col);
          }
          setTableColumn(cols);
          setFilterData(res.data);
        })
        .catch((err) => {});
  };

  const branchOptions = branchList?.map((item) => {
    return (
      <Option key={item.branch.id} value={item.branch.id}>
        {item.branch.branch_name}
      </Option>
    );
  });

  const fetchBranchList = (e) => {
    if (e) {
      setLoading(true);
      axios
        .get(`${endpoints.academics.branches}?session_year=${e}`, {})
        .then((response) => {
          setBranchList(response?.data?.data?.results || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const fileExtension = '.xlsx';
  const exportTo = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data.slice(1));
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataX = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataX, fileName + fileExtension);
  };

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey'>
              Student Count Report
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className='col-md-12 mt-3'>
          <div className='row th-bg-white p-2'>
            <div className='row py-4'>
              <div className='col-md-3'>
                <span className='th-grey th-14'>Branch*</span>
                <Select
                  showSearch
                  placeholder='Select Branch'
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className='w-100 th-black-1 th-bg-grey th-br-4 mt-1'
                  placement='bottomRight'
                  suffixIcon={<DownOutlined className='th-grey' />}
                  dropdownMatchSelectWidth={false}
                  value={branchId}
                  allowClear={true}
                  onChange={(e) => {
                    setBranchId(e);
                  }}
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {branchOptions}
                </Select>
              </div>
              <div className='col-md-6 py-4'>
                <span>
                  <Button
                    type='primary'
                    className='th-br-4 mr-md-3 th-pointer'
                    onClick={filterDataValidate}
                  >
                    Filter
                  </Button>
                  <Button
                    className='th-br-4 mr-md-3 th-pointer'
                    onClick={() => exportTo(filterData, 'StudentCountData')}
                    disabled={!branchId}
                  >
                    Download Report
                  </Button>
                </span>
              </div>
            </div>
            {loading ? (
              <div
                className='row justify-content-center align-items-center'
                style={{ height: '20vh' }}
              >
                <Spin size='large' />
              </div>
            ) : (
              <div className='row'>
                <div className='col-md-12'>
                  <>
                    {filterData?.length !== 0 ? (
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                        }
                        pagination={false}
                        scroll={{ y: '50vh' }}
                        loading={loading}
                        columns={tableColumn}
                        dataSource={filterData.slice(1)}
                      />
                    ) : (
                      <div
                        className='row justify-content-center align-item-center mt-5'
                        style={{ height: '47 vh' }}
                      >
                        <img src={NoDataIcon} />
                      </div>
                    )}
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentCountReport;
