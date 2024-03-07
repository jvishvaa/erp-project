import React, { useState, useRef, useEffect } from 'react';
import { message, Form, Tabs, Select, Modal, Input, Table, Button } from 'antd';
import '../BranchStaffSide/branchside.scss';
import { useHistory } from 'react-router-dom';
import QuestionPng from 'assets/images/question.png';
import { EditOutlined, EyeFilled, DownOutlined } from '@ant-design/icons';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import endpoints from 'config/endpoints';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';

const UploadTable = ({ startDate, endDate, subejctId }) => {
  const history = useHistory();
  const { TabPane } = Tabs;
  const { Option } = Select;
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

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

  const [hwFiles, setHwFiles] = useState([]);

  useEffect(() => {
    fetchGrade();

    if (startDate && endDate && subejctId.length !== 0 && showTab) {
      const status = showTab == 1 ? 'True' : 'False';
      fecthHwData(startDate, endDate, subejctId, status);
    }
  }, [startDate, endDate, subejctId, showTab]);

  const handleErp = (e, data, row) => {
    setErpNumber(e);
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
      width: '15%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      dataIndex: 'file_location',
      align: 'center',
      width: '30%',
      render: (data) => (
        <div className='col-md-12 pl-0 col-12 d-flex justify-content-center align-items-center'>
          <div className='col-10 text-truncate' title={`${data}`}>
            {data}
          </div>
          <div className='col-2'>
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
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      dataIndex: 'status',
      align: 'center',
      width: '15%',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
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
          <div className='col-md-12 d-flex justify-content-center'>
            <div>
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
                }}
              />
            </div>
          </div>
          {/* <div className='col-md-4'>
            <Button className='w-100 th-br-4' type='primary'>
              Save
            </Button>
          </div> */}
        </div>
      ),
    },
  ];

  let userData = [
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      erp: '12344555544',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
  ];

  let failedUserData = [
    {
      id: '23',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      id: '23',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      id: '23',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      id: '23',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      id: '23',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
    {
      id: '23',
      name: 'Avik Das',
      sec: 'Sec A',
      img: 'https://fujifilm-x.com/wp-content/uploads/2021/01/gfx100s_sample_04_thum-1.jpg',
      status: 'Assessed',
    },
  ];

  const onChange = (key) => {
    setShowTab(key);
  };

  const fetchGrade = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}`
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
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
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
    try {
      const result = await axiosInstance.get(
        `${endpoints.homework.hwData}?start_date=${start}&end_date=${end}&sub_sec_mpng=${sec}&status=${status}`
      );
      if (result.data.status_code === 200) {
        setHwFiles(result?.data?.result?.results);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
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
      <Option key={each?.id} value={each.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleChangeGrade = (each) => {
    // const singleGrade = each.map((item) => item.value).join(',');
    console.log({ each });
    setGrade(each?.value);
    fetchSection(each?.value);
    setSection();
  };

  const handleClearGrade = () => {
    setGrade('');
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
        <div className='col-12'>
          <div className='th-tabs th-tabs-hw mt-2 th-bg-white'>
            <Tabs type='card' className='' onChange={onChange} defaultActiveKey={showTab}>
              <TabPane tab='Passed' key='1'>
                <div className=''>
                  <div className='d-flex justify-content-between mb-2'>
                    <span className=''>Total Unique Students -10</span>
                    <span className=''>Total Count-10</span>
                  </div>
                  <div>
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
                </div>
              </TabPane>
              <TabPane tab='Failed' key='2'>
                <div className='d-flex justify-content-end mb-2'>
                  <span className=''>Total Count-10</span>
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
                    pagination={false}
                    scroll={{ y: '300px' }}
                  />
                </div>
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
                    onChange={(e, value) => handleChangeSection(value)}
                    onClear={handleClearSection}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select Erp'
                  >
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-sm-6 col-12'>
                <Button className='w-100 th-br-4' type='primary'>
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
