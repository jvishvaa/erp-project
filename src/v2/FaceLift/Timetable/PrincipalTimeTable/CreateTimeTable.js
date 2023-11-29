import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import FileSaver from 'file-saver';
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
  Spin,
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
  StepForwardOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import { handleDaytoText, handleTexttoWeekDay } from 'v2/weekdayConversions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const CreateTimeTable = ({ showTab }) => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const LectureTypeChoices = [
    {
      id: 1,
      type: 'Split Lecture',
    },
    {
      id: 2,
      type: 'Buddy Lecture',
    },
    {
      id: 3,
      type: 'Substitute Lecture',
    },
    {
      id: 4,
      type: 'Combined Lecture',
    },
    {
      id: 5,
      type: 'Normal Lecture',
    },
  ];

  const [gradeID, setGradeID] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [sectionMappingID, setSectionMappingID] = useState();
  const [sectionList, setSectionList] = useState([]);
  const [creationSectionList, setCreationSectionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [innerExpandedRowKeys, setInnerExpandedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableDateRangesData, setAvailableDateRangesData] = useState([]);
  const [sectionListLoading, setSectionListLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [dateRangeSectionList, setDateRangeSectionList] = useState([]);
  const [periodListLoading, setPeriodListLoading] = useState(false);
  const [periodListData, setPeriodListData] = useState([]);
  const [selectedSectionData, setSelectedSectionData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDayPeriodData, setCurrentDayPeriodData] = useState([]);
  const [editPeriodLoading, setEditPeriodLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAssignPeriodDetailsModal, setShowAssignPeriodDetailsModal] = useState(false);
  const [timeTableOverlapError, setTimeTableOverlapError] = useState(null);
  const [selectedPeriodSlot, setSelectedPeriodSlot] = useState(null);
  const [currentDatePeriod, setCurrentDatePeriod] = useState({});

  const [currentTimeTable, setCurrentTimeTable] = useState({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    grade: [],
    section: [],
  });

  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [showEditLectureModal, setShowEditLectureModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [duplicateData, setDuplicateData] = useState(null);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(null);

  const [excelLoading, setExcelLoading] = useState(false);
  const [PDFLoading, setPDFLoading] = useState(false);

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
  const creationSectionOptions = creationSectionList?.map((each) => {
    return (
      <Option key={each?.id} sectionId={each.section_id} value={each?.id}>
        {`${each?.grade__grade_name} ${each?.sec_name}`}
      </Option>
    );
  });
  const subjectOptions = subjectList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id} subjectId={each?.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });
  const teacherOptions = teacherList?.map((each) => {
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
      grade_id: outerFilter ? grade : grade.join(','),
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
  const fetchDateRangeList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.getDateRangeList}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setAvailableDateRangesData(res?.data?.result);
        } else {
          setAvailableDateRangesData([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchDayWisePeriods = (params = {}) => {
    setPeriodListLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.sectionPeriodData}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          let list = res?.data?.result;
          setPeriodListData(list);
          if (selectedDate) {
            let currentData = list.find(
              (item) =>
                item?.week_days ==
                handleTexttoWeekDay(moment(selectedDate).format('dddd'))
            );
            setCurrentDayPeriodData(currentData?.period_slot);
          } else {
            let currentData = list.find(
              (item) =>
                item?.week_days ==
                handleTexttoWeekDay(moment(params?.start_date).format('dddd'))
            );
            setSelectedDate(moment(params?.start_date)?.format('YYYY-MM-DD'));
            setCurrentDayPeriodData(currentData?.period_slot);
          }
        } else {
          setPeriodListData({});
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setPeriodListLoading(false);
      });
  };
  const handleGrade = (e, value) => {
    setSectionList([]);
    setSectionMappingID();
    setGradeID();
    if (e) {
      if (e == 'All') {
        let allGrades = gradeList?.map((item) => item?.grade_id);
        setGradeID('All');
        fetchSectionData(
          selectedAcademicYear?.id,
          selectedBranch?.branch?.id,
          allGrades.join(','),
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
        fetchDateRangeList({ sec_map: allSection.join(',') });
      } else {
        setSectionMappingID(e);
        fetchDateRangeList({ sec_map: e });
      }
    } else {
      setSectionMappingID();
    }
  };

  const handleDeleteRecord = (id) => {
    setDeleteLoading(true);
    axios
      .delete(`${endpoints.timeTableNewFlow.dateRangeSectionList}/${id}/`)
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success('Time table deleted successfully');
          fetchDateRangeList({ sec_map: sectionMappingID });
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setDeleteLoading(false);
      });
  };
  const handleViewCreateModal = () => {
    setShowCreateModal(true);
  };
  const handleViewDuplicateModal = () => {
    setShowDuplicateModal(true);
  };
  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    setDuplicateData(null);
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
    fetchTeacherList({
      sec_map: selectedSectionData?.sec_map,
      subject: record?.sub?.map((item) => item.subject_id)?.join(','),
    });
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
  const handleShowPeriodDetailsModal = (record) => {
    setShowAssignPeriodDetailsModal(true);
    let data = {
      ...record,
      tt_id: selectedSectionData?.id,
      sec_map: selectedSectionData?.sec_map,
      date: moment(selectedDate).format('YYYY-MM-DD'),
    };
    setSelectedPeriod(data);
  };
  const handleClosePeriodDetailsModal = (record) => {
    setShowAssignPeriodDetailsModal(false);
    setSelectedPeriod();
  };

  const handleAssignDateRange = () => {
    setCreateLoading(true);
    if (
      currentTimeTable?.start_date == null ||
      currentTimeTable?.end_date == null ||
      currentTimeTable?.sectionMappingID == null
    ) {
      message.error('Please Select All Filters');
      setCreateLoading(false);
      return;
    }
    let payload = {
      start_date: currentTimeTable?.start_date,
      end_date: currentTimeTable?.end_date,
      sec_map: currentTimeTable?.sectionMappingID,
    };
    axios
      .post(`${endpoints.timeTableNewFlow.dateRangeSectionList}/`, payload)
      .then((res) => {
        if (res?.data?.status_code == 201) {
          message.success('Time table created successfully');
          setShowCreateModal(false);
          setTimeTableOverlapError(null);
          setCurrentTimeTable({
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            grade: [],
            section: [],
          });
          if (sectionMappingID) {
            fetchDateRangeList({ sec_map: sectionMappingID });
          }
        } else if (res?.data?.status_code == 409) {
          setTimeTableOverlapError(res?.data);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setCreateLoading(false);
      });
  };

  const handleDuplicateTimeTable = (record) => {
    setDuplicateLoading(true);
    axios
      .post(`${endpoints?.timeTableNewFlow?.duplicateTimeTable}/`, {
        start_date: duplicateData?.start_date,
        end_date: duplicateData?.end_date,
        sec_map: [duplicateData?.sec_map],
        id: duplicateData?.id,
      })
      .then((res) => {
        if (res.data?.status_code == 201) {
          message.success('Timetable duplicated successfully');
          fetchDateRangeList({ sec_map: sectionMappingID });
          setInnerExpandedRowKeys([]);
          handleCloseDuplicateModal();
        } else if (res.data?.status_code == 409) {
          message.error(res.data?.developer_msg);
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setDuplicateLoading(false);
      });
  };
  const fetchRangeSectionList = (params = {}) => {
    setSectionListLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.dateRangeSectionList}/`, { params: params })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setDateRangeSectionList(res?.data?.result);
        } else {
          setDateRangeSectionList([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setSectionListLoading(false);
      });
  };
  const handleEditPeriodTimings = () => {
    setEditPeriodLoading(true);
    axios
      .put(`${endpoints?.timeTableNewFlow?.periodSlots}/${selectedPeriod?.id}/`, {
        start_time: selectedPeriod?.start_time,
        end_time: selectedPeriod?.end_time,
      })
      .then((res) => {
        if (res?.status == 200) {
          message.success('Periods Timings updated successfully');
          fetchDayWisePeriods({
            start_date: currentDatePeriod?.start_date,
            end_date: currentDatePeriod?.end_date,
            sec_map: selectedSectionData?.sec_map,
          });
          handleCloseEditTimeModal();
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setEditPeriodLoading(false);
      });
  };
  const handleAssignPeriodDetails = () => {
    if (!selectedPeriod?.lecture_type) {
      message.error('Please select Lecture Type');
      return false;
    }

    if (!selectedPeriod?.sub_map.length > 0) {
      message.error('Please select subject');
      return false;
    }

    if (!selectedPeriod?.teacher?.length > 0) {
      message.error('Please select teacher');
      return false;
    }
    setEditPeriodLoading(true);
    axios
      .post(`${endpoints?.timeTableNewFlow?.sectionPeriodData}/`, selectedPeriod)
      .then((res) => {
        if (res.data?.status_code == 201) {
          message.success('Periods Details assigned successfully');
          fetchDayWisePeriods({
            start_date: currentDatePeriod?.start_date,
            end_date: currentDatePeriod?.end_date,
            sec_map: selectedSectionData?.sec_map,
          });
          handleClosePeriodDetailsModal();
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setEditPeriodLoading(false);
      });
  };
  const handleUpdatePeriod = (type) => {
    let payload = {
      week_day: Number(handleTexttoWeekDay(moment(selectedDate).format('dddd'))),
      sec_map: selectedSectionData?.sec_map,
      tt_id: selectedSectionData?.id,
      slot_id: selectedPeriodSlot?.id,
    };
    if (type == 'lecture') {
      payload['lecture_type'] = selectedPeriod?.lecture_type;
    } else if (type == 'subject') {
      payload['sub_map'] = selectedPeriod?.sub_map;
    } else if (type == 'teacher') {
      payload['teacher'] = selectedPeriod?.teacher;
    }
    setEditPeriodLoading(true);
    axios
      .patch(
        `${endpoints?.timeTableNewFlow?.sectionPeriodData}/${selectedPeriod?.id}/`,
        payload
      )
      .then((res) => {
        if (res.status == 200) {
          message.success('Periods Details updated successfully');
          fetchDayWisePeriods({
            start_date: currentDatePeriod?.start_date,
            end_date: currentDatePeriod?.end_date,
            sec_map: selectedSectionData?.sec_map,
          });
          if (type == 'lecture') {
            handleCloseEditLectureModal();
          } else if (type == 'subject') {
            handleCloseEditSubjectModal();
          } else if (type == 'teacher') {
            handleCloseEditTeacherModal();
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setEditPeriodLoading(false);
      });
  };

  const AttachmentDownload = (data, filename, isExcel) => {
    const FileType = isExcel
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      : 'application/pdf;base64';
    const blob = new Blob([data], {
      type: FileType,
    });
    FileSaver.saveAs(blob, filename);
  };
  const handleAttachmentDownload = (params = {}) => {
    if (params?.excel) {
      setExcelLoading(true);
    } else {
      setPDFLoading(true);
    }
    axios
      .get('/acad-tt/excel/', {
        params: { ...params },
        responseType: 'blob',
      })
      .then((response) => {
        let file = `TimeTable_${currentDatePeriod?.start_date}-${currentDatePeriod?.end_date}_${selectedSectionData?.grade_sec?.grade}-${selectedSectionData?.grade_sec?.section}`;
        let fullName = `${file}.${params?.excel ? 'xlsx' : 'pdf'}`;
        AttachmentDownload(response?.data, fullName, params?.excel ? true : false);
      })
      .catch((e) => {
        message.error(e.message);
      })
      .finally(() => {
        setExcelLoading(false);
        setPDFLoading(false);
      });
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
      title:
        dateRangeSectionList.length > 0 ? (
          <span className='th-white th-fw-700'>Allocation Status</span>
        ) : null,
      // dataIndex: 'allocation_status',
      width: '15%',
      align: 'center',
    },
    {
      title:
        dateRangeSectionList.length > 0 ? (
          <span className='th-white th-fw-700'>Created On</span>
        ) : null,
      // dataIndex: 'created_on',
      width: '15%',
      align: 'center',
      // render: (data) => <span>{moment(data).format('DD-MM-YYYY')}</span>,
    },
    {
      title:
        dateRangeSectionList.length > 0 ? (
          <span className='th-white th-fw-700'>Status</span>
        ) : null,
      // dataIndex: 'status',
      width: '15%',
      align: 'center',
      // render: (data) => (
      //   <span>
      //     <Switch checked={data} />
      //   </span>
      // ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      align: 'center',
      width: '20%',
      render: (record) => (
        <Space size=''>
          <Popconfirm
            placement='bottomRight'
            title={'Are you sure you want to delete this item?'}
            onConfirm={() => handleDeleteRecord(record.id)}
            okText='Yes'
            cancelText='No'
            okButtonProps={{ loading: deleteLoading }}
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
        <div
          className='d-flex text-left flex-column'
          onClick={() => {
            handleShowEditTimeModal(row);
          }}
        >
          <div className='th-fw-500 th-18'>{row?.period_name}</div>
          <div>
            <span>{moment(row?.start_time, 'hh:mm A').format('hh:mm A')}</span> -
            <span className='mr-1'>
              {moment(row?.end_time, 'hh:mm A').format('hh:mm A')}
            </span>
            <EditFilled className='th-pointer' />
          </div>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Lecture Type</span>,

      align: 'center',
      render: (text, row) => (
        <span
          className='th-pointer'
          onClick={() => {
            if (row.periods.length > 0) {
              handleShowEditLectureModal(row?.periods[0]);
              setSelectedPeriodSlot(row);
            } else {
              handleShowPeriodDetailsModal({
                period_slot: row?.id,
                period_name: row?.period_name,
              });
            }
          }}
        >
          {row?.periods?.[0]?.lecture_type ? (
            <span>
              {' '}
              {
                LectureTypeChoices.filter(
                  (el) => el?.id == row?.periods?.[0]?.lecture_type
                )[0]?.type
              }{' '}
              <EditFilled className='pl-2' />
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
          onClick={() => {
            if (row.periods.length > 0) {
              handleShowEditSubjectModal({
                ...row?.periods[0],
                sub_map: row?.periods[0]?.sub?.map((item) => item.id),
              });
              setSelectedPeriodSlot(row);
            } else {
              handleShowPeriodDetailsModal({
                period_slot: row?.id,
                period_name: row?.period_name,
              });
            }
          }}
          title={
            row?.periods?.[0]?.sub.length > 0
              ? row?.periods?.[0]?.sub?.map((el) => el?.subject_name).join(',')
              : null
          }
        >
          {' '}
          +{' '}
          {row?.periods?.[0]?.sub.length > 0
            ? row?.periods?.[0]?.sub?.map((el) => el?.subject_name).join(',')
            : 'Add'}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Teacher</span>,
      dataIndex: 'sub_teacher',
      align: 'center',
      ellipsis: true,
      render: (data) => <span>+{data?.join(',')}</span>,
      render: (text, row) => (
        <span
          className='th-pointer'
          onClick={() => {
            if (row.periods.length > 0) {
              handleShowEditTeacherModal({
                ...row?.periods[0],
                teacher: row?.periods[0]?.sub_teacher?.map((item) => item.id),
              });
              setSelectedPeriodSlot(row);
            } else {
              handleShowPeriodDetailsModal({
                period_slot: row?.id,
                period_name: row?.period_name,
              });
            }
          }}
          title={
            row?.periods?.[0]?.sub_teacher?.length > 0
              ? row?.periods?.[0]?.sub_teacher.map((el) => el?.name)?.join(',')
              : null
          }
        >
          {' '}
          +{' '}
          {row?.periods?.[0]?.sub_teacher?.length > 0
            ? row?.periods?.[0]?.sub_teacher.map((el) => el?.name)?.join(',')
            : 'Add'}
        </span>
      ),
    },
  ];

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    setDateRangeSectionList([]);
    setInnerExpandedRowKeys([]);
    setPeriodListData([]);
    setSelectedDate(null);
    setSelectedSectionData(null);
    setCurrentDayPeriodData([]);
    setCurrentDatePeriod({
      start_date: record?.start_date,
      end_date: moment(record?.start_date).add(6, 'days').format('YYYY-MM-DD'),
    });
    if (expanded) {
      fetchRangeSectionList({
        start_date: record?.start_date,
        end_date: record?.end_date,
      });
      keys.push(record.id);
    }

    setExpandedRowKeys(keys);
  };
  const onInnerTableRowExpand = (expanded, record) => {
    const keys = [];
    setInnerExpandedRowKeys([]);
    setPeriodListData([]);
    setSelectedDate(null);
    setSelectedSectionData(null);
    setCurrentDayPeriodData([]);
    if (expanded) {
      setSelectedSectionData(record);
      fetchDayWisePeriods({
        start_date: currentDatePeriod?.start_date,
        end_date: currentDatePeriod?.end_date,
        sec_map: record?.sec_map,
      });
      fetchSubjectList({
        section_mapping: record?.sec_map,
        session_year: selectedAcademicYear?.id,
      });

      keys.push(record.id);
    }

    setInnerExpandedRowKeys(keys);
  };

  const handleToggle = (rec) => {
    setLoading(true);
    console.log(rec, 'eventtoggle');

    axios
      .patch(`${endpoints?.timeTableNewFlow?.activeToggle}/${rec?.id}/`, {
        active: rec?.is_active ? false : true,
      })
      .then((res) => {
        if (res.data?.status_code == 200) {
          setLoading(false);

          message.success('Status Updated successfully');
          fetchRangeSectionList({
            start_date: rec?.start_date,
            end_date: rec?.end_date,
          });
        } else {
          message.error('Failed to Update Status');
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };
  const expandedRowRender = (record) => {
    const sectionListColumns = [
      {
        dataIndex: 'grade_sec',
        align: 'center',
        width: tableWidthCalculator(30) + '%',
        render: (data) => (
          <span className='th-black-2'>
            {data?.grade} &nbsp;
            {data?.section}
          </span>
        ),
      },
      {
        dataIndex: 'status',
        align: 'center',
        width: '15%',
        render: (data, record) => (
          <span className='th-black-2'>
            {record?.status == 1
              ? 'Partially Allocated'
              : record?.status == 2
              ? 'Allocated'
              : ''}
          </span>
        ),
      },
      {
        dataIndex: 'created_at',
        align: 'center',
        width: '15%',
        render: (data) => (
          <span className='th-black-2'>{moment(data).format('DD-MM-YYYY')}</span>
        ),
      },
      {
        dataIndex: 'is_active',
        align: 'center',
        width: '15%',
        render: (data, record) => (
          <span>
            <Switch
              checked={record?.is_active ? true : false}
              onChange={() => handleToggle(record)}
            />
          </span>
        ),
      },
      {
        dataIndex: 'Actions',
        align: 'center',
        width: '20%',
        render: (text, record) => {
          return (
            <Tag
              icon={<EditFilled />}
              color='processing'
              className='th-pointer th-br-4'
              onClick={() => {
                setDuplicateData(record);
                handleViewDuplicateModal();
              }}
            >
              Duplicate
            </Tag>
          );
        },
      },
    ];

    return (
      <div className='d-flex justify-content-center'>
        <Table
          columns={sectionListColumns}
          dataSource={dateRangeSectionList}
          rowKey={(record) => record?.id}
          pagination={false}
          expandable={{
            expandedRowRender: innerExpandedRowRender,
            expandedRowKeys: innerExpandedRowKeys,
            onExpand: onInnerTableRowExpand,
          }}
          showHeader={false}
          loading={sectionListLoading}
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
  const innerExpandedRowRender = (record) => {
    return (
      <div className='row th-bg-grey p-2 th-br-4' style={{ border: '1px solid #d9d9d9' }}>
        <div className='col-12'>
          <div
            className='d-flex justify-content-between pb-2 align-items-center'
            style={{ borderBottom: '2px solid #d9d9d9' }}
          >
            <div className=' d-flex align-items-center th-fw-700'>
              <span className='mx-2'>
                <StepBackwardOutlined
                  title='Previous Week'
                  className='th-24 th-pointer'
                  onClick={() => {
                    setSelectedDate(null);
                    const newStartDate = moment(currentDatePeriod?.start_date)
                      .subtract(7, 'days')
                      .format('YYYY-MM-DD');

                    const newEndDate = moment(currentDatePeriod?.end_date)
                      .subtract(7, 'days')
                      .format('YYYY-MM-DD');
                    setCurrentDatePeriod({
                      start_date: newStartDate,
                      end_date: newEndDate,
                    });
                    fetchDayWisePeriods({
                      start_date: newStartDate,
                      end_date: newEndDate,
                      sec_map: selectedSectionData?.sec_map,
                    });
                  }}
                />
              </span>
              <span>
                {moment(currentDatePeriod?.start_date).format('Do MMM')}-
                {moment(currentDatePeriod?.start_date)
                  .add(6, 'days')
                  .format('Do MMM, YYYY')}
              </span>
            </div>
            <div className=' d-flex align-items-center th-fw-600'>
              <span>BTM Time Slot 1</span>
              <span className='mx-2'>
                <StepForwardOutlined
                  title='Next Week'
                  className='th-24 th-pointer'
                  onClick={() => {
                    setSelectedDate(null);

                    const newStartDate = moment(currentDatePeriod?.start_date)
                      .add(7, 'days')
                      .format('YYYY-MM-DD');

                    const newEndDate = moment(currentDatePeriod?.end_date)
                      .add(7, 'days')
                      .format('YYYY-MM-DD');
                    setCurrentDatePeriod({
                      start_date: newStartDate,
                      end_date: newEndDate,
                    });

                    fetchDayWisePeriods({
                      start_date: newStartDate,
                      end_date: newEndDate,
                      sec_map: selectedSectionData?.sec_map,
                    });
                  }}
                />
              </span>
            </div>
          </div>

          <div className='d-flex justify-content-between mt-2'>
            {periodListData?.map((item, index) => {
              let currentWeekday = moment(currentDatePeriod?.start_date)
                .add(item?.week_days, 'days')
                .format('dddd');
              let currentDate = moment(currentDatePeriod?.start_date)
                .add(item?.week_days, 'days')
                .format('YYYY-MM-DD');
              return (
                <div
                  className={`d-flex flex-column th-bg-grey p-2 th-br-4 text-center th-pointer ${
                    currentDate === selectedDate
                      ? 'th-button-active th-fw-600'
                      : 'th-button th-fw-500'
                  }`}
                  onClick={() => {
                    setSelectedDate(
                      moment(currentDatePeriod?.start_date)
                        .add(item?.week_days, 'days')
                        .format('YYYY-MM-DD')
                    );
                    let currentData = periodListData.find(
                      (el) => el?.week_days == handleTexttoWeekDay(currentWeekday)
                    );
                    setCurrentDayPeriodData(currentData?.period_slot);
                  }}
                >
                  <div>
                    {moment(currentDatePeriod?.start_date)
                      .add(item?.week_days, 'days')
                      .format('Do MMM')}
                  </div>
                  <div>
                    {moment(currentDatePeriod?.start_date)
                      .add(item?.week_days, 'days')
                      .format('dddd')}
                  </div>
                </div>
              );
            })}
          </div>
          <div className='mt-2'>
            <Table
              columns={periodTableColumn}
              className='th-table'
              rowKey={(record) => record?.id}
              dataSource={currentDayPeriodData}
              pagination={false}
              loading={periodListLoading}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              scroll={{ y: 350 }}
            />
          </div>
          <div className='d-flex mt-2'>
            <Button
              type='primary'
              className='th-br-4'
              loading={excelLoading}
              icon={<FileExcelOutlined />}
              onClick={() => {
                handleAttachmentDownload({
                  start_date: currentDatePeriod?.start_date,
                  end_date: currentDatePeriod?.end_date,
                  sec_map: selectedSectionData?.sec_map,
                  excel: true,
                });
              }}
            >
              Export (CSV)
            </Button>
            <Button
              type='primary'
              className=' th-br-4 ml-2'
              loading={PDFLoading}
              icon={<FilePdfOutlined />}
              onClick={() => {
                handleAttachmentDownload({
                  start_date: currentDatePeriod?.start_date,
                  end_date: currentDatePeriod?.end_date,
                  sec_map: selectedSectionData?.sec_map,
                });
              }}
            >
              Download (PDF)
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const fetchSubjectList = (params = {}) => {
    axios
      .get(`/erp_user/v2/mapped-subjects-list/`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setSubjectList(result?.data?.result);
        } else {
          setSubjectList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const fetchTeacherList = (params = {}) => {
    axios
      .get(`${endpoints?.timeTableNewFlow?.teacherList}/`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setTeacherList(result?.data?.result);
        } else {
          setTeacherList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  useEffect(() => {
    if (showTab == '3') {
      setGradeID();
      setSectionMappingID();
      setSectionList([]);
      setAvailableDateRangesData([]);
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
      });
    }
  }, [showTab]);

  return (
    <div>
      <React.Fragment>
        <div className='row mt-2 align-items-center'>
          <div className='col-md-3 py-2'>
            <div className='th-fw-600 pb-2'>Select Grade</div>
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

        <div className='col-12 py-3'>
          {availableDateRangesData.length > 0 ? (
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={availableDateRangesData}
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
          ) : (
            <div className='text-center py-5'>
              <span className='th-25 th-fw-500'>
                Please select the filters to show data!
              </span>
            </div>
          )}
        </div>
        {/* Create Time Table Modal */}
        <Modal
          visible={showCreateModal}
          centered
          className='th-upload-modal'
          title='Create New Time Table'
          onCancel={() => {
            setShowCreateModal(false);
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  setShowCreateModal(false);
                }}
              >
                Close
              </Button>
              <Button
                type='primary'
                loading={createLoading}
                onClick={() => {
                  handleAssignDateRange();
                }}
              >
                Create
              </Button>
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
                    mode='multiple'
                    suffixIcon={<DownOutlined />}
                    showArrow={true}
                    onChange={(e) => {
                      setCurrentTimeTable({
                        ...currentTimeTable,
                        section: null,
                        grade: e,
                      });
                      setCreationSectionList([]);
                      fetchSectionData(
                        selectedAcademicYear?.id,
                        selectedBranch?.branch?.id,
                        e,
                        false
                      );
                    }}
                    placeholder='Grade *'
                    allowClear
                    maxTagCount={2}
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
                    mode='multiple'
                    suffixIcon={<DownOutlined />}
                    showArrow={true}
                    onChange={(e) =>
                      setCurrentTimeTable({
                        ...currentTimeTable,
                        // sectionID: each?.value,
                        sectionMappingID: e,
                      })
                    }
                    placeholder='Section *'
                    allowClear
                    showSearch
                    maxTagCount={2}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={currentTimeTable?.sectionMappingID}
                  >
                    {creationSectionOptions}
                  </Select>
                </div>
              </div>
            </div>
            {timeTableOverlapError && (
              <div className='col-12 py-2'>
                <div className='th-red th-14 th-fw-500'>
                  {timeTableOverlapError?.developer_msg}
                </div>
                <div className='th-red th-fw-500'>
                  {timeTableOverlapError?.sections
                    .map((el) => el?.grade + ' ' + el?.section)
                    .join(',')}
                </div>
              </div>
            )}
          </div>
        </Modal>
        {/* Duplicate Time table Modal */}
        <Modal
          visible={showDuplicateModal}
          centered
          className='th-upload-modal'
          title='Duplicate Time Table'
          onCancel={() => {
            handleCloseDuplicateModal();
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  handleCloseDuplicateModal();
                }}
              >
                Close
              </Button>
              <Button
                type='primary'
                loading={duplicateLoading}
                onClick={() => {
                  handleDuplicateTimeTable();
                }}
              >
                Create
              </Button>
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
                      moment(duplicateData?.start_date, 'YYYY-MM-DD'),
                      moment(duplicateData?.end_date, 'YYYY-MM-DD'),
                    ]}
                    onChange={(e) => {
                      const startDate = moment(e[0]).format('YYYY-MM-DD');
                      const endDate = moment(e[1]).format('YYYY-MM-DD');
                      setDuplicateData({
                        ...duplicateData,
                        start_date: startDate,
                        end_date: endDate,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {timeTableOverlapError && (
              <div className='col-12 py-2'>
                <div className='th-red th-14 th-fw-500'>
                  {timeTableOverlapError?.developer_msg}
                </div>
                <div className='th-red th-fw-500'>
                  {timeTableOverlapError?.sections
                    .map((el) => el?.grade + ' ' + el?.section)
                    .join(',')}
                </div>
              </div>
            )}
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
              <Button
                type='primary'
                loading={editPeriodLoading}
                onClick={() => handleEditPeriodTimings()}
              >
                Update
              </Button>
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
                      inputReadOnly
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
                      inputReadOnly
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
              <Button
                type='primary'
                loading={editPeriodLoading}
                onClick={() => {
                  handleUpdatePeriod('lecture');
                }}
              >
                Update
              </Button>
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
                    {LectureTypeChoices?.map((el) => {
                      return (
                        <Option value={el?.id} key={el?.id}>
                          {el?.type}
                        </Option>
                      );
                    })}
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
              <Button
                type='primary'
                loading={editPeriodLoading}
                onClick={() => {
                  handleUpdatePeriod('subject');
                }}
              >
                Update
              </Button>
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
                    onChange={(e, each) => {
                      setSelectedPeriod({ ...selectedPeriod, sub_map: e });
                      fetchTeacherList({
                        sec_map: selectedSectionData?.sec_map,
                        subject: each?.map((item) => item?.subjectId)?.join(','),
                      });
                    }}
                    placeholder='Select Subjects'
                    allowClear
                    mode='multiple'
                    suffixIcon={<DownOutlined />}
                    showArrow={true}
                    maxTagCount={2}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={selectedPeriod?.sub_map}
                  >
                    {subjectOptions}
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
              <Button
                type='primary'
                loading={editPeriodLoading}
                onClick={() => {
                  handleUpdatePeriod('teacher');
                }}
              >
                Update
              </Button>
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
                    mode='multiple'
                    suffixIcon={<DownOutlined />}
                    showArrow={true}
                    maxTagCount={2}
                    onChange={(e) => {
                      setSelectedPeriod({ ...selectedPeriod, teacher: e });
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
                    value={selectedPeriod?.teacher}
                  >
                    {teacherOptions}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Assign Subject Periods Modal */}
        <Modal
          visible={showAssignPeriodDetailsModal}
          centered
          className='th-upload-modal'
          title='Assign Period Details'
          onCancel={() => {
            handleClosePeriodDetailsModal();
          }}
          footer={
            <div className='row justify-content-end'>
              <Button
                type='default'
                onClick={() => {
                  handleClosePeriodDetailsModal();
                }}
              >
                Close
              </Button>
              <Button
                type='primary'
                loading={editPeriodLoading}
                onClick={() => {
                  handleAssignPeriodDetails();
                }}
              >
                Assign
              </Button>
            </div>
          }
        >
          <div className='row p-3'>
            <div className='col-12'>
              <div className='th-black d-flex th-fw-700 th-20 mb-2'>
                {selectedPeriod?.period_name}
              </div>
              <div className='row justify-content-between align-items-center pb-2'>
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
                    {LectureTypeChoices?.map((el) => {
                      return (
                        <Option value={el?.id} key={el?.id}>
                          {el?.type}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>

              <div className='row justify-content-between align-items-center pb-2'>
                <div className='th-fw-500 col-4 pl-0'>Select Subjects</div>
                <div className='col-8'>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e, each) => {
                      setSelectedPeriod({
                        ...selectedPeriod,
                        sub_map: each?.map((item) => item?.value),
                      });
                      fetchTeacherList({
                        sec_map: selectedSectionData?.sec_map,
                        subject: each?.map((item) => item?.subjectId)?.join(','),
                      });
                    }}
                    placeholder='Select Subjects'
                    allowClear
                    mode='multiple'
                    suffixIcon={<DownOutlined />}
                    showArrow={true}
                    maxTagCount={2}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={selectedPeriod?.sub_map ?? []}
                  >
                    {subjectOptions}
                  </Select>
                </div>
              </div>

              <div className='row justify-content-between align-items-center'>
                <div className='th-fw-500 col-4 pl-0'>Select Teachers</div>
                <div className='col-8'>
                  <Select
                    className='th-width-100 th-br-6'
                    mode='multiple'
                    suffixIcon={<DownOutlined />}
                    showArrow={true}
                    maxTagCount={2}
                    onChange={(e) => {
                      setSelectedPeriod({ ...selectedPeriod, teacher: e });
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
                    value={selectedPeriod?.teacher ?? []}
                  >
                    {teacherOptions}
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
