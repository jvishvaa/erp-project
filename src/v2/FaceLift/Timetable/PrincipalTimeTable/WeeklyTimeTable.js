import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { Select, message, Button, Tag, Popconfirm, Space, Table, Modal } from 'antd';
import {
  DeleteOutlined,
  EditFilled,
  PlusCircleOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Option } = Select;

const WeeklyTimeTable = () => {
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
  const [innerSectionList, setInnerSectionList] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssignSlotModal, setShowAssignSlotModal] = useState(false);
  const [currentSlotData, setCurrentSlotData] = useState({
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
    ],
  });
  const dummyData = [
    {
      id: 1,
      grade: 'Grade 1 Section D',
      gradeID: 475,
      sectionID: 2,
      created_on: '2023-10-31',
      timings: [
        {
          weekday: 'Monday',
          slot: 'Slot 1',
        },
        {
          weekday: 'Tuesday',
          slot: 'Slot 2',
        },
        {
          weekday: 'Wednesday',
          slot: 'Slot 3',
        },
        {
          weekday: 'Thursday',
          slot: 'Slot 4',
        },
      ],
    },
    {
      id: 2,
      grade: 'Grade 2 Section C',
      gradeID: 475,
      sectionID: 2,
      created_on: '2023-10-30',
      timings: [
        {
          weekday: 'Monday',
          slot: 'Slot 13',
        },
        {
          weekday: 'Tuesday',
          slot: 'Slot 24',
        },
        {
          weekday: 'Wednesday',
          slot: 'Slot 34',
        },
        {
          weekday: 'Thursday',
          slot: 'Slot 44',
        },
      ],
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
  const innerSectionOptions = innerSectionList?.map((each) => {
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
    setSectionID();
    setGradeID();
    if (e) {
      setGradeID(e);
      fetchSectionData(selectedAcademicYear?.id, selectedBranch?.branch?.id, e, true);
    }
  };
  const handleTimingGrade = (e, value) => {
    setInnerSectionList([]);
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
  const handleViewSlotDetails = (data) => {
    setShowAssignSlotModal(true);
    setCurrentSlotData(data);
    if (data?.gradeID) {
      fetchSectionData(
        selectedAcademicYear?.id,
        selectedBranch?.branch?.id,
        data?.gradeID,
        false
      );
    }
  };

  const columns = [
    // {
    //   title: <span className='th-white pl-4 th-fw-700 '>Sl no.</span>,
    //   align: 'left',
    //   render: (text, row, index) => <span className='pl-4'>{index + 1}.</span>,
    // },
    {
      title: <span className='th-white th-fw-700'>Grade & Sec</span>,
      dataIndex: 'grade',
      align: 'center',
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

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.id);
    }

    setExpandedRowKeys(keys);
  };
  const expandedRowRender = (record) => {
    let currentData = record.timings;
    const innerColumns = [
      {
        title: <span className='th-white th-fw-700'>Weekdays</span>,
        dataIndex: 'weekday',
        align: 'center',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: <span className='th-white th-fw-700'>Class Timing Set</span>,
        dataIndex: 'slot',
        align: 'center',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
    ];

    return (
      <div className='d-flex justify-content-center'>
        <Table
          columns={innerColumns}
          dataSource={currentData}
          rowKey={(record) => record?.id}
          pagination={false}
          style={{ width: '80%' }}
          className='th-time-table-head-bg th-table'
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
        />
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
        <div className='row align-items-end'>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600'>Select Grade</div>
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
              {gradeOptions}
            </Select>
          </div>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600'>Select Section</div>
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
              value={sectionID}
            >
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
                  ],
                })
              }
            >
              Create Time Table
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
              // expandIcon: ({ expanded, onExpand, record }) =>
              //   expanded ? (
              //     <UpOutlined
              //       className='th-black-1'
              //       onClick={(e) => onExpand(record, e)}
              //     />
              //   ) : (
              //     <DownOutlined
              //       className='th-black-1'
              //       onClick={(e) => onExpand(record, e)}
              //     />
              //   ),
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
            scroll={{ x: 'max-content' }}
          />
        </div>

        {console.log({ currentSlotData })}
        <Modal
          visible={showAssignSlotModal}
          centered
          className='th-upload-modal'
          title='Create Time Table Slot'
          onCancel={() => {
            setShowAssignSlotModal(false);
            setCurrentSlotData({});
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  setShowAssignSlotModal(false);
                  setCurrentSlotData({});
                }}
              >
                Close
              </Button>
              <Button type='primary'>Create</Button>
            </div>
          }
          width={'50vw'}
        >
          <div className='row p-3'>
            <div className='col-md-4 py-2'>
              <div className='th-black th-500'>Select Grade</div>
              <Select
                className='th-width-100 th-br-6'
                onChange={(e) => {
                  setCurrentSlotData({ ...currentSlotData, gradeID: e, sectionID: null });
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
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                onChange={(e) => setCurrentSlotData({ ...currentSlotData, sectionID: e })}
                placeholder='Section *'
                allowClear
                showSearch
                optionFilterProp='children'
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                value={currentSlotData?.sectionID}
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
                          <Option value='Slot 1'>Slot 1</Option>
                          <Option value='Slot 2'>Slot 2</Option>
                          <Option value='Slot 3'>Slot 3</Option>
                          <Option value='Slot 4'>Slot 4</Option>
                          <Option value='Slot 13'>Slot 13</Option>
                          <Option value='Slot 24'>Slot 24</Option>
                          <Option value='Slot 34'>Slot 34</Option>
                          <Option value='Slot 44'>Slot 44</Option>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    </div>
  );
};

export default WeeklyTimeTable;
