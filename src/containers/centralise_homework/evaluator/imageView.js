import {
  CheckSquareFilled,
  CloseSquareFilled,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  HistoryOutlined,
  IeSquareFilled,
  PlusCircleOutlined,
  SearchOutlined,
  SmileFilled,
  StopFilled,
  StopOutlined,
  UpOutlined,
  XOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Form,
  Pagination,
  Popconfirm,
  Result,
  Select,
  Table,
  message,
  DatePicker,
} from 'antd';
import { Input, Space } from 'antd';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { fetchBranchesForCreateUser } from 'redux/actions';
import axiosInstance from 'v2/config/axios';
import axios from 'axios';
import FileSaver from 'file-saver';
import FilesViewEvaluate from './fileViewEvaluate';
import './index.scss';
import {
  CheckBoxOutlineBlank,
  CropSquareSharp,
  SquareFoot,
  SquareFootRounded,
} from '@material-ui/icons';
import Loader from '../../../components/loader/loader';
import moment from 'moment';

const { RangePicker } = DatePicker;

const EvaluatorHomework = () => {
  const history = useHistory();
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState('');
  const [userLevelList, setUserLevelList] = useState([]);
  const [userLevel, setUserLevel] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [sectionMappingId, setSectionMappingId] = useState('');
  const [status, setStatus] = useState('');

  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const [volumeList, setVolumeList] = useState([]);
  const [volume, setVolume] = useState('');
  const [dates, setDates] = useState(null);

  const [subjectList, setSubjectList] = useState([]);
  const [subject, setSubject] = useState('');

  const dateFormat = 'DD-MM-YYYY';
  let defaultStartDate = moment().subtract(6, 'days');
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate.format('DD-MM-YYYY'));
  const [endDate, setEndDate] = useState(moment().format('DD-MM-YYYY'));

  const [evaluateData, setEvaluateData] = useState([]);
  const [countData, setCountData] = useState(null);
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);

  const handleFilters = () => {
    if (showFilters) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  };

  const formRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchGrade(selectedBranch?.branch?.id);
  }, [selectedBranch]);

  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleChangeGrade = (each) => {
    setPageNo(1);
    if (each) {
      setGrade(each?.value);
      fetchSection(each?.value);
    }
  };

  const handleClearGrade = () => {
    setGrade('');
    setSection('');
    setSectionMappingId('');
    setSectionList([]);
    setSubjectList([]);
    setSubject('');
    formRef.current.setFieldsValue({
      grade: null,
      section: null,
      subject: null,
    });
    setEvaluateData([]);
  };
  const fetchSection = async (grade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedYear.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
      );
      if (result.data.status_code === 200) {
        setSectionList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.sec_id}>
        {each?.sec_name}
      </Option>
    );
  });

  const fetchVolumeData = () => {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setVolumeList(result?.data?.result?.results);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const volumeOptions = volumeList?.map((each) => (
    <Select.Option key={each?.id} value={each?.id}>
      {each?.volume_name}
    </Select.Option>
  ));

  const fetchSubjectList = async (sectionId) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.centralizedHomework.subjectList}?session_year=${selectedYear.id}&branch=${selectedBranch?.branch?.id}&grade=${grade}&section=${sectionId}`,
        {
          headers: {
            Authorization: `Bearer ${loggedUserData?.token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        setSubjectList(result?.data?.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const subjectListOptions = subjectList?.map((each) => (
    <Select.Option key={each?.id} value={each?.subject_mapping_id}>
      {each?.sub_name}
    </Select.Option>
  ));

  const fetchTeacherData = async (params = {}) => {
    if (!subject) {
      return message.error('Please Select Filters !');
    }
    if (!startDate) {
      return message.error('Please Select Start Date !');
    }
    if (!endDate) {
      return message.error('Please Select End Date !');
    }
    setLoading(true);
    try {
      const result = await axiosInstance.get(
        `${endpoints.homework.teacherData}`,
        {
          params: { ...params },
        },
        {
          headers: {
            Authorization: `Bearer ${loggedUserData?.token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        setEvaluateData(result?.data?.result?.results);
        setCountData(result?.data?.result);
        setTotalPage(result?.data?.result?.count);
        setPageLimit(result?.data?.result?.limit);
        setLoading(false);
      } else {
        message.error(result.data.message);
        setLoading(false);
      }
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const handleChangeSection = (each) => {
    if (each) {
      setPageNo(1);
      const section = each?.value;
      setSectionMappingId(each?.key);
      setSection(section);
      fetchSubjectList(section);
      setSubject('');
      formRef.current.setFieldsValue({
        subject: null,
      });
    }
  };

  const handleClearSection = () => {
    setSection([]);
    setSectionMappingId('');
    setSubject('');
    setSubjectList([]);
    formRef.current.setFieldsValue({
      subject: null,
    });
    setEvaluateData([]);
  };

  const handleChangeVolume = (each) => {
    if (each) {
      setVolume(each);
    } else {
      setVolume('');
    }
  };

  const handleChangeSubject = (each) => {
    if (each) {
      setSubject(each);
    } else {
      setSubject('');
      formRef.current.setFieldsValue({
        subject: null,
      });
      setEvaluateData([]);
    }
  };

  // const handleDateChange = (each) => {
  //   if (each) {
  //     setStartDate(moment(each[0]).format(dateFormat));
  //     setEndDate(moment(each[1]).format(dateFormat));
  //     setDate([moment(each[0]), moment(each[1])]);
  //     setPageNo(1);
  //   } else {
  //     setStartDate(null);
  //     setEndDate(null);
  //     setDate(null);
  //     setEvaluateData([]);
  //   }
  // };

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('DD-MM-YYYY'));
      setEndDate(moment(value[1]).format('DD-MM-YYYY'));
      setDates(value);
      setPageNo(1);
    } else {
      setEvaluateData([]);
      setStartDate(null);
      setEndDate(null);
      setDates(null);
    }
  };

  const onOpenChange = (open) => {
    if (open) {
      setStartDate(null);
      setEndDate(null);
      setDates([null, null]);
      formRef.current.setFieldsValue({
        date: [null, null],
      });
    } else {
      setDates(null);
    }
  };

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;

    return !!tooEarly || !!tooLate;
  };

  return (
    <React.Fragment>
      {/* <Layout>
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Evaluate Homework
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div> */}

      {loading && <Loader />}
      {/* <div className='row'>
        <div className='col-md-12'>*/}
      <div className='px-3'>
        <div className='col-md-12 p-0 d-flex justify-content-end'>
          {showFilters ? (
            <div>
              <Button
                icon={<UpOutlined />}
                onClick={handleFilters}
                type='dashed'
                size='small'
              >
                Collapse{' '}
              </Button>
            </div>
          ) : (
            <div>
              <Button
                icon={<DownOutlined />}
                onClick={handleFilters}
                type='dashed'
                size='small'
              >
                Expand
              </Button>
            </div>
          )}
        </div>
        {showFilters && (
          <div className='row' style={{ borderBottom: '1px solid #d6d6d6' }}>
            <Form
              id='filterForm'
              // className='mt-3'
              layout={'vertical'}
              ref={formRef}
              style={{ width: '100%' }}
            >
              <div className='row justify-content-between'>
                <div className='col-xl-7 col-md-6 row'>
                  <div className='col-xl-4 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Grade</div>

                    <Form.Item name='grade'>
                      <Select
                        // mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeGrade(value)}
                        onClear={handleClearGrade}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Grade'
                      >
                        {gradeOptions}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='col-xl-4 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Section</div>

                    <Form.Item name='section'>
                      <Select
                        // mode='multiple'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeSection(value)}
                        onClear={handleClearSection}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select section'
                      >
                        {sectionOptions}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='col-xl-4 col-md-4 col-sm-6 col-12 pl-0'>
                    <div className='mb-2 text-left'>Subject</div>
                    <Form.Item name='subject'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e) => handleChangeSubject(e)}
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Subject'
                      >
                        {subjectListOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-xl-4 col-md-4 col-sm-6 col-12 pl-0'>
                    <Form.Item name="date">
                      <RangePicker
                        className='th-width-100 th-br-4'
                        onCalendarChange={(value) => handleDateChange(value)}
                        onOpenChange={onOpenChange}
                        defaultValue={dates || [moment().subtract(6, 'days'), moment()]}
                        format={dateFormat}
                        disabledDate={disabledDate}
                        separator={'to'}
                      />
                    </Form.Item>
                  </div>

                  <div className='col-xl-4 col-md-4 col-sm-6 col-12 pl-0'>
                    <Form.Item name='section'>
                      <Button
                        className=' th-br-4 w-100  th-select'
                        type='primary'
                        onClick={() => {
                          fetchTeacherData({
                            // is_assessed: 'False',
                            start_date: startDate,
                            end_date: endDate,
                            sub_sec_mpng: subject,
                            page: pageNo,
                          });
                        }}
                      >
                        Filter
                      </Button>
                    </Form.Item>
                  </div>
                </div>
                <div className='col-md-5 col-xl-3  p-0 row mb-2'>
                  <div
                    className='col-md-12 py-2 mt-2'
                    style={{
                      boxShadow:
                        'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                      borderRadius: '10px',
                      marginBottom: '5px',
                      height: 'fit-content',
                    }}
                  >
                    <div
                      className='col-md-12 row justify-content-between th-13'
                      style={{ marginTop: '6px' }}
                    >
                      <div>
                        <span>
                          Completed :{' '}
                          <span style={{ color: 'green' }}>
                            {countData?.total_assessed ? countData?.total_assessed : '-'}
                          </span>{' '}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <span>Completed </span>
                        <span
                          style={{
                            backgroundColor: 'green',
                            color: 'white',
                            height: '15px',
                            width: '15px',
                            borderRadius: '5px',
                            display: 'inline-block',
                            marginLeft: '20px',
                          }}
                        ></span>
                      </div>
                    </div>
                    <div
                      className='col-md-12 row justify-content-between th-13'
                      style={{ marginTop: '6px' }}
                    >
                      <div>
                        <span>
                          Pending :{' '}
                          <span style={{ color: 'red' }}>
                            {countData?.total_under_assessed
                              ? countData?.total_under_assessed
                              : '-'}
                          </span>
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <span>Pending </span>
                        <span
                          style={{
                            backgroundColor: 'red',
                            color: 'white',
                            height: '15px',
                            width: '15px',
                            borderRadius: '5px',
                            display: 'inline-block',
                            marginLeft: '20px',
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )}

        <div className='mt-4 '>
          {evaluateData?.length === 0 ? (
            <div className='col-12'>
              <Result
                status='warning'
                title={<span className='th-grey'>Please apply filter to view data</span>}
              />
            </div>
          ) : (
            <div className='mb-3'>
              <FilesViewEvaluate
                selectedHomeworkIndex={selectedHomeworkIndex}
                setSelectedHomeworkIndex={setSelectedHomeworkIndex}
                evaluateData={evaluateData}
                selectedGrade={grade}
                selectedSubSecMap={section}
                fetchTeacherData={fetchTeacherData}
                startDate={startDate}
                endDate={endDate}
                sub_sec_mpng={subject}
                sectionMappingId={sectionMappingId}
                page={pageNo}
              />

              <Pagination
                current={pageNo}
                total={totalPage}
                showSizeChanger={false}
                pageSize={pageLimit}
                onChange={(current) => {
                  setPageNo(current);
                  setSelectedHomeworkIndex(0);
                  fetchTeacherData({
                    // is_assessed: 'False',
                    start_date: startDate,
                    end_date: endDate,
                    sub_sec_mpng: subject,
                    page: current,
                  });
                }}
                className='text-center'
              />
            </div>
          )}
        </div>
      </div>
      {/*   </div>
      </div> */}
      {/* </Layout> */}
    </React.Fragment>
  );
};

export default EvaluatorHomework;
