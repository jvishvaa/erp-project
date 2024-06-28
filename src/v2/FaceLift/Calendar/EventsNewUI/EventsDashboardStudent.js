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
  Row,
  Col,
  Modal,
  List,
  Spin,
  message,
} from 'antd';
import {
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  InfoCircleTwoTone,
  SyncOutlined,
  CloseSquareOutlined,
  RightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import { useForm } from 'antd/lib/form/Form';
import './eventsDashboard.css';
import ViewEventModal from './viewEventModal';
import ENVCONFIG from 'config/config';
import { useSelector } from 'react-redux';

const EventsDashboardStudent = () => {
  const notificationDuration = 3;
  const [filterForm] = useForm();
  const { RangePicker } = DatePicker;
  const financeSessionYearList = localStorage.getItem('financeSessions')
    ? JSON.parse(localStorage.getItem('financeSessions'))
    : [];
  const selectedAcademicYear = useSelector((state) => state.commonFilterReducer);
  const branch = sessionStorage.getItem('selected_branch')
    ? JSON.parse(sessionStorage.getItem('selected_branch'))
    : '';
  const session_year = sessionStorage.getItem('acad_session')
    ? JSON.parse(sessionStorage.getItem('acad_session'))?.id
    : '';
  let erpID = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : {};
  const { token, role_details, erp, first_name } = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : {};

  const branchId = selectedAcademicYear?.selectedBranch?.branch?.id;
  const sessionYear = selectedAcademicYear?.selectedBranch?.session_year?.session_year;

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedDays, setSelectedDays] = useState();
  const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState();
  const [imprestWallet, setImprestWallet] = useState();

  const [unSubscribeLoading, setUnSubscribeLoading] = useState(false);
  const [unSubscribeModalOpen, setUnSubscribeModalOpen] = useState(false);
  const [policyDatesArray, setPolicyDatesArray] = useState([]);
  const [eventDetails, setEventDetails] = useState([]);
  const [rechargeModal, setRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(1000);
  const [userDetails, setUserDetails] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);

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
  const subscribeEvent = ({ eventId, row }) => {
    setLoading(true);
    if (
      moment().isSame(row.reg_end, 'day') == true ||
      moment().isBefore(row.reg_end, 'day') == true
    ) {
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
            if (viewEventModalOpen) {
              closeViewEventModal();
            }
            fetchTableData();
            fetchImprestWalletData();
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
    } else {
      setLoading(false);
      message.error('Registration Date Ended !');
    }
  };
  const unSubscribeEvent = ({ eventId }) => {
    setUnSubscribeLoading(true);
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
          if (viewEventModalOpen) {
            closeViewEventModal();
          }
          closeUnSubscribeModal();
          fetchTableData();
          fetchImprestWalletData();
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
        setUnSubscribeLoading(false);
      });
  };

  const openViewEventModal = (row) => {
    setViewEventModalOpen(true);
    setViewEvent(row);
  };
  const closeViewEventModal = () => {
    setViewEventModalOpen(false);
  };

  const openUnSubscribeModal = ({ rowData }) => {
    let data = rowData?.policy_dates
      ? Object.entries(rowData.policy_dates).map(([date, amount]) => ({
          date,
          amount: `Rs. ${amount}`,
        }))
      : [];
    setPolicyDatesArray(data);
    setEventDetails(rowData);
    setUnSubscribeModalOpen(true);
  };
  const closeUnSubscribeModal = () => {
    setPolicyDatesArray([]);
    setEventDetails([]);
    setUnSubscribeModalOpen(false);
  };

  const fetchImprestWalletData = () => {
    console.log({ financeSessionYearList });
    let finance_session_year_id = financeSessionYearList.find(
      (each) => parseInt(each?.academic_session_id) === session_year
    )?.id;
    axiosInstance
      .get(
        `${endpointsV2.finance.imprestWallet}?finance_session_year=${finance_session_year_id}&branch_id=${branch?.branch?.id}&erp_id=${erpID?.erp}`
      )
      .then((res) => {
        if (res?.data?.results) {
          setImprestWallet(res?.data?.results);
          setRechargeAmount(res?.data?.results?.minimum_recharge);
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {});
  };

  const fetchUserStatus = () => {
    axiosInstance
      .get(
        `${endpoints.profile.getUserStatus}?branch=${branchId}&session_year=${sessionYear}&erp_id=${erp}`
      )
      .then((res) => {
        setUserDetails(res.data.result.results);
      });
  };

  const generatePaymentLink = (params = {}) => {
    if (rechargeAmount < 999) {
      return message.error('Minimum amount should be atleast 1000/-');
    }
    setWalletLoading(true);
    const formData = new FormData();
    formData.append('session_year', sessionYear);
    formData.append('branch_id', branch?.branch?.id);
    formData.append('grade_id', role_details?.grades[0]?.grade_id);
    formData.append('section_id', role_details?.grades[0]?.id);
    formData.append('erp_id', erp);
    formData.append('description', 'CREDIT');
    formData.append('payment_mode', 1);
    formData.append('amount', rechargeAmount);
    formData.append('transaction_type', 'credit');
    formData.append('created_by_erp', erp);
    formData.append('created_by_name', first_name);
    formData.append('is_academic', true);

    axiosInstance
      .post(`${endpointsV2.finance.imprestWalletRecharge}`, formData)
      .then((res) => {
        setWalletLoading(false);
        if (res?.data?.payment_gateway == 'cashfree') {
          window.open(res?.data?.data?.data?.link_url, '_blank');
        } else {
          window.open(res?.data?.data?.payment_link);
        }
        setTimeout(setRechargeModal(false), 1000);
      })
      .catch((err) => {
        message.error('Failed to Fetch Data');
        setWalletLoading(false);
      });
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
      width: '30%',
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
      align: 'left',
      width: '15%',
      render: (data, row) => (
        <>
          {row?.approval_status === 3 ? (
            <div>
              <Tag
                className='th-br-4 th-tag-width-1 th-event-cancelled'
                icon={<CloseCircleOutlined />}
              >
                Cancelled
              </Tag>
              <Tooltip
                autoAdjustOverflow='false'
                placement='bottomRight'
                title={
                  'Event got cancelled due to unforeseen circumstances. Your full amount will be refunded to your wallet'
                }
                overlayStyle={{ maxWidth: '50%', minWidth: '20%' }}
              >
                <InfoCircleTwoTone className='th-14' />
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
                  className='th-br-4 th-tag-width-1 th-event-rejected'
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
                        row,
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
                  <Popover placement='topRight' content='Un Subscribe Event'>
                    <Tag
                      className='custom-tag th-event-rejected'
                      icon={<CloseCircleOutlined />}
                      onClick={() => openUnSubscribeModal({ rowData: row })}
                    >
                      Un Subscribe
                    </Tag>
                  </Popover>
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
              onClick={() => {
                setRechargeModal(true);
                fetchUserStatus();
              }}
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
      {viewEventModalOpen && (
        <ViewEventModal
          viewEventModalOpen={viewEventModalOpen}
          closeViewEventModal={closeViewEventModal}
          viewEvent={viewEvent}
          subscribeEvent={subscribeEvent}
          unSubscribeEvent={unSubscribeEvent}
          loading={loading}
          unSubscribeLoading={unSubscribeLoading}
        />
      )}
      <Modal
        title={
          <div className='d-flex justify-content-between align-items-center'>
            <div>Un Subscribe Event</div>
            <div>
              <CloseSquareOutlined
                onClick={closeUnSubscribeModal}
                className='th-close-icon'
              />
            </div>
          </div>
        }
        visible={unSubscribeModalOpen}
        onCancel={closeUnSubscribeModal}
        className='th-event-modal th-event-modal-rejected'
        style={{
          top: '10%',
        }}
        footer={[
          <Row justify='space-around'>
            <Col>
              <Button
                size='small'
                className='secondary-button drawer-modal-footer-button'
                onClick={closeUnSubscribeModal}
              >
                Close
              </Button>
            </Col>
            <Col>
              <Button
                size='small'
                className='primary-button drawer-modal-footer-button reject-button'
                icon={
                  unSubscribeLoading ? <SyncOutlined spin /> : <CloseCircleOutlined />
                }
                onClick={() => unSubscribeEvent({ eventId: eventDetails?.id })}
                disabled={unSubscribeLoading}
              >
                Un Subscribe Event
              </Button>
            </Col>
          </Row>,
        ]}
      >
        {unSubscribeLoading ? (
          <div className='d-flex justify-content-center align-items-center'>
            <Spin tip='Hold on! Great things take time!' size='large' />
          </div>
        ) : (
          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
            {eventDetails?.refundable ? (
              <>
                <span className='d-flex justify-content-center'>
                  Event Price : Rs. {eventDetails?.event_price}
                </span>
                <List
                  size='small'
                  className='th-unsubscribe-list'
                  style={{
                    marginBottom: '10px',
                  }}
                  header={
                    <>
                      <div className='d-flex justify-content-center th-unsubscribe-list-header'>
                        <strong>Refund Policy</strong>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0px 4px',
                          borderBottom: '1px solid #f0f0f0',
                          background: '#fafafa',
                        }}
                      >
                        <span style={{ flex: 1 }}>
                          <strong>Cancel Before Date</strong>
                        </span>
                        <span style={{ flex: 1, textAlign: 'right' }}>
                          <strong>Refund Amount</strong>
                        </span>
                      </div>
                    </>
                  }
                  dataSource={policyDatesArray}
                  renderItem={(item) => (
                    <List.Item className='th-unsubscribe-list-item'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <span style={{ flex: 1 }}>{item.date}</span>
                        <span style={{ flex: 1, textAlign: 'right' }}>{item.amount}</span>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontStyle: 'italic',
                  color: '#f44336',
                  marginBottom: '10px',
                }}
              >
                As per refund policy, No Refund will be given
              </span>
            )}
            If you unsubscribe, you cannot subscribe again. Are you sure you want to
            unsubscribe from this event?
          </div>
        )}
      </Modal>

      <Modal
        title={
          <div className='d-flex justify-content-between align-items-center'>
            <div>Recharge Imprest Wallet</div>
            <div>
              <CloseSquareOutlined
                onClick={() => setRechargeModal(false)}
                className='th-close-icon'
              />
            </div>
          </div>
        }
        className='th-event-modal th-event-modal-primary'
        style={{
          top: '10%',
        }}
        visible={rechargeModal}
        onCancel={() => setRechargeModal(false)}
        footer={[
          <Row justify='end'>
            <Col className='mr-3'>
              <Button
                size='small'
                className='primary-button drawer-modal-footer-button'
                onClick={() => setRechargeModal(false)}
              >
                Close
              </Button>
            </Col>
            <Col>
              <Button
                size='small'
                className='secondary-button drawer-modal-footer-button'
                icon={walletLoading ? <SyncOutlined spin /> : <RightOutlined />}
                onClick={generatePaymentLink}
                disabled={walletLoading}
              >
                Proceed
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <>
          <div className='row align-items-center justify-content-center py-2'>
            <div
              style={{
                cursor:
                  rechargeAmount === imprestWallet?.minimum_recharge
                    ? 'not-allowed'
                    : 'pointer',
              }}
              className={
                'px-3 th-br-10 mr-2 text-white th-lh-36 th-20 ' +
                (rechargeAmount > imprestWallet?.minimum_recharge
                  ? 'th-bg-primary'
                  : 'th-bg-grey-2')
              }
              onClick={() =>
                rechargeAmount > imprestWallet?.minimum_recharge
                  ? setRechargeAmount(rechargeAmount - 1000)
                  : null
              }
            >
              -
            </div>

            <div className='th-24 th-fw-600 text-center px-4'>{rechargeAmount}</div>

            <div
              className='px-3 th-bg-primary th-br-10 ml-2 text-white th-lh-36 th-20 th-pointer'
              onClick={() => setRechargeAmount(rechargeAmount + 1000)}
            >
              +
            </div>
          </div>
          <div className='d-flex justify-content-center'>
            <Button
              icon={<PlusOutlined />}
              className='m-2 th-br-6'
              onClick={() => setRechargeAmount(rechargeAmount + 1000)}
            >
              1000
            </Button>
            <Button
              icon={<PlusOutlined />}
              className='m-2 th-br-6'
              onClick={() => setRechargeAmount(rechargeAmount + 2000)}
            >
              2000
            </Button>
            <Button
              icon={<PlusOutlined />}
              className='m-2 th-br-6'
              onClick={() => setRechargeAmount(rechargeAmount + 5000)}
            >
              5000
            </Button>
          </div>
          <div className='shadow-sm p-3 my-2 mx-3 th-bg-grey th-br-8'>
            Note:
            <div className='th-12 th-grey'>
              1. Amount can be added only in multiples of 1000/-
            </div>
            <div className='th-12 th-grey'>
              2. Imprest Wallet amount can be used only for events and not for other Fee
              Payments
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default EventsDashboardStudent;
