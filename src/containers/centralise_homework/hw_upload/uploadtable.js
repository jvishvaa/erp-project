import React, { useState, useRef, useEffect } from 'react';
import {
  message,
  Form,
  Tabs,
  Select,
  Modal,
  Input,
  Table,
  Button,
  Pagination,
} from 'antd';
import '../BranchStaffSide/branchside.scss';
import { useHistory } from 'react-router-dom';
import QuestionPng from 'assets/images/question.png';
import {
  EditOutlined,
  EyeFilled,
  DownOutlined,
  InfoCircleTwoTone,
} from '@ant-design/icons';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import endpoints from 'config/endpoints';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';
import Loader from 'components/loader/loader';
import axios from 'axios';
import { fetchErpList } from 'containers/Finance/src/components/Finance/store/actions';

const UploadTable = ({
  startDate,
  endDate,
  subejctId,
  sectionId,
  sectionMappingId,
  sectionName,
}) => {
  const history = useHistory();
  const { TabPane } = Tabs;
  const { Option } = Select;
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [showTab, setShowTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [erpNumber, setErpNumber] = useState('');

  const [erpUpdateModal, setErpUpdateModal] = useState(false);
  const [erpUpdateModalData, setErpUpdateModalData] = useState();
  const [imagePrevModal, setImagePrevModal] = useState(false);
  const [imagePrev, setImagePrev] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [erpList, setErpList] = useState([]);
  const [erp, setErp] = useState('');
  const [updatedErp, setUpdatedErp] = useState('');
  const [count, setCount] = useState(0);

  const [refferListPageData, setRefferListPageData] = useState({
    currentPage: 1,
    pageSize: 15,
    totalCount: 0,
    totalPage: 0,
  });

  const [hwFiles, setHwFiles] = useState([]);

  useEffect(() => {
    fetchGrade();

    if (
      startDate &&
      endDate &&
      subejctId.length !== 0 &&
      startDate !== 'Invalid date' &&
      endDate !== 'Invalid date' &&
      showTab
    ) {
      const status = showTab == 1 ? 'True' : 'False';
      fecthHwData(startDate, endDate, subejctId, status);
      fecthErp(sectionId);
    } else {
      setHwFiles([]);
    }
  }, [
    startDate,
    endDate,
    subejctId,
    showTab,
    section,
    grade,
    refferListPageData.currentPage,
  ]);

  const handleErp = (e, data, row) => {
    setErpNumber(e);
  };

  const handleUpdateErp = (row) => {
    if (row) {
      setErp(row?.id);
    }
  };

  const handleCurrentErp = (value) => {
    if (value) {
      setUpdatedErp(value?.value);
    }
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>S.No</span>,
      dataIndex: 'user',
      align: 'center',
      width: '10%',
      render: (data, row, index) => <span className='th-black-1 th-14'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Name</span>,
      dataIndex: 'doc_type_name',
      align: 'center',
      width: '15%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'student_erp',
      align: 'center',
      width: '15%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Section</span>,
      dataIndex: 'sec',
      align: 'center',
      width: '10%',
      render: (data) => <span className='th-black-1 th-14'>{sectionName}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>File Location</span>,
      dataIndex: 'file_location',
      align: 'center',
      width: '30%',
      render: (data) => (
        <div className='col-md-12 pl-0 col-12 d-flex justify-content-center align-items-center'>
          <div className='text-truncate' title={`${data}`}>
            {data}
          </div>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      dataIndex: 'file_location',
      align: 'center',
      width: '20%',
      render: (data) => (
        <div className='col-md-12 pl-0 col-12 d-flex justify-content-center align-items-center'>
          <a
            onClick={() => {
              const fileName = data;
              const fileSrc = `${endpoints.assessment.erpBucket}/${fileName}`;
              //   // const fileSrc = data;
              //   openPreview({
              //     currentAttachmentIndex: 0,
              //     attachmentsArray: [
              //       {
              //         src: fileSrc,
              //         name: 'Portion Document',
              //         extension:
              //           '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
              //       },
              //     ],
              //   });
              // }}
              handleImagePrev(fileSrc);
            }}
          >
            <div className=' pl-0 th-primary '>
              <EyeFilled />
            </div>
          </a>
        </div>
      ),
    },
    // {
    //   title: <span className='th-white th-fw-700'>Status</span>,
    //   dataIndex: 'status',
    //   align: 'center',
    //   width: '15%',
    //   render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    // },
  ];

  const columnsFailed = [
    {
      title: <span className='th-white th-fw-700 '>S.No</span>,
      dataIndex: 'user',
      width: '10%',
      align: 'center',
      render: (data, row, index) => <span className='th-black-1 th-14'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>File</span>,
      dataIndex: 'file_location',
      align: 'center',
      width: '50%',
      render: (data) => (
        <div className='col-md-12 pl-0 col-12 d-flex justify-content-center align-items-center'>
          <div className='col-10  text-truncate' title={`${data}`}>
            {data}
          </div>
          <div className='col-2'>
            <a
              onClick={() => {
                const fileName = data;
                //   const fileSrc = `${endpoints.lessonPlan.bucket}/${fileName}`;
                const fileSrc = `${endpoints.assessment.erpBucket}/${fileName}`;
                // openPreview({
                //   currentAttachmentIndex: 0,
                //   attachmentsArray: [
                //     {
                //       src: fileSrc,
                //       name: 'Portion Document',
                //       extension:
                //         '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
                //     },
                //   ],
                // });
                handleImagePrev(fileSrc);
              }}
            >
              <div className=' pl-0 col-12 th-primary '>
                <EyeFilled />
              </div>
            </a>
          </div>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP No</span>,
      dataIndex: 'student_erp',
      align: 'center',
      width: '40%',
      render: (data, row, index) => (
        <div className='col-md-12 d-flex justify-content-center'>
          <div
            className='col-sm-6 col-md-12'
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <Form.Item name='erp' style={{ width: '50%' }}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                maxTagCount={1}
                allowClear={true}
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 text-left th-select'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleCurrentErp(value)}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return (
                    options.children
                      ?.join()
                      .trim()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                value={updatedErp}
                showSearch
                placeholder='Select Erp'
              >
                {ErpOptions}
              </Select>
            </Form.Item>
            {!loading ? (
              <Button
                className='th-br-4'
                type='primary'
                onClick={() => {
                  saveErp(row?.file_location, row?.id);
                }}
              >
                Save
              </Button>
            ) : (
              ''
            )}
          </div>
          {/* <div>
              <input
                type='text'
                placeholder='Erp No.'
                className='form-control'
                onChange={(e) => handleErp(e.target.value, data, row)}
                disabled
              />
            </div>
            <div className='ml-2 th-20 th-primary'>
              <EditOutlined
                onClick={() => {
                  setErpUpdateModal(true);
                  handleUpdateErp(row);
                }}
              />
            </div> */}
          {/* <div className='col-md-4'>
            <Button className='w-100 th-br-4' type='primary'>
              Save
            </Button>
          </div> */}
        </div>
      ),
    },
  ];

  const onChange = (key) => {
    setShowTab(key);
    if (key === '2') {
      setRefferListPageData({
        ...refferListPageData,
        currentPage: 1,
      });
    }
  };

  const fetchGrade = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear?.id}&branch_id=${selectedBranch?.branch?.id}`
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

  const fetchSection = async (grade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
      );
      if (result.data.status_code === 200) {
        setSectionList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fecthHwData = async (start, end, sec, status) => {
    setLoading(true);
    try {
      const result = await axiosInstance.get(
        `${endpoints.homework.hwData}?start_date=${start}&end_date=${end}&sub_sec_mpng=${sec}&status=${status}&page=${refferListPageData.currentPage}`
      );
      if (result.data.status_code === 200) {
        setRefferListPageData({
          ...refferListPageData,
          totalCount: result?.data?.result?.count,
          totalPage: Math.ceil(result?.data?.result?.count / refferListPageData.pageSize),
        });
        setCount(result?.data?.result?.count);
        setHwFiles(result?.data?.result?.results);
        setLoading(false);
      } else {
        message.error(result.data.message);
        setLoading(false);
      }
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const fecthErp = async (sectionId) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.homework.hwErp}?section_mapping_id=${sectionMappingId}&status=1&user_level=13`,
        {
          headers: {
            Authorization: `Bearer ${loggedUserData?.token}`,
          },
        }
      );
      if (result?.status === 200) {
        setErpList(result?.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const saveErp = async (file_location, erpId) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file_location', file_location);
      formData.append('student_erp', updatedErp);

      const result = await axiosInstance.patch(
        `${endpoints.homework.hwData}${erpId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${loggedUserData?.token}`,
          },
        }
      );

      if (result?.data?.status_code === 200) {
        message.success(result?.data?.message);
        setErpUpdateModal(false);
        if (startDate && endDate && subejctId.length !== 0 && showTab) {
          const status = showTab == 1 ? 'True' : 'False';
          fecthHwData(startDate, endDate, subejctId, status);
        }
        handleClearGrade();
        setLoading(false);
      } else {
        message.error(result?.data?.message);
        setLoading(false);
      }
      console.log(result, 'coming');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const ErpOptions = erpList?.map((each) => {
    return (
      <Option key={each?.erp_id} value={each.erp_id} title={each?.erp_id}>
        {each?.user__first_name} {each?.user__last_name}
      </Option>
    );
  });

  const handleChangeGrade = (each) => {
    // const singleGrade = each.map((item) => item.value).join(',');
    setGrade(each?.value);
    fetchSection(each?.value);
    setSection();
  };

  const handleClearGrade = () => {
    setGrade('');
    setSection('');
    setSectionList([]);
    setGradeList([]);
    setUpdatedErp('');
  };

  const handleChangeSection = (each) => {
    if (each) {
      setSection(each?.value);
    }
  };

  const handleClearSection = () => {
    setSection([]);
  };

  const handleImagePrev = (data) => {
    setImagePrev(data);
    setImagePrevModal(true);
  };

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-12'>
          <div className='th-tabs th-tabs-hw mt-2 th-bg-white'>
            <Tabs type='card' className='' onChange={onChange} defaultActiveKey={showTab}>
              <TabPane tab='Passed' key='1'>
                <div className=''>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <span
                      style={{ border: '1px solid #d9d9d9', padding : "5px" }}
                    >
                      <InfoCircleTwoTone className='pr-2' />
                      <i className='th-grey th-fw-500 '>
                        New Uploaded Files Will Take Some Time To Reflect. Please Wait For 10 to 15 Minutes.
                      </i>
                    </span>
                    <div>
                      <span className=''>Total Count- {count}</span>
                    </div>
                  </div>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading}
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={hwFiles}
                    pagination={false}
                    scroll={{ y: '300px' }}
                  />
                </div>
                {hwFiles?.length > 0 && (
                  <div className='text-center mt-2'>
                    <Pagination
                      current={refferListPageData.currentPage}
                      total={refferListPageData.totalCount}
                      pageSize={refferListPageData.pageSize}
                      onChange={(value) =>
                        setRefferListPageData({
                          ...refferListPageData,
                          currentPage: value,
                        })
                      }
                      showSizeChanger={false}
                      showQuickJumper={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                      }
                    />
                  </div>
                )}
              </TabPane>
              <TabPane tab='Failed' key='2'>
                <div className='d-flex justify-content-end mb-2'>
                  <span className=''>Total Count- {count}</span>
                </div>
                <div>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    loading={loading}
                    columns={columnsFailed}
                    rowKey={(record) => record?.id}
                    dataSource={hwFiles}
                    scroll={{ y: '300px' }}
                    pagination={false}
                  />
                </div>
                {hwFiles?.length > 0 && (
                  <div className='text-center mt-2'>
                    <Pagination
                      current={refferListPageData.currentPage}
                      total={refferListPageData.totalCount}
                      pageSize={refferListPageData.pageSize}
                      onChange={(value) =>
                        setRefferListPageData({
                          ...refferListPageData,
                          currentPage: value,
                        })
                      }
                      showSizeChanger={false}
                      showQuickJumper={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                      }
                    />
                  </div>
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
        <Modal
          title='Update ERP Number'
          centered
          visible={erpUpdateModal}
          footer={false}
          className='th-modal'
          onCancel={() => setErpUpdateModal(false)}
        >
          <Form>
            <div className='row justify-content-center'>
              <div className='col-sm-6 col-12'>
                <Form.Item name='grade'>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    maxTagCount={1}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleChangeGrade(value)}
                    onClear={handleClearGrade}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={grade}
                    showSearch
                    placeholder='Select Grade'
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-sm-6 col-12'>
                <Form.Item name='section'>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    maxTagCount={1}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleChangeSection(value)}
                    onClear={handleClearSection}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={section}
                    showSearch
                    placeholder='Select section'
                  >
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-sm-6 col-12'>
                <Form.Item name='erp'>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    maxTagCount={1}
                    allowClear={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleCurrentErp(value)}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={updatedErp}
                    showSearch
                    placeholder='Select Erp'
                  >
                    {ErpOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-sm-6 col-12'>
                <Button
                  className='w-100 th-br-4'
                  type='primary'
                  onClick={() => saveErp()}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </Modal>

        <Modal
          centered
          visible={imagePrevModal}
          footer={false}
          className='th-modal'
          onCancel={() => {
            setImagePrev(null);
            setImagePrevModal(false);
          }}
          width={'80%'}
        >
          <img src={imagePrev} alt={imagePrev} className='img-fluid' />
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default UploadTable;
