import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb, Tabs, Select, Modal, Input, Table, Button } from 'antd';
import '../BranchStaffSide/branchside.scss';
import { useHistory } from 'react-router-dom';
import QuestionPng from 'assets/images/question.png';
import { SendOutlined, EyeFilled } from '@ant-design/icons';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';

const { TabPane } = Tabs;

const UploadTable = () => {
  const history = useHistory();
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  const [showTab, setShowTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [erpNumber, setErpNumber] = useState('');

  const handleErp = (e, data, row) => {
    console.log(e, data, row, 'dataa value erp');
    setErpNumber(e);
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>S.No</span>,
      dataIndex: 'user',
      align: 'center',
      render: (data, row, index) => <span className='th-black-1 th-14'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Name</span>,
      dataIndex: 'name',
      align: 'center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP Id</span>,
      dataIndex: 'erp',
      align: 'center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Section</span>,
      dataIndex: 'sec',
      align: 'center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      dataIndex: 'img',
      align: 'center',
      render: (data) => (
        <div className='col-md-12 pl-0 col-12 d-flex justify-content-center'>
          <a
            onClick={() => {
              const fileName = data;
              //   const fileSrc = `${endpoints.lessonPlan.bucket}/${fileName}`;
              const fileSrc = data;
              openPreview({
                currentAttachmentIndex: 0,
                attachmentsArray: [
                  {
                    src: fileSrc,
                    name: 'Portion Document',
                    extension:
                      '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
                  },
                ],
              });
            }}
          >
            <div className=' pl-0 col-12e4l th-primary '>
              <EyeFilled />
            </div>
          </a>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      dataIndex: 'status',
      align: 'center',
      render: (data) => <span className='th-black-1 th-14'>{data}</span>,
    },
  ];

  const columnsFailed = [
    {
      title: <span className='th-white th-fw-700 '>S.No</span>,
      dataIndex: 'user',
      align: 'center',
      render: (data, row, index) => <span className='th-black-1 th-14'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>File</span>,
      dataIndex: 'img',
      align: 'center',
      render: (data) => (
        <div className='col-md-12 pl-0 col-12 d-flex justify-content-center'>
          <a
            onClick={() => {
              const fileName = data;
              //   const fileSrc = `${endpoints.lessonPlan.bucket}/${fileName}`;
              const fileSrc = data;
              openPreview({
                currentAttachmentIndex: 0,
                attachmentsArray: [
                  {
                    src: fileSrc,
                    name: 'Portion Document',
                    extension:
                      '.' + fileName?.split('.')[fileName?.split('.')?.length - 1],
                  },
                ],
              });
            }}
          >
            <div className=' pl-0 col-12e4l th-primary '>
              <EyeFilled />
            </div>
          </a>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP No</span>,
      dataIndex: 'erp',
      align: 'center',
      render: (data, row, index) => (
        <div className='col-md-12 row d-flex justify-content-between'>
          <Input
            placeholder='Basic usage'
            className='col-md-6'
            onChange={(e) => handleErp(e.target.value, data, row)}
          />
          <Button className='col-md-4'>Save</Button>
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

  return (
    <React.Fragment>
      <div className='row wholetabCentralHW'>
        <div className='col-12'>
          <div className=' th-bg-white'>
            <Tabs type='card' onChange={onChange} defaultActiveKey={showTab}>
              <TabPane tab='Passed' key='1'>
                <div className='col-md-12'>
                  <div className='d-flex justify-content-between'>
                    <span className='px-3'>Total Unique Students -10</span>
                    <span className='px-3'>Total Count-10</span>
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
                      dataSource={userData}
                      pagination={false}
                      scroll={{ y: '300px' }}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab='Failed' key='2'>
                <div className='col-md-12'>
                  <div className='d-flex justify-content-end'>
                    <span className='px-3'>Total Count-10</span>
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
                      dataSource={failedUserData}
                      pagination={false}
                      scroll={{ y: '300px' }}
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UploadTable;
