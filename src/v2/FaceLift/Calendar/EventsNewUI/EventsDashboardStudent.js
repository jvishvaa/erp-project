import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Pagination,
  Empty,
  Popconfirm,
  Popover,
  Tag,
  DatePicker,
  notification,
  Tooltip,
  Button,
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
import endpointsV2 from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import { useForm } from 'antd/lib/form/Form';
import './eventsDashboard.css';
import ViewEventModal from './viewEventModal';
import ENVCONFIG from 'config/config';

const EventsDashboardStudent = () => {
  const notificationDuration = 3;
  const [filterForm] = useForm();
  const { RangePicker } = DatePicker;
  const branch = sessionStorage.getItem('selected_branch')
    ? JSON.parse(sessionStorage.getItem('selected_branch'))
    : '';
  const session_year = sessionStorage.getItem('acad_session')
    ? JSON.parse(sessionStorage.getItem('acad_session'))?.id
    : '';
  let erpID = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : {};
  const { token } = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : {};

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedDays, setSelectedDays] = useState();
  const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState();
  const [imprestWallet, setImprestWallet] = useState();

  useEffect(() => {
    fetchImprestWalletData();
  }, []);
  useEffect(() => {
    fetchTableData();
  }, [currentPage]);
  useEffect(() => {
    if (selectedDays) {
      filterForm.setFieldsValue({
        date_filter: [moment(), moment().add(selectedDays, 'days')],
      });
    } else {
      filterForm.setFieldsValue({
        date_filter: [moment(), moment().add(10, 'days')],
      });
    }
    handleFetchTableData();
  }, [selectedDays]);

  const handleFetchTableData = () => {
    if (currentPage == 1) {
      fetchTableData();
    } else {
      setCurrentPage(1);
    }
  };
  const fetchTableData = () => {
    const values = filterForm.getFieldsValue();
    setLoading(true);
    let params = {
      page: currentPage,
      pageSize: pageSize,
      acad_session: branch?.id,
      start_date: values?.date_filter?.length
        ? values?.date_filter[0].format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
      end_date: values?.date_filter?.length
        ? values?.date_filter[1].format('YYYY-MM-DD')
        : moment().add(10, 'days').format('YYYY-MM-DD'),
      current_session: session_year,
    };
    axiosInstance
      .get(`${endpoints.eventsDashboard.eventsListApi}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTableData(response?.data?.result);
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const subscribeEvent = ({ eventId }) => {
    setLoading(true);
    axiosInstance
      .post(
        `${endpoints.eventsDashboard.studentActionApi}?event_id=${eventId}&subscribed=1`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message: 'Hurray! Subscribed Successfully',
            duration: notificationDuration,
            className: 'notification-container',
          });
          fetchTableData();
        } else if (response?.data?.status_code == 402) {
          notification['error']({
            message: 'Insufficient wallet balance. Please recharge to subscribe',
            duration: notificationDuration,
            className: 'notification-container',
          });
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const unSubscribeEvent = ({ eventId }) => {
    setLoading(true);
    axiosInstance
      .post(
        `${endpoints.eventsDashboard.studentActionApi}?event_id=${eventId}&subscribed=0`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message:
              'Success! Refund amount will be credited to imprest wallet as per refund policy',
            duration: 5,
            className: 'notification-container',
          });
          fetchTableData();
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openViewEventModal = (row) => {
    setViewEventModalOpen(true);
    setViewEvent(row);
  };
  const closeViewEventModal = () => {
    setViewEventModalOpen(false);
  };

  const handleFinanceRedirection = () => {
    if (ENVCONFIG?.apiGateway?.finance && token) {
      window.open(
        `${ENVCONFIG.apiGateway.finance}/sso/finance/${token}#/imprest`,
        '_blank'
      );
    } else {
      notification['error']({
        message: 'OOPS! Redirection failed. Try again after some time',
        duration: notificationDuration,
        className: 'notification-container',
      });
    }
  };

  const fetchImprestWalletData = () => {
    axiosInstance
      .get(`${endpointsV2.finance.imprestWallet}?erp_id=${erpID?.erp}`)
      .then((res) => {
        if (res?.data?.results) {
          setImprestWallet(res?.data?.results);
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {});
  };

  const columns = [
    {
      title: <span className='th-white th-event-12 th-fw-700'>SNo</span>,
      align: 'center',
      width: '5%',
      render: (data, row, index) => (
        <span className='th-black-1 th-event-12'>
          {(currentPage - 1) * pageSize + index + 1}.
        </span>
      ),
    },
    {
      title: <span className='th-white th-event-12 th-fw-700'>Event Name</span>,
      align: 'left',
      width: '35%',
      render: (data, row) => (
        <span className='th-black-1 th-event-12'>
          {row?.title && row?.title.length > 35 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomLeft'
              title={row?.title}
              overlayStyle={{ maxWidth: '60%', minWidth: '20%' }}
            >
              {row.title.substring(0, 35)}...
            </Tooltip>
          ) : (
            row?.title
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-event-12 th-fw-700'>Reg. End Date</span>,
      align: 'center',
      width: '15%',
      sorter: (a, b) => new Date(a.reg_end) - new Date(b.reg_end),
      render: (data, row) => (
        <span className='th-black-1 th-event-12'>{row?.reg_end}</span>
      ),
    },
    {
      title: <span className='th-white th-event-12 th-fw-700'>Event Date</span>,
      align: 'center',
      width: '15%',
      sorter: (a, b) => new Date(a.event_date) - new Date(b.event_date),
      render: (data, row) => (
        <span className='th-black-1 th-event-12'>{row?.event_date}</span>
      ),
    },
    {
      title: <span className='th-white th-event-12 th-fw-700'>Status</span>,
      align: 'center',
      width: '10%',
      render: (data, row) => (
        <>
          {row?.approval_status === 3 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Tag className='th-br-4 th-event-canelled' icon={<CloseCircleOutlined />}>
                Cancelled
              </Tag>
              <Tooltip
                autoAdjustOverflow='false'
                placement='bottomRight'
                title={
                  'Event got cancelled due to unforeseen circumstances. Your full amount will be refunded to your wallet'
                }
                overlayStyle={{ maxWidth: '60%', minWidth: '20%' }}
              >
                <InfoCircleTwoTone />
              </Tooltip>
            </div>
          ) : (
            <>
              {row?.subscription === 'pending' && (
                <Tag
                  className='th-br-4 th-tag-width-1 th-event-pending'
                  icon={<ReloadOutlined />}
                >
                  Not Subscribed
                </Tag>
              )}
              {row?.subscription === 'subscribed' && (
                <Tag
                  className='th-br-4 th-tag-width-1 th-event-approved'
                  icon={<CheckCircleOutlined />}
                >
                  Subscribed
                </Tag>
              )}
              {row?.subscription === 'unsubscribed' && (
                <Tag
                  className='th-br-4 th-tag-width-1 th-event-canelled'
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
      title: <span className='th-white th-event-12 th-fw-700'>Action</span>,
      align: 'left',
      key: 'action',
      width: '20%',
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
                View
              </Tag>
            </Popover>
            {row?.approval_status !== 3 && (
              <>
                {row?.subscription === 'pending' && (
                  <Popconfirm
                    placement='bottomRight'
                    title='Are you sure to Subscribe for the Event ?'
                    onConfirm={() =>
                      subscribeEvent({
                        eventId: row?.id,
                      })
                    }
                  >
                    <Popover placement='topRight' content='Subscribe Event'>
                      <Tag
                        className='custom-tag th-event-approved'
                        icon={<CheckCircleOutlined />}
                      >
                        Subscribe
                      </Tag>
                    </Popover>
                  </Popconfirm>
                )}
                {row?.subscription === 'subscribed' && (
                  <Popconfirm
                    placement='bottomRight'
                    title='If you unsubscribe, you cannot subscribe again. Are you sure you want to unsubscribe from this event?'
                    onConfirm={() =>
                      unSubscribeEvent({
                        eventId: row?.id,
                      })
                    }
                  >
                    <Popover placement='topRight' content='Un Subscribe Event'>
                      <Tag
                        className='custom-tag th-event-rejected'
                        icon={<CloseCircleOutlined />}
                      >
                        Un Subscribe
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
      <div className='row'>
        <Form id='filterForm' form={filterForm} className='row col-12'>
          <div className='col-lg-3 col-md-12 col-sm-12 col-12'>
            <Popover placement='bottomLeft' content='Select Event Date Filter'>
              <Form.Item name='date_filter'>
                <RangePicker
                  format='DD/MM/YYYY'
                  className='w-100 text-left th-black-1 th-br-4'
                  defaultValue={filterForm?.getFieldsValue()?.date_filter}
                  allowClear={false}
                  disabled={selectedDays}
                  onChange={() => handleFetchTableData()}
                />
              </Form.Item>
            </Popover>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 col-12 d-flex justify-content-around mt-1 mb-2'>
            <Popover placement='bottomLeft' content='Next 07 days Events'>
              <Tag
                className={`custom-tag ${
                  selectedDays === 7 ? 'th-event-days-active' : 'th-event-days'
                }`}
                onClick={() =>
                  selectedDays === 7 ? setSelectedDays() : setSelectedDays(7)
                }
                icon={<ClockCircleOutlined />}
              >
                7 Days
              </Tag>
            </Popover>
            <Popover placement='bottomLeft' content='Next 15 days Events'>
              <Tag
                className={`custom-tag ${
                  selectedDays === 15 ? 'th-event-days-active' : 'th-event-days'
                }`}
                onClick={() =>
                  selectedDays === 15 ? setSelectedDays() : setSelectedDays(15)
                }
                icon={<ClockCircleOutlined />}
              >
                15 Days
              </Tag>
            </Popover>
            <Popover placement='bottomLeft' content='Next 30 days Events'>
              <Tag
                size='small'
                className={`custom-tag ${
                  selectedDays === 30 ? 'th-event-days-active' : 'th-event-days'
                }`}
                onClick={() =>
                  selectedDays === 30 ? setSelectedDays() : setSelectedDays(30)
                }
                icon={<ClockCircleOutlined />}
              >
                30 Days
              </Tag>
            </Popover>
          </div>
          <div className='col-lg-5 col-md-6 col-sm-12 col-12 d-flex justify-content-end mt-1 mb-2'>
            <Tag className='count-tag th-event-grey'>
              <span className='count-tag-text'>
                {`Imprest Wallet : ₹ ${imprestWallet?.amount ?? 0}`}
              </span>
            </Tag>
            <Button
              size='small'
              className='primary-button create-button'
              onClick={() => handleFinanceRedirection()}
            >
              Recharge Imprest Wallet
            </Button>
          </div>
        </Form>
      </div>
      <div className=''>
        <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
          <div className=''>
            <Table
              className='th-event-table'
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
      <ViewEventModal
        viewEventModalOpen={viewEventModalOpen}
        closeViewEventModal={closeViewEventModal}
        viewEvent={viewEvent}
      />
    </>
  );
};

export default EventsDashboardStudent;
