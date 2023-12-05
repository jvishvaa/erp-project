import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Button,
  Input,
  TimePicker,
  message,
  Spin,
} from 'antd';
import moment from 'moment';
import {
  DeleteOutlined,
  EditFilled,
  PlusCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';

const SetTimeTable = ({ showTab }) => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createPeriodLoading, setCreatePeriodLoading] = useState(false);
  const [currentSlotPeriodLoading, setCurrentSlotPeriodLoading] = useState(false);
  const [editCurrentSlotPeriod, setEditCurrentSlotPeriod] = useState(false);
  const [showPeriodsModal, setShowPeriodsModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState('');
  const [editSlotData, setEditSlotData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentSlotData, setCurrentSlotData] = useState({
    name: '',
    start_time: moment().format('HH:mm:ss'),
    end_time: moment().format('HH:mm:ss'),
  });
  const [currentSlotPeriods, setCurrentSlotPeriods] = useState([]);
  const [pageDetails, setPageDetails] = useState({
    total: null,
    current: 1,
  });

  const [availableTimeSlotData, setAvailableTimeSlotData] = useState([]);
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>Sl no.</span>,
      align: 'left',
      render: (text, row, index) => (
        <span className='pl-4'>{(pageDetails?.current - 1) * 15 + index + 1}.</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Time Slot Name</span>,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Start Time</span>,
      dataIndex: 'start_time',
      align: 'center',
      render: (data) => <span>{moment(data, 'HH:mm:ss').format('hh:mm A')}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>End Time</span>,
      dataIndex: 'end_time',
      align: 'center',
      render: (data) => <span>{moment(data, 'HH:mm:ss').format('hh:mm A')}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Total Periods</span>,
      align: 'center',
      render: (text, row) => (
        <span
          className='th-pointer'
          onClick={() => {
            handleShowPeriodsModal(row);
          }}
        >
          {row?.total_periods ? (
            <u>
              {row?.total_periods} {row?.total_periods == 1 ? 'period' : 'periods'}
            </u>
          ) : (
            <span className='th-grey'> + Add</span>
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      align: 'center',
      render: (text, record) => (
        <Space size=''>
          <Tag
            icon={<EyeOutlined />}
            color='success'
            className='th-pointer th-br-4'
            onClick={() => {
              handleAddTimeSlot(record);
            }}
          >
            View
          </Tag>
          {/* <Tag
            icon={<EditFilled />}
            color='processing'
            className='th-pointer th-br-4'
            onClick={() => {
              handleShowPeriodsModal(record);
            }}
          >
            Edit
          </Tag> */}
          <Popconfirm
            placement='bottomRight'
            title={'Are you sure you want to delete this time slot?'}
            onConfirm={() => handleDeleteRecord(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Tag icon={<DeleteOutlined />} color='volcano' className='th-pointer th-br-4'>
              Delete
            </Tag>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeleteRecord = (id) => {
    axios
      .delete(`${endpoints.timeTableNewFlow.availableTimeSlots}/${id}/`)
      .then((response) => {
        if (response.data?.status_code == 200) {
          message.success('TimeSlot deleted successfully');
          fetchAvailableTimeSlots({
            acad_sess: selectedBranch?.id,
            page: pageDetails?.current,
          });
        } else if (response.data?.status_code == 409) {
          message.error(response.data?.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handleShowPeriodsModal = (data) => {
    setSelectedSlotData(data);
    if (data?.total_periods == 0) {
      setCurrentSlotPeriods([
        {
          start_time: data?.start_time,
          end_time: data?.end_time,
          period_name: 'Period 1',
          time_set: data?.id,
        },
      ]);
    } else {
      setEditCurrentSlotPeriod(true);
      setCurrentSlotPeriodLoading(true);
      fetchCurrentSlotPeriods({ time_set_id: data?.id });
    }
    setShowPeriodsModal(true);
  };
  const handleAddTimeSlot = (record) => {
    if (record) {
      setEditSlotData(true);
      setCurrentSlotData(record);
    }
    setShowTimeSlotModal(true);
  };

  const handleAddPeriod = (id, period_number) => {
    let obj = {
      start_time: selectedSlotData?.start_time,
      end_time: selectedSlotData?.end_time,
      period_name: `Period ${period_number + 1}`,
      time_set: id,
    };
    let newSlotPeriods = currentSlotPeriods?.concat(obj);
    setCurrentSlotPeriods(newSlotPeriods);
  };
  const fetchCurrentSlotPeriods = (params = {}) => {
    axios
      .get(`${endpoints?.timeTableNewFlow?.periodSlots}/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setCurrentSlotPeriods(res?.data?.result?.results);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setCurrentSlotPeriodLoading(false);
      });
  };
  const handleDeletePeriod = (index) => {
    if (currentSlotPeriods[index].id) {
      axios
        .delete(
          `${endpoints?.timeTableNewFlow?.periodSlots}/${currentSlotPeriods[index].id}/`
        )
        .then((res) => {
          if (res?.data?.status_code == 200) {
            fetchCurrentSlotPeriods({ time_set_id: selectedSlotData?.id });
          }
        })
        .catch((error) => message.error('error', error?.message))
        .finally(() => {
          setCurrentSlotPeriodLoading(false);
        });
    } else {
      let newSlotPeriods = currentSlotPeriods?.slice();
      newSlotPeriods.splice(index, 1);
      setCurrentSlotPeriods(newSlotPeriods);
    }
  };

  const fetchAvailableTimeSlots = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.availableTimeSlots}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setAvailableTimeSlotData(res?.data?.result?.results);
          setPageDetails({ ...pageDetails, total: res?.data?.result?.count });
        } else {
          setAvailableTimeSlotData([]);
          setPageDetails({ current: 1, total: null });
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const handleCreateNewSlot = () => {
    if (!currentSlotData.name.trim().length) {
      message.error('Please enter slot name');
      return;
    }
    if (!currentSlotData.start_time || !currentSlotData.end_time) {
      message.error('Please enter both Start & End time');
      return;
    }
    if (
      moment(moment(currentSlotData.end_time, 'HH:mm:ss')).isBefore(
        moment(currentSlotData.start_time, 'HH:mm:ss')
      )
    ) {
      message.error('End Time must be greater than start Time');
      return;
    }
    setCreateLoading(true);
    let payload = {
      name: currentSlotData?.name,
      start_time: currentSlotData?.start_time,
      acad_sess: selectedBranch?.id,
      end_time: currentSlotData?.end_time,
    };

    if (editSlotData) {
      axios
        .put(
          `${endpoints.timeTableNewFlow.availableTimeSlots}/${currentSlotData?.id}/`,
          payload
        )
        .then((res) => {
          if (res?.status == 200) {
            message.success('Time Slot updated successfully');
            setShowTimeSlotModal(false);
            setCurrentSlotPeriods([]);
            fetchAvailableTimeSlots({
              acad_sess: selectedBranch?.id,
              page: pageDetails?.current,
            });
          }
        })
        .catch((error) => message.error('error', error?.message))
        .finally(() => {
          setCreateLoading(false);
        });
    } else {
      axios
        .post(`${endpoints.timeTableNewFlow.availableTimeSlots}/`, payload)
        .then((res) => {
          if (res?.status == 201) {
            message.success('Time Slot created successfully');
            setShowTimeSlotModal(false);
            setCurrentSlotData({
              name: '',
              start_time: moment().format('HH:mm:ss'),
              end_time: moment().format('HH:mm:ss'),
            });
            setCurrentSlotPeriods([]);
            fetchAvailableTimeSlots({
              acad_sess: selectedBranch?.id,
              page: pageDetails?.current,
            });
          }
        })
        .catch((error) => message.error('error', error?.message))
        .finally(() => {
          setCreateLoading(false);
        });
    }
  };

  const handleCreateNewPeriod = () => {
    const isBeforeSlotTime = currentSlotPeriods?.filter((el) =>
      moment(moment(el.start_time, 'HH:mm:ss')).isSameOrBefore(
        moment(moment(selectedSlotData?.start_time, 'HH:mm:ss')).subtract(1, 'minutes'),
        []
      )
    );
    const isAfterSlotTime = currentSlotPeriods?.filter((el) =>
      moment(moment(el.end_time, 'HH:mm:ss')).isSameOrAfter(
        moment(selectedSlotData?.end_time, 'HH:mm:ss').add(1, 'minutes'),
        []
      )
    );

    const hasSameStart = moment(
      moment(currentSlotPeriods[0]?.start_time, 'HH:mm:ss')
    ).isSame(moment(moment(selectedSlotData?.start_time, 'HH:mm:ss')));
    const hasSameEnd = moment(
      moment(currentSlotPeriods[currentSlotPeriods.length - 1]?.end_time, 'HH:mm:ss')
    ).isSame(moment(moment(selectedSlotData?.end_time, 'HH:mm:ss')));

    console.log({ hasSameStart, hasSameEnd });
    if (isBeforeSlotTime.length > 0) {
      message.error('Period must start after the time slot start time');
      return false;
    }
    if (isAfterSlotTime.length > 0) {
      message.error('Period must end before the time slot end time');
      return false;
    }
    if (!hasSameStart) {
      message.error('Periods must begin from the slot start time');
      return false;
    }
    if (!hasSameEnd) {
      message.error('Periods must end at the slot end time');
      return false;
    }

    setCreatePeriodLoading(true);
    axios
      .post(
        `${endpoints?.timeTableNewFlow?.periodSlots}/${selectedSlotData?.id}/`,
        currentSlotPeriods
      )
      .then((res) => {
        if (res?.data?.status_code == 200 || res?.data?.status_code == 201) {
          message.success(
            `Periods ${editCurrentSlotPeriod ? 'updated' : 'created'} successfully`
          );
          setShowPeriodsModal(false);
          fetchAvailableTimeSlots({
            acad_sess: selectedBranch?.id,
            page: pageDetails?.current,
          });
          setEditCurrentSlotPeriod(false);
        } else if (res?.data?.status_code == 409) {
          message.error(res?.data?.developer_msg);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setCreatePeriodLoading(false);
      });
    // }
  };
  useEffect(() => {
    if (showTab == '1') {
      fetchAvailableTimeSlots({
        acad_sess: selectedBranch?.id,
        page: pageDetails?.current,
      });
    }
  }, [showTab, pageDetails?.current]);
  return (
    <div className='row'>
      <div className='col-12 text-right'>
        <Button
          icon={<PlusCircleOutlined />}
          type='primary'
          className='th-br-4'
          onClick={() => handleAddTimeSlot()}
        >
          Create Time Slot
        </Button>
      </div>
      <div className='col-12 py-3'>
        <Spin spinning={loading}>
          {availableTimeSlotData?.length > 0 ? (
            <Table
              className='th-table'
              columns={columns}
              loading={loading}
              rowKey={(record) => record?.id}
              dataSource={availableTimeSlotData}
              pagination={{
                position: ['bottomCenter'],
                total: pageDetails.total,
                current: pageDetails.current,
                pageSize: 15,
                showSizeChanger: false,
                onChange: (page) => {
                  setPageDetails({ ...pageDetails, current: page });
                },
                limit: 15,
              }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              scroll={{
                x: availableTimeSlotData?.length > 0 ? 'max-content' : null,
                y: '50vh',
              }}
            />
          ) : (
            <div className='text-center py-5'>
              {!loading && (
                <span className='th-25 th-fw-500'>
                  There is no existing slots available!
                </span>
              )}
            </div>
          )}
        </Spin>
      </div>

      <Modal
        visible={showTimeSlotModal}
        centered
        className='th-upload-modal'
        title={`${editSlotData ? 'Update' : 'Create'} Time Slot`}
        onCancel={() => {
          setShowTimeSlotModal(false);
          setCurrentSlotData({
            name: '',
            start_time: moment().format('HH:mm:ss'),
            end_time: moment().format('HH:mm:ss'),
          });
          setErrorMessage('');
          setEditSlotData(false);
        }}
        footer={
          <div className='row justify-content-end'>
            <Button
              type='default'
              onClick={() => {
                setShowTimeSlotModal(false);
                setCurrentSlotData({
                  name: '',
                  start_time: moment().format('HH:mm:ss'),
                  end_time: moment().format('HH:mm:ss'),
                });
                setErrorMessage('');
              }}
            >
              Close
            </Button>
            <Button
              loading={createLoading}
              type='primary'
              onClick={() => {
                handleCreateNewSlot();
              }}
              disabled={errorMessage}
            >
              {editSlotData ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <div className='row p-3'>
          <div className='col-12 pb-3'>
            <div className='th-primary mb-1'>Time Slot Name</div>
            <Input
              placeholder='Enter Time Slot Name'
              className='pt-1 th-br-4'
              value={currentSlotData?.name}
              onChange={(e) => {
                setCurrentSlotData({ ...currentSlotData, name: e.target.value });
                let inputValue = e.target.value;
                if (inputValue.length > 100) {
                  setErrorMessage('Name should not exceed 100 characters');
                } else {
                  setErrorMessage(''); // Clear error message if within the limit
                }
              }}
            />
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </div>
          <div className='col-12'>
            <div className='th-primary mb-1'>School Timing</div>
            <div className='d-flex justify-content-between'>
              <div>
                Start Time{' '}
                <TimePicker
                  popupStyle={{ zIndex: 2100 }}
                  use12Hours
                  inputReadOnly
                  disabled={editSlotData}
                  showNow={false}
                  allowClear={false}
                  value={moment(currentSlotData?.start_time, 'HH:mm:ss')}
                  format='hh:mm A'
                  className='th-date-picker th-br-4 ml-md-2'
                  onChange={(e) => {
                    setCurrentSlotData({
                      ...currentSlotData,
                      start_time: moment(e).format('HH:mm:ss'),
                    });
                  }}
                />
              </div>
              <div>
                End Time{' '}
                <TimePicker
                  popupStyle={{ zIndex: 2100 }}
                  use12Hours
                  inputReadOnly
                  showNow={false}
                  disabled={editSlotData}
                  allowClear={false}
                  format='hh:mm A'
                  value={moment(currentSlotData?.end_time, 'HH:mm:ss')}
                  onChange={(e) => {
                    setCurrentSlotData({
                      ...currentSlotData,
                      end_time: moment(e).format('HH:mm:ss'),
                    });
                  }}
                  className='th-date-picker th-br-4 ml-md-2'
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        visible={showPeriodsModal}
        centered
        className='th-upload-modal'
        title='Add Periods'
        onCancel={() => {
          setShowPeriodsModal(false);
        }}
        footer={
          <div className='row justify-content-end'>
            <Button
              type='default'
              onClick={() => {
                setShowPeriodsModal(false);
                setEditCurrentSlotPeriod(false);
              }}
            >
              Close
            </Button>
            {!editCurrentSlotPeriod && (
              <Button
                type='primary'
                loading={createPeriodLoading}
                onClick={() => {
                  handleCreateNewPeriod();
                }}
              >
                Set Period
              </Button>
            )}
          </div>
        }
        width={window.innerWidth < 600 ? 550 : '60vw'}
      >
        <Spin spinning={currentSlotPeriodLoading}>
          <div className='row p-3'>
            <div className='col-12 pb-3'>
              <div className='d-flex justify-content-between flex-wrap'>
                <div className='th-primary mb-1'>{selectedSlotData?.name}</div>
                <div className='th-primary mb-1'>
                  Slot Timing:{' '}
                  {moment(selectedSlotData?.start_time, 'HH:mm:ss').format('hh:mm A')} -{' '}
                  {moment(selectedSlotData?.end_time, 'HH:mm:ss').format('hh:mm A')}
                </div>
              </div>
            </div>
            <div
              className='col-12 py-2 th-br-4 px-0 px-md-2'
              style={{ border: '1px solid #d9d9d9' }}
            >
              <div className='row th-fw-600 th-black-1 th-bg-grey p-1'>
                <div className='col-1 px-0 text-center'>Sl No.</div>
                <div className='col-3'>Period Name</div>
                <div className='col-8 text-center'>Duration</div>
              </div>
              {currentSlotPeriods?.map((item, index) => {
                return (
                  <div
                    className={`row p-2 align-items-end ${
                      index % 2 == 0 ? 'th-bg-white' : 'th-bg-grey'
                    }`}
                  >
                    <div className='col-1 text-center px-0'>{index + 1}.</div>
                    <div className='col-3 px-1 px-md-3'>Period {index + 1}</div>
                    <div className='col-7 text-center px-0'>
                      <div className='d-flex justify-content-between'>
                        <div>
                          Start Time{' '}
                          <TimePicker
                            key={`start_time_${index}`}
                            popupStyle={{ zIndex: 2100 }}
                            use12Hours
                            inputReadOnly
                            disabled={editCurrentSlotPeriod}
                            showNow={false}
                            allowClear={false}
                            value={moment(item?.start_time, 'hh:mm:ss')}
                            format='hh:mm A'
                            className='th-date-picker th-br-4 ml-2 px-0 px-md-2'
                            onChange={(e) => {
                              let updatedSlotperiods = [...currentSlotPeriods];
                              updatedSlotperiods[index]['start_time'] =
                                moment(e).format('HH:mm:ss');
                              setCurrentSlotPeriods(updatedSlotperiods);
                            }}
                          />
                        </div>
                        <div>
                          End Time{' '}
                          <TimePicker
                            key={`end_time_${index}`}
                            popupStyle={{ zIndex: 2100 }}
                            use12Hours
                            disabled={editCurrentSlotPeriod}
                            inputReadOnly
                            allowClear={false}
                            showNow={false}
                            value={moment(item?.end_time, 'hh:mm:ss')}
                            format='hh:mm A'
                            onChange={(e) => {
                              let updatedSlotperiods = [...currentSlotPeriods];
                              updatedSlotperiods[index]['end_time'] =
                                moment(e).format('HH:mm:ss');

                              setCurrentSlotPeriods(updatedSlotperiods);
                            }}
                            className='th-date-picker th-br-4 ml-2 px-0 px-md-2'
                          />
                        </div>
                      </div>
                    </div>
                    {index > 0 &&
                      index == currentSlotPeriods?.length - 1 &&
                      !editCurrentSlotPeriod && (
                        <div className='col-1 text-center px-0'>
                          <DeleteOutlined
                            className='th-pointer th-red'
                            onClick={() => handleDeletePeriod(index)}
                          />
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
            {!editCurrentSlotPeriod && (
              <div className='row mt-2'>
                <div className='col-12 text-center'>
                  <Button
                    type='primary'
                    className='th-br-4'
                    icon={<PlusCircleOutlined />}
                    onClick={() =>
                      handleAddPeriod(selectedSlotData?.id, currentSlotPeriods.length)
                    }
                  >
                    Add Period
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default SetTimeTable;
