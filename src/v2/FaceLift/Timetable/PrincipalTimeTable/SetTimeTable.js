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

const SetTimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createPeriodLoading, setCreatePeriodLoading] = useState(false);
  const [showPeriodsModal, setShowPeriodsModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState('');
  const [currentSlotData, setCurrentSlotData] = useState({
    name: '',
    start_time: '',
    end_time: '',
  });
  const [currentSlotPeriods, setCurrentSlotPeriods] = useState([
    {
      start_time: '08:00:00',
      end_time: '16:00:00',
      period_name: 'Period 1',
    },
  ]);

  const [availableTimeSlotDats, setAvailableTimeSlotData] = useState([
    {
      timetable_name: 'BTM slot 1 for Primary',
      start_time: '2022-07-13T10:15:40',
      end_time: '2022-07-13T10:18:40',
      total_periods: 7,
    },
    {
      timetable_name: 'Kurla slot 1 for Primary',
      start_time: '2022-07-13T10:15:40',
      end_time: '2022-07-13T10:18:40',
      total_periods: '',
    },
    {
      timetable_name: 'Kurla slot 2 for Primary',
      start_time: '2022-07-13T10:15:40',
      end_time: '2022-07-13T10:18:40',
      total_periods: 6,
    },
  ]);
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>Sl no.</span>,
      align: 'left',
      render: (text, row, index) => <span className='pl-4'>{index + 1}.</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TimeTable Name</span>,
      dataIndex: 'timetable_name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Start Time</span>,
      dataIndex: 'start_time',
      align: 'center',
      render: (data) => <span>{moment(data).format('hh:mm A')}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>End Time</span>,
      dataIndex: 'end_time',
      align: 'center',
      render: (data) => <span>{moment(data).format('hh:mm A')}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Total Periods</span>,
      align: 'center',
      // dataIndex: 'total_periods',
      render: (text, row) => (
        <span
          className='th-pointer'
          onClick={() => {
            handleShowPeriodsModal(row);
          }}
        >
          {row?.total_periods ? (
            <u>{row?.total_periods} periods</u>
          ) : (
            <span className='th-grey'> + Add</span>
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      align: 'center',
      render: (record) => (
        <Space size=''>
          <Tag
            icon={<EyeOutlined />}
            color='success'
            className='th-pointer th-br-4'
            onClick={() => {
              handleAddTimeSlot();
            }}
          >
            View
          </Tag>
          <Tag
            icon={<EditFilled />}
            color='processing'
            className='th-pointer th-br-4'
            onClick={() => {
              handleShowPeriodsModal(record);
            }}
          >
            Edit
          </Tag>
          <Popconfirm
            placement='bottomRight'
            title={'Are you sure you want to delete this item?'}
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

  const handleDeleteRecord = () => {};
  const handleShowPeriodsModal = (data) => {
    setSelectedSlotData(data);
    setShowPeriodsModal(true);
  };
  const handleAddTimeSlot = () => {
    setShowTimeSlotModal(true);
  };

  const handleAddPeriod = () => {
    let obj = {
      start_time: '08:00:00',
      end_time: '16:00:00',
      period_name: ``,
    };
    let newSlotPeriods = currentSlotPeriods?.concat(obj);
    setCurrentSlotPeriods(newSlotPeriods);
  };

  const handleDeletePeriod = (index) => {
    let newSlotPeriods = currentSlotPeriods?.slice();
    newSlotPeriods.splice(index, 1);
    setCurrentSlotPeriods(newSlotPeriods);
  };

  const fetchAvailableTimeSlots = (params = {}) => {
    // setLoading(true);
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setAvailableTimeSlotData([
            {
              timetable_name: 'BTM slot 1 for Primary',
              start_time: '2022-07-13T10:15:40',
              end_time: '2022-07-13T10:18:40',
              total_periods: 7,
            },
            {
              timetable_name: 'Kurla slot 1 for Primary',
              start_time: '2022-07-13T10:15:40',
              end_time: '2022-07-13T10:18:40',
              total_periods: '',
            },
            {
              timetable_name: 'Kurla slot 2 for Primary',
              start_time: '2022-07-13T10:15:40',
              end_time: '2022-07-13T10:18:40',
              total_periods: 6,
            },
          ]);
        } else {
          setAvailableTimeSlotData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateNewSlot = (params = {}) => {
    setCreateLoading(true);
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          message.success(result.data.message);
        } else {
          setAvailableTimeSlotData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setCreateLoading(false);
      });
  };

  const handleCreateNewPeriod = (params = {}) => {
    setCreatePeriodLoading(true);
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          message.success(result.data.message);
        } else {
          setAvailableTimeSlotData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setCreatePeriodLoading(false);
      });
  };
  useEffect(() => {
    fetchAvailableTimeSlots();
  }, []);
  return (
    <div className='row'>
      <div className='col-12 text-right'>
        <Button
          icon={<PlusCircleOutlined />}
          type='primary'
          className='th-br-4'
          onClick={handleAddTimeSlot}
        >
          Create Time Table
        </Button>
      </div>
      <div className='col-12 pt-3'>
        <Table
          className='th-table'
          columns={columns}
          loading={loading}
          rowKey={(record) => record?.id}
          dataSource={availableTimeSlotDats}
          pagination={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
          scroll={{ x: 'scroll' }}
        />
      </div>
      <Modal
        visible={showTimeSlotModal}
        centered
        className='th-upload-modal'
        title='Create Time Table Slot'
        onCancel={() => {
          setShowTimeSlotModal(false);
          setCurrentSlotData({ name: '', start_time: '', end_time: '' });
        }}
        footer={
          <div className='row justify-content-end'>
            <Button
              type='default'
              onClick={() => {
                setShowTimeSlotModal(false);
                setCurrentSlotData({ name: '', start_time: '', end_time: '' });
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
            >
              Create
            </Button>
          </div>
        }
      >
        <div className='row p-3'>
          <div className='col-12 pb-3'>
            <div className='th-primary mb-1'>Time Table Name</div>
            <Input
              placeholder='Enter Time Table Name'
              className='pt-1 th-br-4'
              value={currentSlotData?.name}
              onChange={(e) => {
                setCurrentSlotData({ ...currentSlotData, name: e.target.value });
              }}
            />
          </div>
          <div className='col-12'>
            <div className='th-primary mb-1'>School Timing</div>
            <div className='d-flex justify-content-between'>
              <div>
                Start Time{' '}
                <TimePicker
                  popupStyle={{ zIndex: 2100 }}
                  use12Hours
                  showNow={false}
                  // value={moment(currentSlotData?.start_time)}
                  format='hh:mm A'
                  className='th-date-picker th-br-4 ml-md-2'
                  onChange={(e) => {
                    setCurrentSlotData({
                      ...currentSlotData,
                      start_time: moment(e).format('hh:mm A'),
                    });
                  }}
                />
              </div>
              <div>
                End Time{' '}
                <TimePicker
                  popupStyle={{ zIndex: 2100 }}
                  use12Hours
                  showNow={false}
                  // value={moment(currentSlotData?.end_time)}
                  format='hh:mm A'
                  onChange={(e) => {
                    setCurrentSlotData({
                      ...currentSlotData,
                      end_time: moment(e).format('hh:mm A'),
                    });
                  }}
                  className='th-date-picker th-br-4 ml-md-2'
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {console.log({ currentSlotPeriods })}
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
              }}
            >
              Close
            </Button>
            <Button
              type='primary'
              loading={createPeriodLoading}
              onClick={() => {
                handleCreateNewPeriod();
              }}
            >
              Set Period
            </Button>
          </div>
        }
        width={window.innerWidth < 600 ? 550 : '60vw'}
      >
        <div className='row p-3'>
          <div className='col-12 pb-3'>
            <div className='d-flex justify-content-between flex-wrap'>
              <div className='th-primary mb-1'>Time Table Name</div>
              <div className='th-primary mb-1'>
                Slot Timing: {moment(selectedSlotData?.start_time).format('hh:mm A')} -{' '}
                {moment(selectedSlotData?.end_time).format('hh:mm A')}
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
                          showNow={false}
                          value={moment(item?.start_time, 'hh:mm:ss')}
                          format='hh:mm A'
                          className='th-date-picker th-br-4 ml-2 px-0 px-md-2'
                          onChange={(e) => {
                            let updatedSlotperiods = [...currentSlotPeriods];
                            updatedSlotperiods[index]['start_time'] =
                              moment(e).format('hh:mm:ss');

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
                          showNow={false}
                          value={moment(item?.end_time, 'hh:mm:ss')}
                          format='hh:mm A'
                          onChange={(e) => {
                            let updatedSlotperiods = [...currentSlotPeriods];
                            updatedSlotperiods[index]['end_time'] =
                              moment(e).format('hh:mm:ss');

                            setCurrentSlotPeriods(updatedSlotperiods);
                          }}
                          className='th-date-picker th-br-4 ml-2 px-0 px-md-2'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='col-1 text-center px-0'>
                    <DeleteOutlined
                      className='th-pointer th-red'
                      onClick={() => handleDeletePeriod(index)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className='row mt-2'>
            <div className='col-12 text-center'>
              <Button
                type='primary'
                className='th-br-4'
                icon={<PlusCircleOutlined />}
                onClick={handleAddPeriod}
              >
                Add Period
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SetTimeTable;
