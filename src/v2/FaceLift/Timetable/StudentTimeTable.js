import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import StudentTimeTableNewView from './StudentTimeTableNewView';
import moment from 'moment';
import {
  Breadcrumb,
  Spin,
  message,
  DatePicker,
  Card,
  List,
  Button,
  Modal,
  Divider,
  Table,
  Tooltip,
} from 'antd';
import { useSelector } from 'react-redux';
import { EyeFilled } from '@ant-design/icons';
const { RangePicker } = DatePicker;

const StudentTimeTable = () => {
  const today = moment();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const startOfWeek = today.clone().startOf('isoWeek');
  const endOfWeek = today.clone().endOf('isoWeek');

  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState([startOfWeek, endOfWeek]);

  const [currentWeekTimeTable, setCurrentWeekTimeTable] = useState([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherList, setTeacherList] = useState({});
  const [classTeacher, setClassTeacher] = useState();
  const [teacherLoading, setTeacherLoading] = useState(true);

  const handleShowTeacherModal = () => {
    setShowTeacherModal(true);
  };
  const handleCloseTeacherModal = () => {
    setShowTeacherModal(false);
  };
  const fetchCurrentWeekTimeTable = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.studentTimeTableView}/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setCurrentWeekTimeTable(res?.data?.result?.result);
        } else {
          setCurrentWeekTimeTable([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchAllTeachers = (params = {}) => {
    setTeacherLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.studentTeacherList}`, { params: params })
      .then((res) => {
        let transformedTeacherData = Object.keys(res?.data?.teacher_list)?.map(
          (subject) => ({
            key: subject,
            subject: subject,
            teachers: res?.data?.teacher_list[subject].join(' , '),
          })
        );
        setTeacherList(transformedTeacherData);
        setClassTeacher(res?.data?.class_teacher[0]);
      })
      .catch((err) => {
        message.error('error', err?.message);
      })
      .finally(() => {
        setTeacherLoading(false);
      });
  };
  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;

    if (dates[0] == null) {
      return current && current.day() !== 1;
    } else {
      return !!tooEarly || !!tooLate;
    }
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  useEffect(() => {
    if (value?.length > 1) {
      fetchAllTeachers({
        session_id: selectedBranch?.session_year?.id,
        start: moment(value[0]).format('YYYY-MM-DD'),
        end: moment(value[1]).format('YYYY-MM-DD'),
      });
      fetchCurrentWeekTimeTable({
        start: moment(value[0]).format('YYYY-MM-DD'),
        end: moment(value[1]).format('YYYY-MM-DD'),
      });
    }
  }, [value]);

  const columns = [
    {
      title: <span className='th-white th-fw-700'>Subject</span>,
      dataIndex: 'subject',
      width: '20%',
      key: 'subject',
      align: 'center',
      render: (data) => <span className='th-black th-fw-700'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Teachers</span>,
      dataIndex: 'teachers',
      align: 'center',
      key: 'teachers',
    },
  ];
  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row px-3'>
          <div className='col-12 th-bg-white'>
            <div className='row'>
              <div className='col-md-12 pt-3 pr-0'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='d-flex align-items-center'>
                    <span className='th-fw-600'>Select Date Range: </span>
                    <span className='pl-2'>
                      <RangePicker
                        className='w-100'
                        popupStyle={{ zIndex: 2100 }}
                        value={dates || value}
                        disabledDate={disabledDate}
                        onCalendarChange={(val) => setDates(val)}
                        onChange={(val) => setValue(val)}
                        onOpenChange={onOpenChange}
                      />
                    </span>
                  </div>
                  {currentWeekTimeTable?.length > 0 && (
                    <Tooltip
                      title={teacherList?.length > 0 ? '' : 'Timetable not created yet'}
                    >
                      <Button
                        type='primary'
                        className='th-br-8'
                        icon={<EyeFilled />}
                        onClick={teacherList?.length > 0 && handleShowTeacherModal}
                      >
                        Show Teachers
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            <div className={`${loading ? 'py-5' : ''}`}>
              <Spin spinning={loading}>
                {!teacherLoading && currentWeekTimeTable?.length > 0 && !loading && (
                  <div className='col-12 mt-3 th-16'>
                    Class Teacher :{' '}
                    <span className='th-primary th-fw-600'>
                      {classTeacher?.class_teacher__name}
                    </span>
                  </div>
                )}
                {currentWeekTimeTable?.length > 0 ? (
                  <Card className='th-br-8 th-timetable-card' bordered={false}>
                    <StudentTimeTableNewView
                      currentWeekTimeTable={currentWeekTimeTable}
                      startDate={moment(value?.[0])?.format('YYYY-MM-DD')}
                    />
                  </Card>
                ) : (
                  <div className='text-center py-5'>
                    <span className='th-25 th-fw-700'>Timetable Not Created</span>
                    <p className='th-fw-400'>
                      Please note that the timetable for this period has not been
                      generated yet. Kindly stay tuned for updates.
                    </p>
                  </div>
                )}
              </Spin>
            </div>
          </div>
        </div>
        <Modal
          visible={showTeacherModal}
          className='th-upload-modal'
          onCancel={handleCloseTeacherModal}
          // title='Show Subject Teacher'
          centered
          closable={false}
          width={'50vw'}
          footer={
            <Button type='default' className='th-br-8' onClick={handleCloseTeacherModal}>
              Close
            </Button>
          }
        >
          <div className='p-3'>
            {/* <div style={{ maxHeight: 450, overflowY: 'auto' }}> */}
            <div className='d-flex align-items-center justify-content-start flex-wrap'>
              <Table
                // className='th-table'
                columns={columns}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                dataSource={teacherList}
                pagination={false}
                scroll={{ y: 400 }}
              />
            </div>
            {/* </div> */}
          </div>
        </Modal>
      </Layout>
    </React.Fragment>
  );
};

export default StudentTimeTable;
