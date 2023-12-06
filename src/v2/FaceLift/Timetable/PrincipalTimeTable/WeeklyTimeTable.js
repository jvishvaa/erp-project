import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import {
  Select,
  message,
  Button,
  Tag,
  Popconfirm,
  Space,
  Table,
  Modal,
  Spin,
} from 'antd';
import { DeleteOutlined, EditFilled, PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { handleDaytoText, handleTexttoWeekDay } from 'v2/weekdayConversions';

const { Option } = Select;

const WeeklyTimeTable = ({ showTab }) => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [gradeID, setGradeID] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [sectionMappingID, setSectionMappingID] = useState();
  const [sectionList, setSectionList] = useState([]);
  const [innerSectionList, setInnerSectionList] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [showAssignSlotModal, setShowAssignSlotModal] = useState(false);
  const [weeklyTimeSlotData, setWeeklyTimeSlotData] = useState([]);
  const [availableTimeSlotData, setAvailableTimeSlotData] = useState([]);
  const [curentTimingsData, setCurentTimingsData] = useState([]);
  const [timingsLoading, setTimingsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editDataLoading, setEditDataLoading] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [currentSlotData, setCurrentSlotData] = useState({});

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id} sectionId={each?.section_id}>
        {`${each?.grade__grade_name} ${each?.sec_name}`}
      </Option>
    );
  });
  const innerSectionOptions = innerSectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id} sectionId={each?.section_id}>
        {each?.sec_name}
      </Option>
    );
  });
  const availableTimeSlotOptions = availableTimeSlotData?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const fetchGradeData = (params = {}) => {
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGradeList(result?.data?.data);
        } else {
          setGradeList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const fetchSectionData = (year, branch, grade, outerFilter) => {
    const params = {
      session_year: year,
      branch_id: branch,
      grade_id: grade,
    };
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          if (outerFilter) {
            setSectionList(result?.data?.data);
          } else {
            setInnerSectionList(result?.data?.data);
          }
        } else {
          setSectionList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const handleGrade = (e, value) => {
    setSectionList([]);
    setSectionMappingID();
    setSectionMappingID();
    setGradeID();
    if (e) {
      if (e == 'All') {
        let allGrades = gradeList?.map((item) => item?.grade_id);
        setGradeID(e);
        fetchSectionData(
          selectedAcademicYear?.id,
          selectedBranch?.branch?.id,
          allGrades?.join(','),
          true
        );
      } else {
        setGradeID(e);
        fetchSectionData(selectedAcademicYear?.id, selectedBranch?.branch?.id, e, true);
      }
    }
  };

  const handleSection = (e) => {
    setExpandedRowKeys([]);
    if (e) {
      if (e == 'All') {
        let allSection = sectionList?.map((item) => item?.id);
        setSectionMappingID(e);
        fetchWeeklyTimeSlotData({ sec_map: allSection.join(',') });
      } else {
        setSectionMappingID(e);
        fetchWeeklyTimeSlotData({ sec_map: e });
      }
    } else {
      setSectionMappingID();
    }
  };
  const handleViewSlotDetails = (data) => {
    setShowAssignSlotModal(true);
    if (data?.gs_id) {
      setEditSection(true);
      fetchSectionData(
        selectedAcademicYear?.id,
        selectedBranch?.branch?.id,
        data?.grade_id,
        false
      );

      fetchEditCurrentTimeSlots(data);
    } else {
      setCurrentSlotData(data);
    }
  };
  const columns = [
    {
      title: <span className='th-white th-fw-700'>Grade & Sec</span>,

      align: 'center',
      render: (text, row) => (
        <span>
          {row?.grade__grade_name}&nbsp;{row?.section__section_name}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Created On</span>,
      dataIndex: 'created_on',
      align: 'center',
      render: (data) => <span>{moment(data).format('DD-MM-YYYY')}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      align: 'center',
      render: (record) => (
        <Space size=''>
          <Tag
            icon={<EditFilled />}
            color='processing'
            className='th-pointer th-br-4'
            onClick={() => {
              handleViewSlotDetails(record);
            }}
          >
            Edit
          </Tag>
          <Popconfirm
            placement='bottomRight'
            title={'Are you sure you want to delete this item?'}
            onConfirm={() => handleDeleteTimeSlot(record.gs_id)}
            okText='Yes'
            okButtonProps={{ loading: deleteLoading }}
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

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    setCurentTimingsData([]);

    if (expanded) {
      fetchCurrentTimeSlots({ sec_map: record?.gs_id });
      keys.push(record?.gs_id);
    }

    setExpandedRowKeys(keys);
  };
  const expandedRowRender = (record) => {
    const innerColumns = [
      {
        title: <span className='th-white th-fw-700'>Weekdays</span>,
        dataIndex: 'week_days',
        align: 'center',
        render: (data) => <span className='th-black-2'>{handleDaytoText(data)}</span>,
      },
      {
        title: <span className='th-white th-fw-700'>Class Timing Set</span>,
        dataIndex: 'time_set_name',
        align: 'center',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
    ];

    return (
      <div className='d-flex justify-content-center'>
        <Table
          columns={innerColumns}
          dataSource={curentTimingsData}
          rowKey={(record) => record?.id}
          pagination={false}
          loading={timingsLoading}
          style={{ width: '80%' }}
          className='th-time-table-head-bg th-table'
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
        />
      </div>
    );
  };

  const fetchWeeklyTimeSlotData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.weeklyTimeSlotSectionList}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setWeeklyTimeSlotData(res?.data?.result);
        } else {
          setWeeklyTimeSlotData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchAvailableTimeSlots = (params = {}) => {
    axios
      .get(`${endpoints.timeTableNewFlow.availableTimeSlots}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setAvailableTimeSlotData(res?.data?.result);
        } else {
          setAvailableTimeSlotData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchCurrentTimeSlots = (params = {}) => {
    setTimingsLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.weeklyTimeSlots}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setCurentTimingsData(res?.data?.result?.results);
        } else {
          setCurentTimingsData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setTimingsLoading(false);
      });
  };
  const fetchEditCurrentTimeSlots = (editSection) => {
    setEditDataLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.weeklyTimeSlots}/`, {
        params: {
          sec_map: editSection?.gs_id,
        },
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          let data = {
            grade: editSection?.grade__grade_name,
            gradeID: editSection?.grade_id,
            section: editSection?.section__section_name,
            sectionMappingID: editSection?.gs_id,
          };
          let timings = res.data.result?.results?.map((el) => {
            return {
              weekday: handleDaytoText(el?.week_days),
              slot: el?.time_set,
              gs_id: el?.gs_id,
            };
          });
          setCurrentSlotData({ ...data, timings: timings });
        } else {
          setCurrentSlotData({});
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setEditDataLoading(false);
      });
  };
  const handleDeleteTimeSlot = (id) => {
    setDeleteLoading(true);
    axios
      .delete(`${endpoints.timeTableNewFlow.weeklyTimeSlots}/?sec_map=${id}`)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success('Weekly Time table deleted successfully');
          fetchWeeklyTimeSlotData({
            sec_map:
              sectionMappingID == 'All'
                ? sectionList?.map((item) => item?.id).join(',')
                : sectionMappingID,
          });
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };
  const handleCreateWeeklySlot = () => {
    setCreateLoading(true);
    let payload = [];

    payload = currentSlotData?.timings?.map((item, i) => {
      return {
        sec_map: [currentSlotData?.sectionMappingID],
        week_days: Number(handleTexttoWeekDay(item?.weekday)),
        time_set: item?.slot ? item?.slot : null,
        id: editSection ? item?.id : null,
      };
    });
    if (editSection) {
      axios
        .patch(`${endpoints.timeTableNewFlow.weeklyTimeSlots}/`, payload)
        .then((res) => {
          if (res?.data?.status_code == 200) {
            message.success('Weekly Time Slot updated successfully');
            setShowAssignSlotModal(false);
            setEditSection(false);
            setCurrentSlotData([]);
            if (sectionMappingID) {
              fetchWeeklyTimeSlotData({
                sec_map:
                  sectionMappingID == 'All'
                    ? sectionList?.map((item) => item?.id).join(',')
                    : sectionMappingID,
              });
            }
          } else if (res?.data?.status_code == 409) {
            message.warning(res?.data?.message);
          }
        })
        .catch((error) => message.error('error', error?.message))
        .finally(() => {
          setCreateLoading(false);
        });
    } else {
      let checkSlot = currentSlotData?.timings.filter((e) => e?.slot != '');
      if (checkSlot?.length == 0) {
        message.error('Please Select Timings First');
        setCreateLoading(false);
        return;
      }
      axios
        .post(`${endpoints.timeTableNewFlow.weeklyTimeSlots}/`, payload)
        .then((res) => {
          if (res?.data?.status_code == 201) {
            message.success('Weekly Time Slot created successfully');
            setShowAssignSlotModal(false);
            setCurrentSlotData([]);
            if (sectionMappingID) {
              fetchWeeklyTimeSlotData({
                sec_map:
                  sectionMappingID == 'All'
                    ? sectionList?.map((item) => item?.id).join(',')
                    : sectionMappingID,
              });
            }
          } else if (res?.data?.status_code == 409) {
            if (res?.data?.developer_msg.includes('WTT already exists')) {
              message.error('Timetable Already Exist');
            } else {
              message.warning(res?.data?.message);
            }
          }
        })
        .catch((error) => message.error('error', error?.message))
        .finally(() => {
          setCreateLoading(false);
        });
    }
  };
  useEffect(() => {
    if (showTab == '2') {
      setGradeID();
      setSectionMappingID();
      setSectionList([]);
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
      });
      fetchAvailableTimeSlots({ acad_sess: selectedBranch?.id });
    }
  }, [showTab]);

  return (
    <div>
      <React.Fragment>
        <div className='row align-items-end'>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600 pb-2'>Select Grade</div>
            <Select
              className='th-width-100 th-br-6'
              onChange={handleGrade}
              placeholder='Please select grade'
              allowClear
              showSearch
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={gradeID}
            >
              {gradeList?.length > 0 && (
                <Option value='All' key='All'>
                  All
                </Option>
              )}
              {gradeOptions}
            </Select>
          </div>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600 pb-2'>Select Section</div>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              className='th-width-100 th-br-6'
              onChange={(e) => handleSection(e)}
              placeholder='Please select section'
              allowClear
              showSearch
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={sectionMappingID}
            >
              {sectionList?.length > 0 && (
                <Option value='All' key='All'>
                  All
                </Option>
              )}
              {sectionOptions}
            </Select>
          </div>
          <div className='col-3'></div>
          <div className='col-3 text-right'>
            {' '}
            <Button
              icon={<PlusCircleOutlined />}
              type='primary'
              className='th-br-4'
              onClick={() =>
                handleViewSlotDetails({
                  grade: '',
                  gradeID: null,
                  section: '',
                  sectionID: null,
                  timings: [
                    {
                      weekday: 'Monday',
                      slot: '',
                    },
                    {
                      weekday: 'Tuesday',
                      slot: '',
                    },
                    {
                      weekday: 'Wednesday',
                      slot: '',
                    },
                    {
                      weekday: 'Thursday',
                      slot: '',
                    },
                    {
                      weekday: 'Friday',
                      slot: '',
                    },
                    {
                      weekday: 'Saturday',
                      slot: '',
                    },
                    {
                      weekday: 'Sunday',
                      slot: '',
                    },
                  ],
                })
              }
            >
              Create Weekly Time Slot
            </Button>
          </div>
        </div>

        <div className='col-12 py-3'>
          {sectionMappingID ? (
            weeklyTimeSlotData.length > 0 ? (
              <Table
                className='th-table'
                columns={columns}
                rowKey={(record) => record?.gs_id}
                dataSource={weeklyTimeSlotData}
                pagination={false}
                loading={loading}
                expandable={{
                  expandedRowRender: expandedRowRender,
                  expandedRowKeys: expandedRowKeys,
                  onExpand: onTableRowExpand,
                }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                scroll={{ x: weeklyTimeSlotData?.length > 0 ? 'scroll' : null }}
              />
            ) : (
              <div className='text-center py-5'>
                <span className='th-25 th-fw-500'>No weekly time slot available!</span>
              </div>
            )
          ) : (
            <div className='text-center py-5'>
              <span className='th-25 th-fw-500'>
                Please select the filters to show data!
              </span>
            </div>
          )}
        </div>
        <Modal
          visible={showAssignSlotModal}
          centered
          className='th-upload-modal'
          title={`${editSection ? 'Update' : 'Create'} Weekly Time Slot`}
          onCancel={() => {
            setShowAssignSlotModal(false);
            setCurrentSlotData({});
            setEditSection(false);
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  setShowAssignSlotModal(false);
                  setCurrentSlotData({});
                  setEditSection(false);
                }}
              >
                Close
              </Button>
              <Button
                type='primary'
                loading={createLoading}
                onClick={() => {
                  handleCreateWeeklySlot();
                }}
              >
                {editSection ? 'Update' : 'Create'}
              </Button>
            </div>
          }
          width={'50vw'}
        >
          <Spin spinning={editDataLoading}>
            <div className='row p-3'>
              <div className='col-md-4 py-2'>
                <div className='th-black th-500'>Select Grade</div>
                <Select
                  className='th-width-100 th-br-6'
                  onChange={(e) => {
                    setCurrentSlotData({
                      ...currentSlotData,
                      gradeID: e,
                      sectionID: null,
                      sectionMappingID: null,
                    });
                    fetchSectionData(
                      selectedAcademicYear?.id,
                      selectedBranch?.branch?.id,
                      e,
                      false
                    );
                  }}
                  placeholder='Grade *'
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={currentSlotData?.gradeID}
                >
                  {gradeOptions}
                </Select>
              </div>
              <div className='col-md-4 py-2'>
                <div className='th-black th-500'>Select Section</div>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className='th-width-100 th-br-6'
                  onChange={(e) =>
                    setCurrentSlotData({
                      ...currentSlotData,
                      sectionMappingID: e,
                    })
                  }
                  placeholder='Section *'
                  allowClear
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={currentSlotData?.sectionMappingID}
                >
                  {innerSectionOptions}
                </Select>
              </div>
              <div className='col-12 mt-3 text-center '>
                <div
                  className='th-bg-grey p-2 th-br-4'
                  style={{ border: '1px solid #d9d9d9' }}
                >
                  <div className='row py-2 '>
                    <div className='col-6 th-fw-700'>Weekdays</div>
                    <div className='col-6 th-fw-700'>Set Timings</div>
                  </div>
                  {currentSlotData?.timings?.map((el, index) => {
                    return (
                      <div className='row py-1'>
                        <div className='col-6'>{el?.weekday}</div>
                        <div className='col-6'>
                          <Select
                            className='th-grey th-bg-white  w-100 text-left'
                            placement='bottomRight'
                            showArrow={true}
                            allowClear
                            onChange={(e) => {
                              let updatedTimings = [...currentSlotData?.timings];
                              updatedTimings[index]['slot'] = e;
                              setCurrentSlotData({
                                ...currentSlotData,
                                timings: updatedTimings,
                              });
                            }}
                            dropdownMatchSelectWidth={true}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            showSearch
                            getPopupContainer={(trigger) => trigger.parentNode}
                            placeholder='Select Time Slot'
                            value={el?.slot}
                          >
                            {availableTimeSlotOptions}
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Spin>
        </Modal>
      </React.Fragment>
    </div>
  );
};

export default WeeklyTimeTable;
