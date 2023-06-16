import React, { useEffect, useState, useRef } from 'react';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import {
  Breadcrumb,
  message,
  Select,
  Form,
  Button,
  Table,
  DatePicker,
  Radio,
  Modal,
} from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
import moment from 'moment';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';
import _ from 'lodash';
import { Prompt } from 'react-router-dom';

const { Option } = Select;
const isOrchids = IsOrchidsChecker();
const MarkStudentAttendance = () => {
  const isStudent = window.location.pathname.includes('student');
  const formRef = useRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();
  const [loading, setLoading] = useState(false);
  const [userLevelList, setUserLevelList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedUserLevel, setSelectedUserLevel] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [gradeID, setGradeID] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionIDs, setSectionIDs] = useState([]);
  const [sectionMappingIDs, setSectionMappingIDs] = useState([]);
  const [userListData, setUserListData] = useState([]);
  const [userAggregateData, setUserAggregateData] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [noticationAlreadySent, setNoticationAlreadySent] = useState(true);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  let columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>Sl No.</span>,
      align: 'center',
      width: '10%',
      render: (text, row, index) => (
        <span className='pl-md-4 th-black-1 th-16'>{index + 1}.</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>ERP ID</span>,
      align: 'center',
      dataIndex: 'erp_id',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>NAME</span>,
      dataIndex: 'name',
      align: 'center',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>GRADE</span>,
      dataIndex: 'section_mapping__grade__grade_name',
      align: 'center',
      visible: isStudent ? true : false,
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>SECTION</span>,
      dataIndex: 'section_mapping__section__section_name',
      align: 'center',
      visible: isStudent ? true : false,
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ATTENDANCE</span>,
      // dataIndex: 'attendence_status',
      align: 'center',
      width: isStudent ? '30%' : '40%',
      render: (text, row, index) => (
        <Radio.Group
          name='radiogroup'
          value={row?.attendence_status ?? 'present'}
          className='d-flex justify-content-around'
          onChange={(e) => {
            setHasUnsavedChanges(true);
            let attendanceInfo = _.cloneDeep(userListData);
            attendanceInfo[index].attendence_status = e.target.value;
            setUserListData(attendanceInfo);
          }}
        >
          <Radio value={'present'}>Present</Radio>
          <Radio value={'absent'}>Absent</Radio>
          {!isStudent && (
            <>
              <Radio value={'halfday'}>Halfday</Radio>
              <Radio value={'late'}>Late</Radio>
            </>
          )}
        </Radio.Group>
      ),
    },
  ].filter((item) => item.visible !== false);
  // Functions

  const handleNumberView = (n) => {
    return n > 9 ? '' + n : '0' + n;
  };
  const handleDateChange = (e) => {
    setSelectedDate(moment(e).format('YYYY-MM-DD'));
  };
  const handleSelectUserLevel = (e) => {
    if (e) {
      setSelectedUserLevel(e);
    } else {
      setSelectedUserLevel();
      formRef.current.setFieldsValue({
        user_level: null,
      });
    }
  };
  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: [],
    });
    setSectionData([]);
    if (e) {
      setGradeID(e);
      if (isStudent) {
        fetchSectionData({
          session_year: selectedAcademicYear?.id,
          branch_id: selectedBranch?.branch?.id,
          module_id: moduleId,
          grade_id: e,
        });
      }
    } else {
      setGradeID();
    }
  };

  const handleChangeSection = (each) => {
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionData.map((item) => item.section_id).join(',');
      const allsectionsMapping = sectionData.map((item) => item.id).join(',');
      setSectionIDs(allsections);
      setSectionMappingIDs(allsectionsMapping);
      formRef.current.setFieldsValue({
        section: sectionData.map((item) => item.section_id),
      });
    } else {
      setSectionIDs(each.map((item) => item.value).join(','));
      setSectionMappingIDs(each.map((item) => item.mapping).join(','));
    }
  };

  const handleClearSection = () => {
    setSectionIDs([]);
    setSectionMappingIDs([]);
  };
  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  //   API Calls
  const fetchUserLevelList = () => {
    setUserListData([]);
    axios
      .get(`/erp_user/central-user-level/`, {
        params: { exclude_student: true },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };
  const fetchGradeData = (params = {}) => {
    axios
      .get(`/erp_user/grademapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`/erp_user/sectionmapping/`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionData(res?.data?.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchUserList = () => {
    if (!selectedUserLevel) {
      message.error('Please select user Level');
      return false;
    }
    if (!gradeID) {
      message.error('Please select grade');
      return false;
    }
    if (isStudent && sectionIDs.length == 0) {
      message.error('Please select section');
      return false;
    }

    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      date: selectedDate,
      user_level: selectedUserLevel,
      grade_id: gradeID,
      section_id: sectionIDs.toString(),
    };
    setLoading(true);
    getReportData();
    axios
      .get(`${endpoints.academics.teacherAttendanceData}`, { params: { ...params } })
      .then((res) => {
        if (res?.data?.attendance_data.length > 0) {
          setUserListData(res?.data?.attendance_data);
          setUserAggregateData(res?.data?.aggregate_counts);
          if (selectedUserLevel == 13) {
            if (res?.data?.attendance_data?.some((el) => el.attendence_status === null)) {
              setNoticationAlreadySent(false);
            }
          }
        } else {
          setUserListData([]);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const hanldeMarkAttedance = () => {
    setConfirmLoading(true);
    let attendanceInfo = userListData.map((el) => {
      return {
        erp_id: el?.id,
        attendence_status: el?.attendence_status ?? 'present',
        date: selectedDate,
      };
    });
    axios
      .post('/erp_user/v2/attendance/', attendanceInfo)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success(res?.data?.message);
          if (
            isStudent &&
            isOrchids &&
            attendanceInfo.some((el) => el.attendence_status == 'absent') &&
            !noticationAlreadySent
          ) {
            setShowNotificationModal(true);
          }
          setHasUnsavedChanges(false);
          fetchUserList();
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const handleNotifyAbsentees = () => {
    const payLoad = {
      section_mapping_id: sectionMappingIDs,
      date: selectedDate,
      role: selectedUserLevel,
      status: 0,
    };
    axios
      .post(`${endpoints.academics.notifyAttendance}`, payLoad)
      .then((result) => {
        if (result.data.status_code === 200) {
          message.success(result?.data?.message);
        } else {
          message.error(result?.data?.message);
        }
        closeNotificationModal();
        setNoticationAlreadySent(true);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const getReportData = () => {
    let params;
    if (sectionMappingIDs.length > 0) {
      params = {
        date: selectedDate,
        user_level: selectedUserLevel,
        section_mapping_id: sectionMappingIDs,
      };
    } else {
      params = {
        date: selectedDate,
        user_level: selectedUserLevel,
        section_mapping_id: sectionMappingIDs,
        grade_id: gradeID,
        branch_id: selectedBranch?.branch?.id,
        session_year_id: selectedAcademicYear?.id,
      };
    }
    axios
      .get(`${endpoints.academics.dataupdate}`, { params: { ...params } })
      .then((res) => {
        if (res.data?.status_code === 200) {
          let present;
          let absent;
          present = res?.data?.result
            ?.filter((item) => item.attendence_status !== 'absent')
            .reduce((accumulator, item) => {
              return accumulator + item.count;
            }, 0);
          absent = res?.data?.result
            ?.filter((item) => item.attendence_status == 'absent')
            .reduce((accumulator, item) => {
              return accumulator + item.count;
            }, 0);
          setAbsentCount(absent);
          setPresentCount(present);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // select Options
  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });
  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const sectionsOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.section_id} value={each?.section_id} mapping={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  // Use Effects
  useEffect(() => {
    if (!isStudent) {
      fetchUserLevelList();
    } else {
      setSelectedUserLevel(13);
    }
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Attendance' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Mark Student Attendance') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  useEffect(() => {
    if (moduleId) {
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
      });
    }
  }, [moduleId]);
  useEffect(() => {
    if (hasUnsavedChanges) {
      const unloadCallback = (event) => {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = '';
        }
        return '';
      };

      window.addEventListener('beforeunload', unloadCallback);
      return () => {
        //cleanup function
        window.removeEventListener('beforeunload', unloadCallback);
      };
    }
  }, [hasUnsavedChanges]);

  return (
    <Layout>
      <div className='row py-3 px-2' style={{ position: 'relative' }}>
        <div className='col-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey th-16'>Attendance</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              {isStudent ? 'Mark Student Attendance' : 'Mark Staff Attendance'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-12 mt-3 '>
          <Form id='filterForm' ref={formRef} layout={'vertical'}>
            <div className='row align-items-center th-bg-white pt-2'>
              <div className='col-md-2 col-6 '>
                <Form.Item name='month' label='Date'>
                  <DatePicker
                    defaultValue={moment(selectedDate)}
                    disabled={true}
                    // disabledDate={(current) => current.isAfter(moment())}
                    format={'YYYY-MM-DD'}
                    inputReadOnly={true}
                    allowClear={false}
                    className='th-date-picker th-width-100'
                    onChange={(e) => handleDateChange(e)}
                  />
                </Form.Item>
              </div>
              {!isStudent && (
                <div className='col-md-2 col-6 '>
                  <Form.Item name='user_level' label='User Level'>
                    <Select
                      allowClear
                      placeholder='Select Level*'
                      showSearch
                      required={true}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleSelectUserLevel(e);
                      }}
                      className='w-100 text-left th-black-1 th-br-4'
                    >
                      {userLevelListOptions}
                    </Select>
                  </Form.Item>
                </div>
              )}
              <div className='col-md-2 col-6'>
                <Form.Item name='grade' label='Grade'>
                  <Select
                    allowClear
                    placeholder='Select Grade*'
                    showSearch
                    required={true}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e) => {
                      handleGrade(e);
                    }}
                    className='w-100 text-left th-black-1 th-br-4'
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              {isStudent && (
                <div className='col-md-2 col-6 '>
                  <Form.Item name='section' label='Sections'>
                    <Select
                      placeholder='Select Sections *'
                      showSearch
                      required={true}
                      mode='multiple'
                      maxTagCount={1}
                      value={sectionIDs}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      optionFilterProp='children'
                      suffixIcon={<DownOutlined className='th-grey' />}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleChangeSection(value);
                      }}
                      allowClear
                      onClear={handleClearSection}
                      className='w-100 text-left th-black-1 th-br-4'
                    >
                      {sectionData.length > 1 && (
                        <>
                          <Option key={0} value={'all'}>
                            All
                          </Option>
                        </>
                      )}
                      {sectionsOptions}
                    </Select>
                  </Form.Item>
                </div>
              )}
              <div className='col-md-2 col-6'>
                <Button
                  className='th-bg-primary th-white th-br-4 mt-md-3 th-width-100'
                  loading={loading}
                  onClick={() => {
                    fetchUserList();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          </Form>
          <div className='row pb-2 th-bg-white'>
            {userListData?.length > 0 && (
              <div className='col-12 pb-2 text-right'>
                <div className='th-fw-500 th-20 pr-2'>
                  Update the attendance to reflect the user's absence and validate the
                  attendance.
                </div>
              </div>
            )}
            <div className='col-12' style={{ height: '350px' }}>
              <Table
                className='th-table '
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={columns}
                pagination={false}
                rowKey={(record) => record?.id}
                dataSource={userListData}
                scroll={{ x: userListData?.length > 0 ? 'max-content' : null, y: 210 }}
              />
            </div>
          </div>
          {userListData?.length > 0 && (
            <div
              className='th-width-98 th-bg-grey'
              style={{ position: 'absolute', bottom: '10px' }}
            >
              <div className='col-12 py-2'>
                <div
                  className='row py-2 align-items-center th-br-8 th-14 th-grey th-fw-500 th-bg-white'
                  style={{ outline: '1px solid #d9d9d9' }}
                >
                  <div className='col-8'>
                    <div className='row'>
                      <div className='col-md-4 col-6  w-100'>
                        Total:{' '}
                        <span className='th-primary'>
                          {handleNumberView(userAggregateData?.total)}
                        </span>
                      </div>
                      <div className='col-md-4 col-6 '>
                        Present:{' '}
                        <span className='th-green'>
                          {handleNumberView(presentCount ?? 0)}
                        </span>
                      </div>
                      <div className='col-md-4 col-6 '>
                        Absent:{' '}
                        <span className='th-fw-500 th-red'>
                          {handleNumberView(absentCount ?? 0)}
                        </span>
                      </div>
                      {selectedUserLevel == 13 && isOrchids && !noticationAlreadySent && (
                        <div className='col-12 th-fw-600 th-black-1 pt-1'>
                          Note : - When attendance is confirmed, an SMS will be sent to
                          the absentees
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-4 text-right'>
                    <Button
                      loading={confirmLoading}
                      className='th-bg-primary th-white th-br-4 th-width-50'
                      onClick={() => {
                        hanldeMarkAttedance();
                      }}
                    >
                      Confirm Attendance
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Modal
            visible={showNotificationModal}
            centered
            onCancel={closeNotificationModal}
            className='th-upload-modal'
            title={<span>Notify Absentees</span>}
            closeIcon={<CloseOutlined />}
            closable={true}
            footer={
              <div className='d-flex justify-content-end'>
                <Button
                  type='default'
                  className='th-br-4 px-3'
                  onClick={closeNotificationModal}
                >
                  {' '}
                  Cancel
                </Button>
                <Button
                  type='primary'
                  className='th-br-4 th-bg-primary th-white px-3'
                  onClick={handleNotifyAbsentees}
                >
                  Share
                </Button>
              </div>
            }
          >
            <div className='row'>
              <div className='col-12 py-4'>
                <span className='th-fw-500 th-20'>
                  {' '}
                  Share the attendance status for the students marked 'Absent'
                </span>
              </div>
            </div>
          </Modal>
        </div>
        <Prompt
          when={hasUnsavedChanges}
          title={'Leaving?'}
          message={'Changes you made may not be saved.'}
        />
      </div>
    </Layout>
  );
};

export default MarkStudentAttendance;
