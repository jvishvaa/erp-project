import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  StopOutlined,
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
import UploadTable from './uploadtable';
import moment from 'moment';
import '../BranchStaffSide/branchside.scss';

const { RangePicker } = DatePicker;

const HwUpload = () => {
  const history = useHistory();
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('');

  const { Option } = Select;
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const loggedUserData = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [showFilterPage, setShowFilter] = useState(false);
  const [subject, setSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]);

  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(moment().format('DD-MM-YYYY'));
  const [endDate, setEndDate] = useState(moment().format('DD-MM-YYYY'));

  const dateFormat = 'DD-MM-YYYY';

  const formRef = useRef();

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchGrade(selectedBranch?.branch?.id);
  }, [selectedBranch, startDate, endDate, section]);

  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear?.id}&branch_id=${selectedBranch?.branch?.id}`
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
      setSection([]);
      formRef.current.setFieldsValue({
        grade: each?.value,
        section: [],
      });
    }
    else{
      formRef.current.setFieldsValue({
        grade: [],
        section: [],
      });
    }
    // if (each.some((item) => item.value === 'all')) {
    //   const allGrade = gradeList.map((item) => item.grade_id).join(',');
    //   setGrade(allGrade);
    //   fetchSection(allGrade);
    //   setSection([]);
    //   formRef.current.setFieldsValue({
    //     grade: gradeList.map((item) => item.grade_id),
    //     section: [],
    //   });
    // } else {
    //   const singleGrade = each.map((item) => item.value).join(',');
    //   setGrade(singleGrade);
    //   fetchSection(singleGrade);
    //   setSection([]);
    //   formRef.current.setFieldsValue({
    //     section: [],
    //   });
    // }
  };

  const handleClearGrade = () => {
    setGrade([]);
    setSection('');
    setSectionList([]);
    setSubject('');
    setStartDate(null);
    setEndDate(null);
    setDate(null);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
      subject: [],
      date: null,
    });
  };

  const fetchSection = async (grade) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${selectedYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${grade}`
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

  const fetchSubject = async (section) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.academics.subjects}?session_year=${selectedYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade=${grade}&section=${section}`
      );
      if (result.data.status_code === 200) {
        setSubjectList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.sec_name}
      </Option>
    );
  });

  const subjectOptions = subjectList?.map((each) => {
    return (
      <Option key={each?.subject__id} value={each.subject_mapping_id}>
        {each?.sub_name}
      </Option>
    );
  });

  const handleChangeSection = (each) => {
    setPageNo(1);
    if (each) {
      setSection(each?.value);
      formRef.current.setFieldsValue({
        section: each?.value,
      });
      fetchSubject(each?.value);
      // if (each.some((item) => item.value === 'all')) {
      //   const allsections = sectionList?.map((item) => item.section_id).join(',');
      //   setSection(allsections);
      //   formRef.current.setFieldsValue({
      //     section: sectionList?.map((item) => item.section_id),
      //   });
      //   fetchSubject(allsections);
      // } else {
      //   const singleSection = each.map((item) => item.value).join(',');
      //   setSection(singleSection);
      //   fetchSubject(singleSection);
      // }
    }
  };

  const handleChangeSubject = (each) => {
    console.log(each, 'subject');
    setPageNo(1);
    if (each) {
      console.log()
      setSubject(each?.value);
      formRef.current.setFieldsValue({
        subject: each?.value,
      });
    }
    // if (each.some((item) => item.value === 'all')) {
    //   const allsubjects = subjectList?.map((item) => item.id).join(',');
    //   setSubject(allsubjects);
    //   formRef.current.setFieldsValue({
    //     section: subjectList?.map((item) => item.id),
    //   });
    // } else {
    //   const singleSubject = each.map((item) => item.value).join(',');
    //   setSubject(singleSubject);
    // }
  };

  const handleClearSubject = () => {
    setSubject([]);
  };

  const handleClearSection = () => {
    setSection([]);
  };

  const handleDateChange = (each) => {
    if (each) {
      setStartDate(moment(each[0]).format(dateFormat));
      setEndDate(moment(each[1]).format(dateFormat));
      setDate([moment(each[0]), moment(each[1])]);
    } else {
      setStartDate(null);
      setEndDate(null);
      setDate(null);
    }
  };

  const handleUploadPage = () => {
    history.push('/centralized-homework/homework-upload');
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
                Wokrsheet & Classwork
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div> */}

      {/* <div className='row'>
        <div className='col-md-12'>
          <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm mb-3'> */}
      <div className='row'>
        <Form
          id='filterForm'
          className='mt-3'
          layout={'vertical'}
          ref={formRef}
          style={{ width: '100%' }}
        >
          <div className='row'>
            <div className='col-md-12 row'>
              <div className='col-md-2 col-sm-6 col-12'>
              <div className='mb-2 text-left'>Grade</div>
                <Form.Item name='grade'>
                  <Select
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
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select Grade'
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-sm-6 col-12'>
              <div className='mb-2 text-left'>Section</div>
                <Form.Item name='section'>
                  <Select
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
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select section'
                  >
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-sm-6 col-12'>
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
                    onChange={(e, value) => handleChangeSubject(value)}
                    onClear={handleClearSubject}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    placeholder='Select Subject'
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div>

              <div className='col-md-3 col-sm-6 col-12'>
              <div className='mb-2 text-left'>Select Dates</div>
                <Form.Item name='date'>
                  <RangePicker
                    className='th-width-100 th-br-4'
                    onChange={(value) => handleDateChange(value)}
                    defaultValue={[moment(), moment()]}
                    format={dateFormat}
                    separator={'to'}
                  />
                </Form.Item>
              </div>

              <div className='col-md-2 col-sm-6 col-12'>
                <Button
                  className='w-100 th-br-4'
                  type='primary'
                  onClick={handleUploadPage}
                  style={{marginTop:"30px"}}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <div className='row '>
        {showFilterPage ? (
          <div className='col-12'>
            <Result
              status='warning'
              title={<span className='th-grey'>Please apply filter to view data</span>}
            />
          </div>
        ) : (
          <div className='my-3'>
            <UploadTable
              startDate={startDate}
              endDate={endDate}
              subejctId={subject}
              sectionId={section}
            />
          </div>
        )}
      </div>
      {/* </div>
        </div>
      </div> */}

      {/* </div> */}
      {/* </Layout> */}
    </React.Fragment>
  );
};

export default HwUpload;
