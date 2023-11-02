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
  Switch,
  DatePicker,
  TimePicker,
  Collapse,
} from 'antd';
import {
  DeleteOutlined,
  EditFilled,
  PlusCircleOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const CreateTimeTable = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [gradeID, setGradeID] = useState();
  const [timingGradeID, setTimingGradeID] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [sectionID, setSectionID] = useState();
  const [timingSectionID, setTimingSectionID] = useState();
  const [sectionList, setSectionList] = useState([]);
  const [creationSectionList, setCreationSectionList] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [innerExpandedRowKeys, setInnerExpandedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentGradePanel, setCurrentGradePanel] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentDay, setCurrentDay] = useState('Monday');
  const [currentSlotData, setCurrentSlotData] = useState({
    grade: '',
    section: '',
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
    ],
  });
  const [currentTimeTable, setCurrentTimeTable] = useState({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    grade: null,
    section: null,
  });

  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [showEditLectureModal, setShowEditLectureModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState();
  const dummyData = [
    {
      id: 1,
      start_date: '2023-10-26',
      end_date: '2023-10-31',
      created_on: '2023-10-25',
      allocation_status: 'Allocated',
      status: true,
      grades: [
        {
          id: 1,
          grade: 'Grade 1 Section D',
          allocation_status: 'Allocated',
          created_on: '2023-10-25',
        },
        {
          id: 2,
          grade: 'Grade 2 Section F',
          allocation_status: 'Allocated',
          created_on: '2023-10-25',
        },
      ],
    },
    {
      id: 2,
      start_date: '2023-11-26',
      end_date: '2023-11-30',
      created_on: '2023-11-25',
      allocation_status: 'Partially Allocated',
      status: false,
      grades: [
        {
          id: 1,
          grade: 'Grade 1 Section D',
          allocation_status: 'Allocated',
          created_on: '2023-10-25',
        },
        {
          id: 2,
          grade: 'Grade 2 Section F',
          allocation_status: 'Partially Allocated',
          created_on: '2023-10-25',
        },
      ],
    },
  ];
  const dummyPeriodData = [
    {
      period_name: 'Period-1',
      start_time: '09:00:00',
      end_time: '10:35:00',
      teacher: ['Rashid Khan', 'Virat Kohli', 'Rashid Khan', 'Virat Kohli'],
      lecture_type: 'Buddy Lecture',
      subject: ['English, Mathematics, Science', 'English, Mathematics, Science'],
    },
    {
      period_name: 'Period-2',
      start_time: '09:00:00',
      end_time: '10:35:00',
      teacher: ['Rashid Khan', 'Virat Kohli'],
      lecture_type: 'Split Lecture',
      subject: [],
    },
    {
      period_name: 'Period-3',
      start_time: '09:00:00',
      end_time: '10:35:00',
      teacher: ['Rashid Khan', 'Virat Kohli'],
      lecture_type: 'Subtitute Lecture',
      subject: ['English, Mathematics, Science'],
    },
  ];
  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} mappingId={each.id} value={each?.section_id}>
        {each?.sec_name}
      </Option>
    );
  });
  const creationSectionOptions = creationSectionList?.map((each) => {
    return (
      <Option key={each?.id} mappingId={each.id} value={each?.section_id}>
        {each?.sec_name}
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
            setCreationSectionList(result?.data?.data);
          }
        } else {
          setSectionList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const handleGrade = (e, value) => {
    setSectionList([]);
    setSectionID();
    setGradeID();
    if (e) {
      setGradeID(e);
      fetchSectionData(selectedAcademicYear?.id, selectedBranch?.branch?.id, e, true);
    }
  };
  const handleTimingGrade = (e, value) => {
    setCreationSectionList([]);
    setTimingSectionID();
    setTimingGradeID();
    if (e) {
      setTimingGradeID(e);
      fetchSectionData(selectedAcademicYear?.id, selectedBranch?.branch?.id, e, false);
    }
  };
  const handleSection = (e) => {
    if (e) {
      setSectionID(e);
    } else {
      setSectionID();
    }
  };
  const handleTimingSection = (e) => {
    if (e) {
      setTimingSectionID(e);
    } else {
      setTimingSectionID();
    }
  };

  const handleDeleteRecord = () => {};
  const handleViewCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleShowEditTimeModal = (record) => {
    setSelectedPeriod(record);
    setShowEditTimeModal(true);
  };
  const handleCloseEditTimeModal = (record) => {
    setShowEditTimeModal(false);
    setSelectedPeriod();
  };
  const handleShowEditLectureModal = (record) => {
    setSelectedPeriod(record);
    setShowEditLectureModal(true);
  };
  const handleCloseEditLectureModal = (record) => {
    setShowEditLectureModal(false);
    setSelectedPeriod();
  };
  const handleShowEditTeacherModal = (record) => {
    setSelectedPeriod(record);
    setShowEditTeacherModal(true);
  };
  const handleCloseEditTeacherModal = (record) => {
    setShowEditTeacherModal(false);
    setSelectedPeriod();
  };
  const handleShowEditSubjectModal = (record) => {
    setSelectedPeriod(record);
    setShowEditSubjectModal(true);
  };
  const handleCloseEditSubjectModal = (record) => {
    setShowEditSubjectModal(false);
    setSelectedPeriod();
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700'>Date Range</span>,
      align: 'center',
      width: '30%',
      render: (text, row) => (
        <span>
          {moment(row?.start_date).format('Do MMM') +
            '-' +
            moment(row?.end_date).format('Do MMM, YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Allocation Status</span>,
      dataIndex: 'allocation_status',
      width: '15%',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Created On</span>,
      dataIndex: 'created_on',
      width: '15%',
      align: 'center',
      render: (data) => <span>{moment(data).format('DD-MM-YYYY')}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Status</span>,
      dataIndex: 'status',
      width: '15%',
      align: 'center',
      render: (data) => (
        <span>
          <Switch checked={data} />
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      align: 'center',
      width: '20%',
      render: (record) => (
        <Space size=''>
          <Tag
            icon={<EditFilled />}
            color='processing'
            className='th-pointer th-br-4'
            onClick={() => {
              handleViewCreateModal(record);
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
  const periodTableColumn = [
    {
      title: <span className='th-white th-fw-700'>Periods</span>,
      align: 'center',
      render: (text, row) => (
        <div className='d-flex text-left flex-column'>
          <div className='th-fw-500 th-18'>{row?.period_name}</div>
          <div>
            <span>{moment(row?.start_time, 'hh:mm A').format('hh:mm A')}</span> -
            <span className='mr-1'>
              {moment(row?.end_time, 'hh:mm A').format('hh:mm A')}
            </span>
            <EditFilled
              className='th-pointer'
              onClick={() => {
                handleShowEditTimeModal(row);
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Lecture Type</span>,

      align: 'center',
      render: (text, row) => (
        <span className='th-pointer' onClick={() => handleShowEditLectureModal(row)}>
          {row?.lecture_type ? (
            <span>
              {' '}
              {row.lecture_type} <EditFilled className='pl-2' />
            </span>
          ) : (
            <span className='th-grey'>+ Add</span>
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Subject</span>,
      align: 'center',
      ellipsis: true,
      render: (text, row) => (
        <span
          className='th-pointer'
          onClick={() => handleShowEditSubjectModal(row)}
          title={row?.subject?.length > 0 ? row?.subject?.join(',') : null}
        >
          {' '}
          + {row?.subject?.length > 0 ? row?.subject?.join(',') : 'Add'}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Teacher</span>,
      dataIndex: 'teacher',
      align: 'center',
      ellipsis: true,
      render: (data) => <span>+{data?.join(',')}</span>,
      render: (text, row) => (
        <span
          className='th-pointer'
          onClick={() => handleShowEditTeacherModal(row)}
          title={row?.teacher?.length > 0 ? row?.teacher?.join(',') : null}
        >
          {' '}
          + {row?.teacher?.length > 0 ? row?.teacher?.join(',') : 'Add'}
        </span>
      ),
    },
  ];

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.id);
    }

    setExpandedRowKeys(keys);
  };
  const onInnerTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.id);
    }

    setInnerExpandedRowKeys(keys);
  };
  const expandedRowRender = (record) => {
    let currentData = record.grades;
    const innerColumns = [
      {
        dataIndex: 'grade',
        align: 'center',
        width: tableWidthCalculator(30) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'allocation_status',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        dataIndex: 'created_on',
        align: 'center',
        width: '15%',
        render: (data) => (
          <span className='th-black-2'>{moment(data).format('DD-MM-YYYY')}</span>
        ),
      },
      {
        dataIndex: '',
        align: 'center',
        width: '15%',
      },
      {
        dataIndex: '',
        align: 'center',
        width: '20%',
      },
    ];

    return (
      <div className='d-flex justify-content-center'>
        <Table
          columns={innerColumns}
          dataSource={currentData}
          rowKey={(record) => record?.id}
          pagination={false}
          expandable={{
            expandedRowRender: innerExpandedRowRender,
            expandedRowKeys: innerExpandedRowKeys,
            onExpand: onInnerTableRowExpand,
          }}
          showHeader={false}
          style={{ width: '100%' }}
          scroll={{ x: null }}
          className='th-table'
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
        />
      </div>
    );
  };
  const innerExpandedRowRender = () => {
    return (
      <div className='row th-bg-grey p-2 th-br-4' style={{ border: '1px solid #d9d9d9' }}>
        <div className='col-12'>
          <div
            className='d-flex justify-content-between pb-2'
            style={{ borderBottom: '2px solid #d9d9d9' }}
          >
            <div className='th-fw-700'>26th,June-29th July,2016</div>
            <div className='th-fw-600'>BTM Time Slot 1</div>
          </div>
          <div className='d-flex justify-content-between mt-2'>
            {[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ]?.map((item) => {
              return (
                <div
                  className={`d-flex flex-column th-bg-grey p-2 th-br-4 text-center  th-pointer ${
                    currentDay == item
                      ? 'th-button-active th-fw-600'
                      : 'th-button th-fw-500'
                  }`}
                  onClick={() => {
                    setCurrentDay(item);
                  }}
                >
                  <div>{moment().format('DD MMM')}</div>
                  <div>{item}</div>
                </div>
              );
            })}
          </div>
          <div className='mt-2'>
            <Table
              columns={periodTableColumn}
              className='th-table'
              rowKey={(record) => record?.id}
              dataSource={dummyPeriodData}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              scroll={{ y: 350 }}
            />
          </div>
          <div className='d-flex mt-2'>
            <Button type='primary' className='th-br-4' icon={<FileExcelOutlined />}>
              Export (CSV)
            </Button>
            <Button type='primary' className=' th-br-4 ml-2' icon={<FilePdfOutlined />}>
              Download (PDF)
            </Button>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    fetchGradeData({
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
    });
  }, []);
  return (
    <div>
      <React.Fragment>
        <div className='row mt-2 align-items-center'>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600'>Select Grade</div>
            <Select
              className='th-width-100 th-br-6'
              onChange={handleGrade}
              placeholder='Please select grade *'
              allowClear
              getPopupContainer={(trigger) => trigger.parentNode}
              showSearch
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={gradeID}
            >
              {gradeOptions}
            </Select>
          </div>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600'>Select Section</div>
            <Select
              className='th-width-100 th-br-6'
              onChange={(e) => handleSection(e)}
              placeholder='Please select section *'
              allowClear
              showSearch
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={sectionID}
            >
              {sectionOptions}
            </Select>
          </div>
          <div className='col-3'></div>
          <div className='col-3 text-right py-2'>
            {' '}
            <Button
              icon={<PlusCircleOutlined />}
              type='primary'
              className='th-br-4'
              onClick={handleViewCreateModal}
            >
              Create New Time Table
            </Button>
          </div>
        </div>

        <div className='col-12 mt-3'>
          <Table
            className='th-table'
            columns={columns}
            rowKey={(record) => record?.id}
            dataSource={dummyData}
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
            scroll={{ x: null }}
          />
        </div>
        {/* Create Time Table Modal */}
        <Modal
          visible={showCreateModal}
          centered
          className='th-upload-modal'
          title='Create New Time Table'
          onCancel={() => {
            setShowCreateModal(false);
            setCurrentSlotData({ name: '', start_time: '', end_time: '' });
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  setShowCreateModal(false);
                  setCurrentSlotData({ name: '', start_time: '', end_time: '' });
                }}
              >
                Close
              </Button>
              <Button type='primary'>Create</Button>
            </div>
          }
        >
          <div className='row p-3'>
            <div className='col-12'>
              <div className='row justify-content-between align-items-center'>
                <div className='th-black th-500 col-5'>Select Date Range</div>
                <div className='col-7'>
                  <RangePicker
                    className='w-100'
                    popupStyle={{ zIndex: 2100 }}
                    value={[
                      moment(currentTimeTable?.start_date, 'YYYY-MM-DD'),
                      moment(currentTimeTable?.end_date, 'YYYY-MM-DD'),
                    ]}
                    onChange={(e) => {
                      const startDate = moment(e[0]).format('YYYY-MM-DD');
                      const endDate = moment(e[1]).format('YYYY-MM-DD');
                      setCurrentTimeTable({
                        ...currentTimeTable,
                        start_date: startDate,
                        end_date: endDate,
                      });
                      console.log({ startDate, endDate });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='col-12 py-2'>
              <div className='row justify-content-between align-items-center py-2'>
                <div className='th-black th-500 col-5'>Select Grade</div>
                <div className='col-7'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) => {
                      setCurrentTimeTable({
                        ...currentTimeTable,
                        section: null,
                        grade: e,
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
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={currentTimeTable?.grade}
                  >
                    {gradeOptions}
                  </Select>
                </div>
              </div>
            </div>
            <div className='col-12 py-2'>
              <div className='row justify-content-between align-items-center'>
                <div className='th-black th-500 col-5'>Select Section</div>
                <div className='col-7'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) =>
                      setCurrentTimeTable({ ...currentTimeTable, section: e })
                    }
                    placeholder='Section *'
                    allowClear
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={currentTimeTable?.section}
                  >
                    {creationSectionOptions}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Edit Period Time Modal */}
        <Modal
          visible={showEditTimeModal}
          centered
          className='th-upload-modal'
          title='Update Period Time'
          onCancel={() => {
            handleCloseEditTimeModal();
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  handleCloseEditTimeModal();
                }}
              >
                Close
              </Button>
              <Button type='primary'>Update</Button>
            </div>
          }
        >
          <div className='row p-3'>
            <div className='col-12'>
              <div className='row justify-content-between align-items-center'>
                <div className='th-black d-flex th-fw-700 th-20 mb-2'>
                  {selectedPeriod?.period_name}
                </div>
                <div className='d-flex justify-content-between'>
                  <div>
                    Start Time{' '}
                    <TimePicker
                      popupStyle={{ zIndex: 2100 }}
                      use12Hours
                      showNow={false}
                      value={moment(selectedPeriod?.start_time, 'hh:mm A')}
                      format='hh:mm A'
                      className='th-date-picker th-br-4 mr-2'
                      onChange={(e) => {
                        setSelectedPeriod({
                          ...selectedPeriod,
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
                      value={moment(selectedPeriod?.end_time, 'hh:mm A')}
                      format='hh:mm A'
                      onChange={(e) => {
                        setSelectedPeriod({
                          ...selectedPeriod,
                          end_time: moment(e).format('hh:mm A'),
                        });
                      }}
                      className='th-date-picker th-br-4 ml-2'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Edit Lecture Type Modal */}
        <Modal
          visible={showEditLectureModal}
          centered
          className='th-upload-modal'
          title='Create Lecture'
          onCancel={() => {
            handleCloseEditLectureModal();
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  handleCloseEditLectureModal();
                }}
              >
                Close
              </Button>
              <Button type='primary'>Update</Button>
            </div>
          }
        >
          <div className='row p-3'>
            <div className='col-12'>
              <div className='th-black d-flex th-fw-700 th-20 mb-2'>
                {selectedPeriod?.period_name}
              </div>
              <div className='row justify-content-between align-items-center'>
                <div className='th-fw-500 col-4 pl-0'>Select Lecture Type</div>
                <div className='col-8'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) => {
                      setSelectedPeriod({ ...selectedPeriod, lecture_type: e });
                    }}
                    placeholder='Select Lecture Type'
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={selectedPeriod?.lecture_type}
                  >
                    <Option value='Split Lecture'>Split Lecture</Option>
                    <Option value='Buddy Lecture'>Buddy Lecture</Option>
                    <Option value='Substitute Lecture'>Substitute Lecture</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Edit Subject Type Modal */}
        <Modal
          visible={showEditSubjectModal}
          centered
          className='th-upload-modal'
          title='Assign Subjects'
          onCancel={() => {
            handleCloseEditSubjectModal();
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  handleCloseEditSubjectModal();
                }}
              >
                Close
              </Button>
              <Button type='primary'>Update</Button>
            </div>
          }
        >
          <div className='row p-3'>
            <div className='col-12'>
              <div className='th-black d-flex th-fw-700 th-20 mb-2'>
                {selectedPeriod?.period_name}
              </div>
              <div className='row justify-content-between align-items-center'>
                <div className='th-fw-500 col-4 pl-0'>Select Subjects</div>
                <div className='col-8'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) => {
                      setSelectedPeriod({ ...selectedPeriod, lecture_type: e });
                    }}
                    placeholder='Select Subjects'
                    allowClear
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={selectedPeriod?.lecture_type}
                  >
                    <Option value='Split Lecture'>Split Lecture</Option>
                    <Option value='Buddy Lecture'>Buddy Lecture</Option>
                    <Option value='Substitute Lecture'>Substitute Lecture</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Edit Subject Teacher Modal */}
        <Modal
          visible={showEditTeacherModal}
          centered
          className='th-upload-modal'
          title='Assign Teachers'
          onCancel={() => {
            handleCloseEditTeacherModal();
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  handleCloseEditTeacherModal();
                }}
              >
                Close
              </Button>
              <Button type='primary'>Update</Button>
            </div>
          }
        >
          <div className='row p-3'>
            <div className='col-12'>
              <div className='th-black d-flex th-fw-700 th-20 mb-2'>
                {selectedPeriod?.period_name}
              </div>
              <div className='row justify-content-between align-items-center'>
                <div className='th-fw-500 col-4 pl-0'>Select Teachers</div>
                <div className='col-8'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) => {
                      setSelectedPeriod({ ...selectedPeriod, lecture_type: e });
                    }}
                    placeholder='Select Teachers'
                    allowClear
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={selectedPeriod?.lecture_type}
                  >
                    <Option value='Split Lecture'>Split Lecture</Option>
                    <Option value='Buddy Lecture'>Buddy Lecture</Option>
                    <Option value='Substitute Lecture'>Substitute Lecture</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    </div>
  );
};

export default CreateTimeTable;
