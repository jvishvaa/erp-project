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
  const [status, setStatus] = useState('');

  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  // const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  //eslint-disable-next-line
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState('');
  const [searchData, setSearchData] = useState('');
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [volumeList, setVolumeList] = useState([]);
  const [volume, setVolume] = useState('');

  const [subjectList, setSubjectList] = useState([]);
  const [subject, setSubject] = useState('');

  const dateFormat = "DD-MM-YYYY"

  const [date, setDate] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const handleFilters = () => {
    if (showFilters) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  };

  const formRef = useRef();
  const searchRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchGrade(selectedBranch?.branch?.id);
  }, [selectedBranch]);

  const fetchUserLevel = async () => {
    try {
      const result = await axios.get(endpoints.userManagement.userLevelList, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      });
      if (result.status === 200) {
        setUserLevelList(result?.data?.result);
      } else {
        message.error(result?.data?.message);
      }
    } catch (error) {
      message.error(error?.message);
    }
  };

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
    if (each.some((item) => item.value === 'all')) {
      const allGrade = gradeList.map((item) => item.grade_id).join(',');
      setGrade(allGrade);
      fetchSection(allGrade);
      setSection([]);
      formRef.current.setFieldsValue({
        grade: gradeList.map((item) => item.grade_id),
        section: [],
      });
    } else {
      const singleGrade = each.map((item) => item.value).join(',');
      setGrade(singleGrade);
      fetchSection(singleGrade);
      setSection([]);
      formRef.current.setFieldsValue({
        section: [],
      });
    }
  };

  const handleClearGrade = () => {
    setGrade([]);
    setSection('');
    setSectionList([]);
    setVolumeList([]);
    setVolume('');
    setSubjectList([]);
    setSubject('');
    setDate(null)
    setStartDate(null)
    setEndDate(null)
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
      volume: [],
      subject: [],
      date : null,
    });
  };
  console.log(startDate, endDate, "coming")
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
        {each?.section__section_name}
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
        `${endpointsV2.academics.subjects}?session_year=${selectedYear.id}&branch=${selectedBranch?.branch?.id}&grade=${grade}&section=${sectionId}`,
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

  const fetchTeacherData = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.homework.teacherData}?is_assessed=False&start_date=${startDate}&end_date=${endDate}&sub_sec_mpng=${subject}`,
        {
          headers: {
            Authorization: `Bearer ${loggedUserData?.token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        console.log(result?.data)
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleChangeSection = (each) => {
    setPageNo(1);
    if (each.some((item) => item.value === 'all')) {
      const allsections = sectionList?.map((item) => item.id).join(',');
      setSection(allsections);
      formRef.current.setFieldsValue({
        section: sectionList?.map((item) => item.id),
      });
      fetchSubjectList(allsections);
    } else {
      const section = each.map((item) => item.value).join(',');
      setSection(section);
      fetchSubjectList(section);
    }
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
      console.log(each, "coming")
    } else {
      setSubject('');
    }
  };

  const handleDateChange = (each)=>{
    if(each){
      setStartDate(moment(each[0]).format(dateFormat))
      setEndDate(moment(each[1]).format(dateFormat))
      setDate([moment(each[0]), moment(each[1])])
    }
    else{
      setStartDate(null)
      setEndDate(null)
      setDate(null)
    }
  }

  const handleClearSection = () => {
    setSection([]);
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
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
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-3 shadow-sm'>
              {showFilters ? (
                <div className='row card p-2'>
                  <Form
                    id='filterForm'
                    className='mt-3'
                    layout={'vertical'}
                    ref={formRef}
                    style={{ width: '100%' }}
                  >
                    <div className='row justify-content-between'>
                      <div className='col-xl-7 col-md-6 row'>
                        <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                          <Form.Item name='grade'>
                            <Select
                              mode='multiple'
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
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Grade'
                            >
                              {gradeOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                          <Form.Item name='section'>
                            <Select
                              mode='multiple'
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
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
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
                          <Form.Item name='date'>
                            {/* <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={1}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleChangeVolume(value)}
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Volume'
                            >
                              {volumeOptions}
                            </Select> */}

                            <RangePicker
                              className='th-width-100 th-br-4'
                              onChange={(value) => handleDateChange(value)}
                              defaultValue={[moment(), moment()]}
                              format={dateFormat}
                              separator={'to'}
                            />
                          </Form.Item>
                        </div>
                        <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
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
                              onClear={handleClearSection}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Subject'
                            >
                              {subjectListOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-xl-3 col-md-4 col-sm-6 col-12 pl-0'>
                          <Form.Item name=''>
                            <Select
                              mode='multiple'
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
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Doc Type'
                            >
                              {/* {sectionOptions} */}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-xl-4 col-md-4 col-sm-6 col-12 pl-0'>
                          <Form.Item name='section'>
                            <Button
                              className=' th-br-4 w-100 text-left th-select'
                              type='primary'
                              onClick={()=>fetchTeacherData()}
                            >
                              Search
                            </Button>
                          </Form.Item>
                        </div>
                      </div>
                      <div className='col-md-5 col-xl-3  p-0 row mb-2'>
                        <div
                          className='col-md-12 py-2'
                          style={{
                            boxShadow:
                              'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                            borderRadius: '10px',
                            marginBottom: '5px',
                          }}
                        >
                          <div
                            className='col-md-12 row justify-content-between th-13'
                            style={{ marginTop: '6px' }}
                          >
                            <div>
                              <span>
                                Completed : <span style={{ color: 'green' }}>500</span>{' '}
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
                                Pending : <span style={{ color: 'red' }}>363</span>
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
              ) : (
                ''
              )}
              <div className='col-md-12 p-0 d-flex justify-content-end'>
                {showFilters ? (
                  <div>
                    <Button icon={<UpOutlined />} onClick={handleFilters} />
                  </div>
                ) : (
                  <div>
                    <Button icon={<DownOutlined />} onClick={handleFilters} />
                  </div>
                )}
              </div>
              <div className='mt-4 '>
                {showFilterPage ? (
                  <div className='col-12'>
                    <Result
                      status='warning'
                      title={
                        <span className='th-grey'>Please apply filter to view data</span>
                      }
                    />
                  </div>
                ) : (
                  <div className='mb-3'>
                    <FilesViewEvaluate />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
      </Layout>
    </React.Fragment>
  );
};

export default EvaluatorHomework;
