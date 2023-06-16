import React, { useState, useEffect, useRef } from 'react';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import {
  Breadcrumb,
  message,
  Select,
  Input,
  Form,
  Button,
  Table,
  DatePicker,
  Upload,
  Tag,
} from 'antd';
import axios from 'v2/config/axios';
import axiosInstance from 'axios';
import endpoints from 'config/endpoints';
import moment from 'moment';
import { UserOutlined, DownOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { Option } = Select;
const initialColumns = [
  {
    title: <span className='th-white pl-4 th-fw-700 '>Sl No.</span>,
    align: 'center',
    fixed: 'left',
    render: (text, row, index) => (
      <span className='pl-md-4 th-black-1 th-16'>{index + 1}.</span>
    ),
  },
  {
    title: <span className='th-white th-fw-700'>ERP ID</span>,
    align: 'center',
    dataIndex: 'erp_id',
    fixed: 'left',
    render: (data) => <span className='th-black-1 th-16'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>NAME</span>,
    dataIndex: 'name',
    align: 'center',
    fixed: 'left',
    render: (data) => <span className='th-black-1 th-16'>{data}</span>,
  },
];
const ViewAttendance = () => {
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
  const [reportLoading, setReportLoading] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');
  const [userLevelList, setUserLevelList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedUserLevel, setSelectedUserLevel] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [gradeID, setGradeID] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionIDs, setSectionIDs] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [columns, setColumns] = useState(initialColumns);

  //   Functions
  const getAttendanceColor = (status) => {
    switch (status) {
      case 'present':
        return '#00ff00';
      case 'absent':
        return 'red';
      case 'late':
        return '#800080';
      case 'halfday':
        return '#4747d1';
      case 'H':
        return '#81c3b4';
      case 'NA':
        return 'rgb(118 94 111)';
    }
  };
  const handleMonthChange = (e) => {
    setSelectedMonth(moment(e));
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
    if (e) {
      setGradeID(e);
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade_id: e,
      });
    } else {
      setGradeID();
      setSectionData([]);
    }
  };
  const handleChangeSection = (each) => {
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionData.map((item) => item.section_id).join(',');
      setSectionIDs(allsections);
      formRef.current.setFieldsValue({
        section: sectionData.map((item) => item.section_id),
      });
    } else {
      setSectionIDs(each.map((item) => item.value).join(','));
    }
  };
  const handleClearSection = () => {
    setSectionIDs([]);
  };
  const handleDownloadReport = () => {
    setReportLoading(true);
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let userAttendanceData = [];
    attendanceData.map((item) =>
      userAttendanceData.push({
        'ERP ID': item.erp_id,
        Name: item.name,
        Branch: item.section_mapping__acad_session__branch__branch_name,
        Grade: item.section_mapping__grade__grade_name,
        Section: item.section_mapping__section__section_name,
        Role: item.roles__role_name,
      })
    );
    for (var i = 0; i <= attendanceData?.length; i++) {
      for (var j = 0; j < attendanceData[i]?.attendance?.length; j++) {
        var a = '-';
        if (attendanceData[i]?.attendance[j]?.attendence_status === 'present') a = 'P';
        else if (attendanceData[i]?.attendance[j]?.attendence_status === 'absent')
          a = 'A';
        else if (attendanceData[i]?.attendance[j]?.attendence_status === 'halfday')
          a = 'HD';
        else if (attendanceData[i]?.attendance[j]?.attendence_status === 'late') a = 'L';
        else if (attendanceData[i]?.attendance[j]?.attendence_status === 'holiday')
          a = 'H';

        userAttendanceData[i][attendanceData[i]?.attendance[j]?.date] = a;
      }
    }

    const ws = XLSX.utils.json_to_sheet(userAttendanceData);

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataX = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataX, 'Attendance_Report' + '.xlsx');
    setTimeout(() => {
      setReportLoading(false);
    }, 500);
  };

  //   API Calls
  const fetchUserLevelList = () => {
    axios
      .get(`/erp_user/central-user-level/`)
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
  const fetchAttendanceData = () => {
    if (!selectedUserLevel) {
      message.error('Please Select User Level');
      return false;
    }
    if (!gradeID) {
      message.error('Please Select Grade');
      return false;
    }
    // if (sectionsID.length == 0) {
    //   message.error('Please Select Section');
    //   return false;
    // }

    setLoading(true);
    // setRequestSent(true)
    // setDisableDownload(true);
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      month: moment(selectedMonth).month() + 1,
      year: moment(selectedMonth).year(),
      user_level: selectedUserLevel,
      grade_id: gradeID,
      section_id: sectionIDs.toString(),
    };
    axios
      .get(`${endpoints.academics.getTeacherAttendanceData}`, { params: { ...params } })
      .then((result) => {
        if (result.status === 200) {
          if (result.data.length > 0) {
            setAttendanceData(result?.data);
            let dateColumns = result?.data[0]?.attendance.map((el, i) => {
              return {
                title: (
                  <div className='text-center th-white pl-4 th-fw-700 '>
                    {moment(el?.date).format('DD MMM')} <br />
                    {moment(el?.date).format('dddd').substring(0, 3)}
                  </div>
                ),
                align: 'center',
                render: (text, row, index) => (
                  <span
                    className='pl-md-4 th-16 text-capitalize th-fw-500'
                    style={{
                      color: getAttendanceColor(row?.attendance[i]?.attendence_status),
                    }}
                  >
                    {row?.attendance[i]?.attendence_status === 'NA'
                      ? 'NA'
                      : row?.attendance[i]?.attendence_status === 'halfday'
                      ? 'HD'
                      : row?.attendance[i]?.attendence_status.substr(0, 1).toUpperCase()}
                  </span>
                ),
              };
            });
            setColumns([...initialColumns, ...dateColumns]);

            //     title: (
            //       <span className='th-white pl-4 th-fw-700 '>
            //         {moment(x).format('DD MMM')}
            //       </span>
            //     ),
            //     align: 'center',
            //     render: (text, row, index) => (
            //       <span className='pl-md-4 th-black-1 th-16'>
            //         {row?.attendance[index]?.attendence_status}.
            //       </span>
            //     ),
            //   });
            // });
          } else {
            setColumns(initialColumns);
          }
        }
      })
      .catch((error) => {
        message.error(error?.message);
      })
      .finally(() => {
        setLoading(false);
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
      <Option key={each?.section_id} value={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  //    useEffect
  useEffect(() => {
    fetchUserLevelList();
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Attendance' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'View Attendance') {
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

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey th-16'>Attendance</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              View Attendance
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-12 mt-3 '>
          <Form id='filterForm' ref={formRef} layout={'vertical'}>
            <div className='row align-items-center th-bg-white py-2'>
              <div className='col-md-2 col-6 '>
                <Form.Item name='month' label='Select Month'>
                  <DatePicker
                    picker='month'
                    defaultValue={moment(selectedMonth)}
                    format={'MMM ,YYYY'}
                    inputReadOnly={true}
                    allowClear={false}
                    className='th-date-picker th-width-100'
                    onChange={(e) => handleMonthChange(e)}
                  />
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 '>
                <Form.Item name='user_level' label='User Level'>
                  <Select
                    allowClear
                    placeholder='Select User Level*'
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
              <div className='col-md-2 col-6 '>
                <Form.Item name='section' label='Sections'>
                  <Select
                    placeholder='Select Sections'
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
              <div className='col-md-2 col-6'>
                <Button
                  className='th-bg-primary th-white th-br-4 mt-md-3 th-width-100'
                  loading={loading}
                  onClick={() => {
                    fetchAttendanceData();
                  }}
                >
                  Search
                </Button>
              </div>
              {attendanceData?.length > 0 && (
                <div className='col-md-2 col-6'>
                  <Button
                    className='th-bg-primary th-white th-br-4 mt-md-3 th-width-100'
                    loading={reportLoading}
                    onClick={() => {
                      handleDownloadReport();
                    }}
                  >
                    {!reportLoading && <CloudDownloadOutlined />}
                    Download Report
                  </Button>
                </div>
              )}
            </div>
          </Form>

          <div className='row th-bg-white justify-content-between align-items-center'>
            <div className='col-md-3'>
              <Input
                placeholder='Search User'
                className='th-br-4'
                onChange={(e) => setSearchedValue(e.target.value)}
                enterButton
                prefix={<UserOutlined className='pr-2' />}
              />
            </div>
            <div className='col-md-7 py-2 py-md-2'>
              <div className='d-flex justify-content-between flex-wrap'>
                <span style={{ color: '#ff944d' }}>Index : </span>
                <span style={{ color: '#00ff00' }}>P : Present</span>
                <span style={{ color: 'red' }}>A : Absent </span>
                <span style={{ color: '#800080' }}> L : Late </span>
                <span style={{ color: '#4747d1' }}> HD : Half Day</span>
                <span style={{ color: '#81c3b4' }}> H : Holiday </span>
                <span style={{ color: 'rgb(118 94 111)' }}> NA : Yet to Mark </span>
              </div>
            </div>
          </div>

          <div className='row py-3 th-bg-white'>
            <div className='col-12 pb'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                pagination={false}
                columns={columns}
                rowKey={(record) => record?.id}
                dataSource={attendanceData.filter(
                  (item) =>
                    item.name.toLowerCase().includes(searchedValue.toLowerCase()) ||
                    item.erp_id.toLowerCase().includes(searchedValue.toLowerCase())
                )}
                scroll={{ x: attendanceData.length > 0 ? 'max-content' : null }}
              />
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </Layout>
  );
};

export default ViewAttendance;
