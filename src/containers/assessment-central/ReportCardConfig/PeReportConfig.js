import {
  Button,
  Form,
  Modal,
  Pagination,
  Popconfirm,
  Result,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import {
  CloseCircleOutlined,
  DownOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const PeReportConfig = () => {
  const history = useHistory();
  const { Option } = Select;
  const formRef = useRef();
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [detailsModal, setDetailsModal] = useState(false);
  const [activityDetails, setActivityDetails] = useState();
  const [showFilterPage, setShowFilterPage] = useState(true);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Terms</span>,
      dataIndex: 'semesters',
      width: '30%',
      render: (data) => (
        <span className='th-black-1 th-14 text-break'>{data?.semester_name}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Grades</span>,
      dataIndex: 'grade_name',
      width: '30%',
      render: (data) => <span className='th-black-1 th-14 text-break'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      width: '40%',
      render: (data) => {
        return (
          <Space>
            <Tag
              icon={<InfoCircleOutlined />}
              color='processing'
              onClick={() => openDetailsModal(data)}
              style={{ cursor: 'pointer' }}
            >
              Details
            </Tag>
            {/* <Tag
              icon={<EditOutlined />}
              color='processing'
              onClick={() => handleEdit(data, data?.id)}
              style={{ cursor: 'pointer' }}
            >
              Edit
            </Tag> */}

            <Popconfirm
              title='Sure to delete?'
              onConfirm={(e) => handleDeleteConfig(data.id)}
            >
              <Tag
                icon={<CloseCircleOutlined />}
                color='error'
                style={{ cursor: 'pointer' }}
              >
                Delete
              </Tag>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const detailsColumns = [
    {
      title: <span className='th-white th-fw-700 '>Activity </span>,
      dataIndex: 'name',
      width: '30%',
      render: (data) => <span className='th-black-1 th-14 text-break'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Criteria Title</span>,
      dataIndex: 'criteria_title',
      width: '30%',
      render: (data) => <span className='th-black-1 th-14 text-break'>{data}</span>,
    },
  ];

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Report Card Config') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
  }, [moduleId, selectedYear]);

  const fetchBranches = async () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code == 200) {
          // const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(res?.data?.data?.results);
        } else {
          message.error(res?.data?.message);
        }
      });
  };

  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${branch}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetchPeReportCardConfig = (branch_ids, grade_id, page) => {
    if (!selectedBranch) {
      message.error('Please Select branch');
      return;
    }
    if (!selectedGrade) {
      message.error('Please Select grade');
      return;
    }
    setLoading(true);
    setShowFilterPage(false);
    let params = {
      grade_id: grade_id?.value,
      branch_ids,
      academic_year_id: selectedYear?.id,
      page,
      page_size: pageLimit,
    };
    axiosInstance
      .get(`${endpoints.peReportCardConfig.reportConfig}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res?.data?.status == 200) {
          setReportData(res?.data?.data);
          setTotalPage(res?.data?.count);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteConfig = async (id) => {
    try {
      const deleteConfig = await axiosInstance.delete(
        `${endpoints.peReportCardConfig.deleteConfig}${id}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (deleteConfig.status === 200) {
        fetchPeReportCardConfig(selectedBranch, selectedGrade, 1);
        message.success(deleteConfig.data.message);
      } else {
        message.error(deleteConfig.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const branchListOptions = branchList?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleChangeBranch = (each) => {
    if (each.length > 0) {
      if (each.some((item) => item === 'all')) {
        const allBranch = branchList.map((item) => item?.branch?.id);
        setSelectedBranch(...allBranch);
        fetchGrade(allBranch);
        formRef.current.setFieldsValue({
          branch: branchList.map((item) => item?.branch?.id),
          grade: null,
        });
      } else {
        const singleBranch = each.map((item) => item).join(',');
        setSelectedBranch(singleBranch);
        fetchGrade(singleBranch);
        formRef.current.setFieldsValue({
          grade: null,
        });
      }
    } else {
      setSelectedBranch([]);
      setSelectedGrade(null);
      setGradeList([]);
    }
  };

  const handleClearBranch = () => {
    setSelectedBranch([]);
  };

  const handleChangeGrade = (e) => {
    if (e) {
      setSelectedGrade(e);
    } else {
      formRef.current.setFieldsValue({
        grade: null,
      });
    }
  };

  const handleClearFilter = () => {
    // setBranchList([]);
    setGradeList([]);
    setSelectedBranch(null);
    setSelectedGrade(null);
    setReportData([]);
    setShowFilterPage(true);
    formRef.current.resetFields();
  };

  const handleCreate = () => {
    history.push('/pe-report-config/create');
  };

  const openDetailsModal = (data) => {
    const extractedData = [];
    const filteredData = data?.mappings?.forEach((item) => {
      item.activities.forEach((activity) => {
        activity.activity_criterias.forEach((criteria) => {
          extractedData.push({
            name: activity.name,
            criteria_title: criteria.title,
          });
        });
      });
    });
    setActivityDetails(extractedData);
    setDetailsModal(true);
  };

  const handleCloaseDetailsModal = (data) => {
    setActivityDetails([]);
    setDetailsModal(false);
  };

  const handleEdit = (data, id) => {
    history.push({
      pathname: `/pe-report-config/edit/${id}`,
      state: { isEdit: true, data },
    });
  };

  return (
    <React.Fragment>
      <div className='row mb-3'>
        <div className='col-md-12 px-0'>
          <Form id='filterForm' className='mt-1' layout={'vertical'} ref={formRef}>
            <div className='row'>
              <div className='col-md-3 col-sm-6 col-12'>
                <Form.Item name='branch'>
                  <Select
                    allowClear={true}
                    className='th-grey th-bg-white  w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleChangeBranch(e, value)}
                    onClear={handleClearBranch}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Select Branch*'
                    mode='multiple'
                  >
                    {branchList.length > 1 && (
                      <>
                        <Option key={0} value={'all'}>
                          Select All
                        </Option>
                      </>
                    )}
                    {branchListOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-3 col-sm-6 col-12'>
                <Form.Item name='grade'>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    maxTagCount={1}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleChangeGrade(value)}
                    // onClear={handleClearGrade}
                    dropdownMatchSelectWidth={true}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select Grade'
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-3 col-sm-6 col-12 text-right'>
                <div className='row no-gutters'>
                  <div className='col-md-6 col-sm-6 col-6 pr-2'>
                    <Button
                      type='primary'
                      className='btn-block th-br-4'
                      onClick={() =>
                        fetchPeReportCardConfig(selectedBranch, selectedGrade, 1)
                      }
                    >
                      Filter
                    </Button>
                  </div>
                  <div className='col-md-6 col-sm-6 col-6 pl-20'>
                    <Button
                      type='secondary'
                      className='btn-block mt-0 th-br-4'
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              <div className='col-md-3 col-sm-6 col-12 text-right'>
                <Button
                  type='primary'
                  className='btn-block th-br-4'
                  onClick={handleCreate}
                >
                  <PlusCircleOutlined /> Create
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {!showFilterPage ? (
          <div className='col-md-12'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={columns}
              // rowKey={(record) => record?.user_id}
              dataSource={reportData}
              pagination={false}
              scroll={{ y: '300px' }}
            />

            {reportData?.length > 0 && (
              <div className='pt-3 '>
                <Pagination
                  current={pageNo}
                  total={totalPage}
                  showSizeChanger={false}
                  pageSize={pageLimit}
                  onChange={(current) => {
                    setPageNo(current);
                    fetchPeReportCardConfig(selectedBranch, selectedGrade, current);
                  }}
                  className='text-center'
                />
              </div>
            )}
          </div>
        ) : (
          <div className='col-12'>
            <Result
              status='warning'
              title={<span className='th-grey'>Please apply filter to view data</span>}
            />
          </div>
        )}
        {/* INFO MODAL */}

        <Modal
          centered
          open={detailsModal}
          visible={detailsModal}
          width={'50%'}
          onCancel={handleCloaseDetailsModal}
          footer={[
            <Button key='back' onClick={handleCloaseDetailsModal}>
              Close
            </Button>,
          ]}
        >
          <div className='th-g-white p-3'>
            <h6>Activities Details</h6>
            <p className='text-right'></p>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              columns={detailsColumns}
              rowKey={(record) => record?.id}
              dataSource={activityDetails}
              pagination={false}
              scroll={{
                x: window.innerWidth < 600 ? 'max-content' : null,
                y: 'calc(60vh - 220px)',
              }}
            />
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default PeReportConfig;
