import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, Select, Button, message, Table, Spin } from 'antd';

import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { RedoOutlined } from '@ant-design/icons';
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
  const selectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);
  const formRef = createRef();
  const [loading, setLoading] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [filterData, setFilterData] = useState([]);
  const [tableColumn, setTableColumn] = useState([]);

  useEffect(() => {
    setTableColumn([]);
    getStudentCountReportData(selectedAcademicYear?.id, selectedBranch?.branch?.id);
  }, []);

  const getStudentCountReportData = (acadYear, branch) => {
    if (acadYear !== undefined && branch !== undefined) setLoading(true);
    axios
      .get(
        `${endpoints.academics.getStudentCountReportData}?session_year=${
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
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
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
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Student Count Report
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-12 mt-3'>
          <div className='row th-bg-white p-2'>
            <div className='row py-3'>
              <div className='col-12 text-right'>
                <span>
                  <span
                    className='p-sm-3 p-3 th-22'
                    onClick={() =>
                      getStudentCountReportData(
                        selectedAcademicYear?.id,
                        selectedBranch?.branch?.id
                      )
                    }
                  >
                    <RedoOutlined className='th-primary' />
                  </span>
                  <Button
                    className='th-br-4 mr-md-3 th-pointer'
                    onClick={() => exportTo(filterData, 'StudentCountData')}
                    disabled={!selectedBranch?.branch?.id}
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
                    {filterData?.length > 0 ? (
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
