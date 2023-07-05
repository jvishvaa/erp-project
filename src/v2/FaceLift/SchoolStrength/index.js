import React, { useState, useEffect, createRef, useContext } from 'react';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Select,
  Divider,
  Button,
  message,
  Pagination,
  Spin,
  Drawer,
  Space,
  Table,
} from 'antd';

import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { RightSquareOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import axiosInstance from 'v2/config/axios';
import FileSaver from 'file-saver';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const { Option } = Select;

const StudentStrength = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const formRef = createRef();
  const [branchList, setBranchList] = useState([]);
  const [selectedAcadYear, setSelectedAcadmeicYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataOverallStat, setFilteredDataOverallStat] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [viewDrawer, setviewDrawer] = useState(false);
  const [data, setData] = useState();
  const [selectedGradeWiseData, setSelecteGradeWiseData] = useState(null);

  const handleCloseViewLevelMore = () => {
    setviewDrawer(false);
    setSelectedSection(null);
    setSelecteGradeWiseData(null);
  };

  useEffect(() => {
    fetchBranchList(selectedAcademicYear?.id);
    setSelectedAcadmeicYear(selectedAcademicYear?.id);
  }, []);

  const fetchAllBranchStrengthExcel = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.studentListApis.downloadExcelAllstudents2}?academic_year_id=${selectedAcadYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }
      )
      .then((res) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'branch-all.xls');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('Something went Wrong!');
      });
  };

  const fetchBranchStrengthExcel = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.studentListApis.downloadBranchWiseStudent2}?academic_year_id=${selectedAcadYear}&branch_id=${selectedBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }
      )
      .then((res) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'branch.xls');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('Something went Wrong!');
      });
  };

  const fetchBranchList = (e) => {
    if (e) {
      axios
        .get(`${endpoints.academics.branches}?session_year=${e}`, {})
        .then((response) => {
          setBranchList(response?.data?.data?.results || []);
        })
        .catch(() => {});
    }
  };

  const fetchSchoolStrengthData = (pageNumber) => {
    if (validateSchoolStrengthData()) {
      setLoading(true);
      axios
        .get(
          `${
            endpoints.studentListApis.branchWiseStudentCount
          }?academic_year_id=${selectedAcadYear}&branch_id=${selectedBranch}&page_number=${
            pageNumber || 1
          }&page_size=${15}`,
          {}
        )
        .then((result) => {
          setLoading(false);
          if (result?.data?.status_code === 200) {
            setTotalPages(result.data?.total_pages);
            setFilteredData(result.data?.data?.grade_wise_data);
            setFilteredDataOverallStat(result?.data?.data?.overall_stat);
          } else {
            message.error(result?.data?.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    }
  };

  const fetchGradeWiseData = (gradeId) => {
    if (validateSchoolStrengthData()) {
      setLoadingDrawer(true);
      setviewDrawer(true);
      axios
        .get(
          `${endpoints.studentListApis.gradeWiseStudentCount}?academic_year_id=${selectedAcadYear}&branch_id=${selectedBranch}&grade_id=${gradeId}`
        )
        .then((result) => {
          setLoadingDrawer(false);
          if (result && result?.data?.status_code === 200) {
            setSelecteGradeWiseData(result && result?.data?.data);
          } else {
            message.error(result?.data?.message);
          }
        })
        .catch((error) => {
          setLoadingDrawer(false);
          message.error(error.message);
        });
    }
  };

  const validateSchoolStrengthData = () => {
    let isFormValid = true;
    if (!selectedBranch) {
      message.error('Please Select Branch');
      isFormValid = false;
    }

    return isFormValid;
  };

  const sectionFilterData = (sectionMapping) => {
    setLoadingDrawer(true);
    axios
      .get(
        !sectionMapping
          ? `${endpoints.studentListApis.gradeWiseStudentCount}?academic_year_id=${selectedAcadYear}&branch_id=${selectedBranch}&grade_id=${gradeId}`
          : `${endpoints.studentListApis.gradeWiseStudentCount}?academic_year_id=${selectedAcadYear}&branch_id=${selectedBranch}&grade_id=${gradeId}&mapping_id=${sectionMapping}`
      )
      .then((result) => {
        setLoadingDrawer(false);
        if (result && result?.data?.status_code === 200) {
          setSelecteGradeWiseData(result && result?.data?.data);
          setviewDrawer(true);
        } else {
          message.error(result?.data?.message);
        }
      })
      .catch((error) => {
        setLoadingDrawer(false);
        message.error(error.message);
      });
  };

  const sectionOption = selectedGradeWiseData?.sections?.map((each) => {
    return (
      <Option key={each.id} value={each.id}>
        {each.section_name}
      </Option>
    );
  });

  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each.branch.id} value={each.branch.id}>
        {each.branch.branch_name}
      </Option>
    );
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>S.No</span>,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (id, record, index) => {
        ++index;
        return index;
      },
      showSorterTooltip: false,
    },
    {
      title: <span className='th-white th-fw-700 '>Name </span>,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text, row) => <p>{row.name ? row.name : <b>NA</b>}</p>,
    },
    {
      title: <span className='th-white th-fw-700 '>Erp No</span>,
      dataIndex: 'erp_id',
      key: 'erp_id',
      align: 'center',
      render: (text, row) => <p>{row.erp_id ? row.erp_id : <b>NA</b>}</p>,
    },
    {
      title: <span className='th-white th-fw-700 '>Status</span>,
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (text, item) => (
        <p>
          {item.is_active && !item.is_delete ? (
            'Active'
          ) : item.is_active || (!item.is_active && item.is_delete) ? (
            <span style={{ color: 'rgb(157, 157, 157)' }}>Deleted</span>
          ) : (
            'In Active'
          )}
        </p>
      ),
    },
  ];
  return (
    <Layout>
      <>
        <div className='row'>
          <div className='col-md-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1'>School Strength</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-md-12 mt-3'>
            <div className='th-bg-white'>
              <div className='row py-3 align-items-center'>
                <div className='col-md-3'>
                  <Select
                    showSearch
                    placeholder='Select Branch*'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    className='w-100 th-black-1 th-bg-grey th-br-4 mt-1'
                    placement='bottomRight'
                    dropdownMatchSelectWidth={false}
                    value={selectedBranch}
                    allowClear={true}
                    onChange={(e) => {
                      setSelectedBranch(e);
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
                <div className='col-md-4'>
                  <Button
                    type='primary'
                    className='th-br-4 th-pointer mr-2'
                    onClick={() => {
                      fetchSchoolStrengthData(page);
                    }}
                  >
                    Filter
                  </Button>
                  <Button
                    type='primary'
                    className='th-br-4 th-pointer'
                    onClick={() => {
                      fetchBranchStrengthExcel();
                    }}
                    disabled={!selectedBranch}
                  >
                    Download Branch Strength
                  </Button>
                </div>

                <div className='offset-md-1 col-md-4 text-right'>
                  <Button
                    className='th-br-4 th-pointer mr-2'
                    onClick={() => {
                      fetchAllBranchStrengthExcel();
                    }}
                  >
                    Download All Branch Strength
                  </Button>
                </div>
              </div>
              <div className='col-12'>
                <Divider className='my-1' />
              </div>

              {loading ? (
                <div
                  className='row justify-content-center align-items-center'
                  style={{ height: '20vh' }}
                >
                  <Spin size='large' />
                </div>
              ) : (
                <>
                  <div className='row'>
                    {filteredDataOverallStat != '' ? (
                      <div className='col-12 mt-2'>
                        <div
                          className='row pt-2 align-items-center th-bg-white th-br-8 th-16 th-grey th-fw-500'
                          style={{ outline: '1px solid #d9d9d9' }}
                        >
                          <div className='col-md-3 col-6 pb-0 pb-sm-2 th-custom-col-padding w-100'>
                            Total Strength:{' '}
                            <span className='th-primary'>
                              {filteredDataOverallStat.total_strength}
                            </span>
                          </div>
                          <div className='col-md-3 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                            Total Active:{' '}
                            <span className='th-green'>
                              {filteredDataOverallStat.total_active}
                            </span>
                          </div>
                          <div className='col-md-3 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                            Temporary Inactive:{' '}
                            <span className='th-yellow'>
                              {filteredDataOverallStat.total_temporary_inactive}
                            </span>
                          </div>
                          <div className='col-md-3 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                            Permanent Inactive:{' '}
                            <span className='th-red'>
                              {filteredDataOverallStat.total_permanent_inactive}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <>
                      {filteredData?.length > 0 ? (
                        filteredData?.map((input, index) => (
                          <div
                            className='col-md-4 mt-4 th-pointer'
                            onClick={(e) => {
                              setGradeId(input.grade);
                              setData(input);
                              fetchGradeWiseData(input.grade);
                            }}
                          >
                            <div className='th-br-6 th-bg-white py-1 shadow-sm mb-2'>
                              <div className='row'>
                                <div className='col-9 mt-2 th-18 th-primary th-fw-600'>
                                  {input.grade_name}
                                </div>
                                <div className='col text-right justify-content-end th-pointer'>
                                  <RightSquareOutlined className='th-primary th-24' />
                                </div>
                              </div>
                              <div className='row mt-2'>
                                <div className='col'>
                                  <div>
                                    Total:{' '}
                                    <span className='th-fw-600'>
                                      {input.student_count}
                                    </span>
                                  </div>
                                </div>
                                <div className='col text-right justify-content-end'>
                                  <div className='th-green'>
                                    Active:{' '}
                                    <span className='th-fw-600'>{input.active}</span>
                                  </div>
                                </div>
                              </div>
                              <div className='row mt-2 mb-2'>
                                <div className='col'>
                                  <div className='th-12'>
                                    Temporary Inactive:{' '}
                                    <span className='th-yellow'>
                                      {input.temporary_inactive}
                                    </span>
                                  </div>
                                </div>
                                <div className='col text-right justify-content-end'>
                                  <div className='th-12'>
                                    Permanent Inactive:{' '}
                                    <span className='th-red'>
                                      {input.permanent_inactive}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
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
                  {filteredData?.length > 0 ? (
                    <div className='text-center py-3'>
                      <Pagination
                        current={page}
                        showSizeChanger={false}
                        onChange={(page) => {
                          setPage(page);
                        }}
                        total={totalPages}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>

        <Drawer
          title={<span className='th-fw-500'>School Strength({data?.grade_name})</span>}
          placement='right'
          onClose={handleCloseViewLevelMore}
          zIndex={1300}
          visible={viewDrawer}
          width={'45vw'}
          closable={false}
          className='th-resources-drawer'
          extra={
            <Space>
              <CloseOutlined onClick={handleCloseViewLevelMore} />
            </Space>
          }
        >
          <div>
            <div className='row'>
              <div className='col-12 px-0 th-bg-white '>
                <div className='row mt-2'>
                  <div className='col'>
                    <div>
                      Total: <span className='th-fw-600'>{data?.student_count}</span>
                    </div>
                  </div>
                  <div className='col text-right justify-content-end'>
                    <div className='th-green'>
                      Active: <span className='th-fw-600'>{data?.active}</span>
                    </div>
                  </div>
                </div>
                <div className='row mt-2 mb-2'>
                  <div className='col'>
                    <div className='th-12'>
                      Temporary Inactive:{' '}
                      <span className='th-yellow'>{data?.temporary_inactive}</span>
                    </div>
                  </div>
                  <div className='col text-right justify-content-end'>
                    <div className='th-12'>
                      Permanent Inactive:{' '}
                      <span className='th-red'>{data?.permanent_inactive}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider className='my-1' />
            <div className='row-12'>
              <div className='col-4 mb-2 float-right'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Section'
                  showSearch
                  value={selectedSection}
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  allowClear={true}
                  onChange={(e) => {
                    setSelectedSection(e);
                    sectionFilterData(e);
                  }}
                  placement='bottomRight'
                  className='w-100 th-black-1 th-bg-grey th-br-4 mt-1'
                  bordered={true}
                >
                  {sectionOption}
                </Select>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-md-12'>
                <>
                  {selectedGradeWiseData?.students?.length !== 0 ? (
                    <Table
                      className='th-table'
                      rowClassName={(record, index) =>
                        `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                      }
                      pagination={false}
                      scroll={{ x: true }}
                      loading={loadingDrawer}
                      columns={columns}
                      dataSource={selectedGradeWiseData?.students}
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
          </div>
        </Drawer>
      </>
    </Layout>
  );
};

export default StudentStrength;
