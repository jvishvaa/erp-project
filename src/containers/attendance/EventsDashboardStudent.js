import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Table,
  Pagination,
  Empty,
  Row,
  Col,
  Popconfirm,
  Popover,
  Tag,
  Card,
  Select,
  DatePicker,
  Modal,
  List,
} from 'antd';
import {
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  InfoCircleTwoTone,
} from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import { useForm } from 'antd/lib/form/Form';
import './eventsDashboard.css';
import Slider from 'react-slick';
import MediaDisplay from './mediaDisplayEvents';
import { saveAs } from 'file-saver';

const EventsDashboardAdmin = () => {
  const eventData1 = [
    {
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      highlight:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      event_date: '2030-07-19',
      reg_start: '2024-06-19',
      reg_end: '2024-06-22',
      event_price: 1000,
      refundable: true,
      acad_session: [1167],
      grades: [475],
      attachments: [
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716801169_12058_2024_05_27_14_42_49.099831_Screenshot_20230705_151602_01.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/faq/1712892137_pdf_325_2024_04_12_08_52_17.597614.pdf',
        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp3',
        // Add other attachments as needed
      ],
      image: [
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
      ],
      video: [
        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',
        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',

        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',

        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',
      ],
      policy: {
        12: '30',
        8: '20',
      },
      approval_status: 1,
      students_count: 0,
      policy_dates: {
        '2030-07-07': 300.0,
        '2030-07-11': 200.0,
      },
      id: 756,
    },
  ];
  let viewEvent = eventData1[0];
  const event = eventData1[0];
  const notificationDuration = 3;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [feedBackModalForm] = useForm();
  const [eventForm] = useForm();
  const user_level = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails')).user_level
    : '';
  const is_superuser = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))?.is_superuser
    : '';
  const branchList = sessionStorage.getItem('branch_list')
    ? JSON.parse(sessionStorage.getItem('branch_list'))
    : '';
  const session_year = sessionStorage.getItem('acad_session')
    ? JSON.parse(sessionStorage.getItem('acad_session'))?.id
    : '';

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({
    counts: {
      total: 512,
      live: 123,
      rejected: 178,
      pending: 512,
      cancelled: 23,
      approved: 345,
    },
    results: [
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
        subscription: 'pending',
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
        subscription: 'subscribed',
      },
      {
        title: 'Go Cosmos',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-17',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 2,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        remarks: 'Some data is missing',
        subscription: 'unsubscribed',
      },
      {
        title: 'Go Cosmos',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-18',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 3,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        remarks: 'Some data is missing',
        subscription: 'subscribed',
      },
      {
        title: 'Go Cosmos',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-20',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 4,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        subscription: 'pending',
      },
    ],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedTag, setSelectedTag] = useState();
  const [selectedDays, setSelectedDays] = useState();

  const [feedBackModalOpen, setFeedBackModalOpen] = useState(false);
  const [feedBackLoading, setFeedBackLoading] = useState(false);
  const [feedBackFlag, setFeedBackFlag] = useState('');

  const [timeLineDrawerOpen, setTimeLineDrawerOpen] = useState(false);
  const [timelineLoading, setTimeLineLoading] = useState(false);
  const [timeLineData, setTimeLineData] = useState([]);

  const [eventId, setEventId] = useState(null);
  const [eventDrawerOpen, setEventDrawerOpen] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventData, setEventData] = useState([]);

  const [gradeList, setGradeList] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(1);
  const [refundPolicy, setRefundPolicy] = useState(2);
  const [refundPolicyData, setRefundPolicyData] = useState([
    {
      days: '',
      percent: '',
      amount: '',
    },
  ]);

  const [drawerWidth, setDrawerWidth] = useState(
    window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '50%' : '30%'
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
  // const [viewEvent, setViewEvent] = useState();

  const handleClearAll = () => {
    setSelectedDays();
  };

  const openViewEventModal = (row) => {
    setViewEventModalOpen(true);
  };
  const closeViewEventModal = () => {
    setViewEventModalOpen(false);
  };

  const columns = [
    {
      title: <span className='th-white th-16 th-fw-700'></span>,
      align: 'center',
      render: (data, row, index) => (
        <span className='th-black-1 th-16'>
          {(currentPage - 1) * pageSize + index + 1}.
        </span>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Event Name</span>,
      align: 'left',
      render: (data, row) => (
        <Tag
          onClick={() => openViewEventModal(row)}
          color='geekblue'
          style={{ cursor: 'pointer' }}
          className='tag-hover'
        >
          <span className='th-black-1 th-16'>
            {row?.title.length > 15 ? row?.title.substring(0, 15) + '...' : row?.title}
          </span>
        </Tag>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Reg. End Date</span>,
      align: 'center',
      width: '15%',
      sorter: (a, b) => new Date(a.reg_end) - new Date(b.reg_end),
      render: (data, row) => <span className='th-black-1 th-16'>{row?.reg_end}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Event Date</span>,
      align: 'center',
      sorter: (a, b) => new Date(a.event_date) - new Date(b.event_date),
      render: (data, row) => <span className='th-black-1 th-16'>{row?.event_date}</span>,
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Status</span>,
      align: 'center',
      render: (data, row) => (
        <>
          {row?.approval_status === 3 ? (
            <Popover
              placement='topRight'
              content='Event got cancelled due to unforeseen circumstances. Your full amount will be refunded to your wallet'
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Tag
                  className='th-br-4 cl-canelled shadow'
                  icon={<CloseCircleOutlined />}
                >
                  Cancelled
                </Tag>
                <InfoCircleTwoTone className='icon-hover' />
              </div>
            </Popover>
          ) : (
            <>
              {row?.subscription === 'pending' && (
                <Tag className='th-br-4 cl-pending shadow' icon={<ReloadOutlined />}>
                  Not Subscribed Yet
                </Tag>
              )}
              {row?.subscription === 'subscribed' && (
                <Tag
                  className='th-br-4 cl-approved shadow'
                  icon={<CheckCircleOutlined />}
                >
                  Subscribed
                </Tag>
              )}
              {row?.subscription === 'unsubscribed' && (
                <Tag
                  className='th-br-4 cl-canelled shadow'
                  icon={<CloseCircleOutlined />}
                >
                  Un Subscribed
                </Tag>
              )}
            </>
          )}
        </>
      ),
    },
    {
      title: <span className='th-white th-16 th-fw-700'>Action</span>,
      align: 'center',
      key: 'action',
      render: (data, row) => {
        return (
          <>
            <Popover placement='topRight' content='View Event Details'>
              <Tag
                onClick={() => openViewEventModal(row)}
                color='geekblue'
                style={{ cursor: 'pointer' }}
                className='custom-tag'
                icon={<EyeOutlined />}
              >
                View Event
              </Tag>
            </Popover>
            {row?.approval_status !== 3 && (
              <>
                {row?.subscription === 'pending' && (
                  <Popconfirm
                    placement='bottomRight'
                    title='Are you sure to Subscribe for the Event ?'
                  >
                    <Popover placement='topRight' content='Subscribe Event'>
                      <Tag
                        className='custom-tag cl-approved'
                        icon={<CheckCircleOutlined />}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        Subscribe Event
                      </Tag>
                    </Popover>
                  </Popconfirm>
                )}
                {row?.subscription === 'subscribed' && (
                  <Popconfirm
                    placement='bottomRight'
                    title='If you unsubscribe, you cannot subscribe again. Are you sure you want to unsubscribe from this event?'
                  >
                    <Popover placement='topRight' content='Un Subscribe Event'>
                      <Tag
                        className='custom-tag cl-rejected'
                        icon={<CloseCircleOutlined />}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        Un Subscribe Event
                      </Tag>
                    </Popover>
                  </Popconfirm>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];
  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        <Empty
          description={
            <div>
              No data found. <br />
              Please try again.
            </div>
          }
        />
      </div>
    ),
  };
  return (
    <>
      <div className='row mb-2'>
        <div className='col-lg-3 col-md-4 col-sm-12 col-12 mb-2'>
          <RangePicker
            format='MM/DD/YYYY'
            className='w-100 text-left th-black-1 th-br-4 shadow'
            allowClear={true}
          />
        </div>
        <div className='col-lg-7 col-md-6 col-sm-12 col-12 d-flex align-items-center'>
          <Button
            size='small'
            className={`custom-tag th-br-4 ${
              selectedDays === 7 ? 'cl-days-active' : 'cl-days'
            }`}
            onClick={() => (selectedDays === 7 ? setSelectedDays() : setSelectedDays(7))}
            icon={<ClockCircleOutlined />}
          >
            Last 7 Days
          </Button>
          <Button
            size='small'
            className={`custom-tag th-br-4 ${
              selectedDays === 15 ? 'cl-days-active' : 'cl-days'
            }`}
            onClick={() =>
              selectedDays === 15 ? setSelectedDays() : setSelectedDays(15)
            }
            icon={<ClockCircleOutlined />}
          >
            15 Days
          </Button>
          <Button
            size='small'
            className={`custom-tag th-br-4 ${
              selectedDays === 30 ? 'cl-days-active' : 'cl-days'
            }`}
            onClick={() =>
              selectedDays === 30 ? setSelectedDays() : setSelectedDays(30)
            }
            icon={<ClockCircleOutlined />}
          >
            30 Days
          </Button>
        </div>
      </div>
      <div className='mt-2'>
        <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
          <div className='shadow'>
            <Table
              className='cl-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={tableData?.results}
              pagination={false}
              locale={noDataLocale}
              scroll={{
                x: 'max-content',
                y: '100vh',
              }}
            />
            <div className='d-flex justify-content-center py-2'>
              <Pagination
                current={currentPage}
                pageSize={15}
                showSizeChanger={false}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
                total={tableData?.count}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{viewEvent?.title}</span>
            <Button
              size='small'
              type='default'
              className='th-br-4 cl-button shadow'
              onClick={closeViewEventModal}
            >
              Close
            </Button>
          </div>
        }
        visible={viewEventModalOpen}
        className='cl-modal-preview'
        footer={null}
        onCancel={() => closeViewEventModal()}
        style={{
          top: '1%',
        }}
        width='90%'
      >
        <>
          <div className='row mt-2 mb-2'>
            <div className='row col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='col-lg-8 col-md-7 col-sm-8 col-12'>
                {viewEvent?.attachments?.length > 0 ? (
                  // <Slider {...settings} className='th-slick th-post-slick'>
                  //   {viewEvent?.attachments?.map((each) => (
                  <MediaDisplay
                    mediaName={viewEvent?.attachments}
                    mediaLinks={viewEvent?.attachments}
                    alt='File Not Supported'
                    className='w-100 th-br-20 p-3'
                    style={{ objectFit: 'contain' }}
                  />
                ) : //   ))}
                // </Slider>
                null}

                {/* {viewEvent?.attachments?.length > 0 && (
                  <div className='text-right'>
                    <Button
                      type='link'
                      className='th-10'
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        handleDownloadAll(viewEvent?.attachments);
                      }}
                    >
                      Download all attachments
                    </Button>
                  </div>
                )} */}
              </div>
              <div className='col-lg-4 col-md-5 col-sm-12 col-12'>
                <List
                  size='small'
                  className='cl-list shadow'
                  header={<div className='cl-list-header'>Event Details</div>}
                  dataSource={[
                    { title: 'Reg Start Date', content: viewEvent.reg_start },
                    { title: 'Reg End Date', content: viewEvent.reg_end },
                    { title: 'Event Date', content: viewEvent.event_date },
                    { title: 'Amount', content: `Rs. ${viewEvent.event_price}` },
                  ]}
                  renderItem={(item) => (
                    <List.Item className='cl-list-item'>
                      <strong>{item.title}:</strong> {item.content}
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
              <Card className='cl-card shadow'>
                <div className='card-content'>
                  <div className='card-title'>Event Highlights</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.highlight,
                    }}
                  />
                </div>
              </Card>

              <Card className='cl-card shadow'>
                <div className='card-content'>
                  <div className='card-title'>Event Description</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.description,
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default EventsDashboardAdmin;
