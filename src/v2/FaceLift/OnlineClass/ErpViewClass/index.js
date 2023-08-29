import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import FeeReminder from '../../FeeReminder/FeeReminder';
import GrievanceModal from '../../myComponents/GrievanceModal';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Form,
  Select,
  Switch,
  Tooltip,
  message,
  DatePicker,
  Button,
  Tabs,
  Table,
  Empty,
  Pagination,
  Space,
  Drawer,
} from 'antd';
import { ClockCircleTwoTone, DownOutlined, InfoCircleFilled } from '@ant-design/icons';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import APIREQUEST from 'config/apiRequest';
import SideDrawer from './side-drawer';
import Countdown, { zeroPad } from 'react-countdown';

const isOrchids =
  window.location.host.split('.')[0] === 'orchids' ||
  window.location.host.split('.')[0] === 'qa'
    ? true
    : false;

const ErpAdminViewClassv2 = () => {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const { TabPane } = Tabs;
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { user_level: userLevel = 5 } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const [studentDetails] = useState(
    JSON.parse(window.localStorage.getItem('userDetails'))
  );
  const launchdate = localStorage.getItem('launchDate');
  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    { id: 4, type: 'Remedial Classes' },

    /* { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' }, */
  ]);
  const [selectedClassType, setSelectedClassType] = useState('');
  const [selectedAcadId, setSelectedAcadId] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [groupSectionMappingId, setGroupSectionMappingId] = useState([]);
  const [selectedGroupData, setSelectedGroupData] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [sectionToggle, setSectionToggle] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [historicalData, setHistoricalData] = useState(false);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([]);
  const [minStartDate, setMinStartDate] = useState();
  const [maxStartDate, setMaxStartDate] = useState();
  const limit = 15;
  //   const [tabValue, setTabValue] = useState(
  //     JSON.parse(localStorage.getItem('filterData'))?.tabValue || '0'
  //   );
  const [tabValue, setTabValue] = useState('0');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filterList, setFilterList] = useState([]);
  const [selectedViewMore, setSelectedViewMore] = useState('');
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const viewMoreRef = useRef(null);
  const [flag, setFlag] = useState(false);
  const [classOver, setClassOver] = useState(false);
  const [disableHost, setDisableHost] = useState(false);
  const { email = '' } = JSON.parse(localStorage.getItem('userDetails'));

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'View Class' &&
              window.location.pathname === '/erp-online-class'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
            if (
              item.child_name === 'Teacher View Class' &&
              window.location.pathname === '/erp-online-class-teacher-view'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
            if (
              item.child_name === 'Attend Online Class' &&
              window.location.pathname === '/erp-online-class-student-view'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);
  useEffect(() => {
    if (moduleId && window.location.pathname !== '/erp-online-class-student-view') {
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&module_id=${moduleId}`,
        'gradeList'
      );
    }
  }, [moduleId, selectedAcademicYear]);
  // useEffect(() => {
  //   let modId = +JSON.parse(localStorage.getItem('moduleId'));
  //   if (moduleId) {
  //     if (modId !== moduleId) {
  //       handleClearFilter();
  //     }
  //     if (modId === moduleId) {
  //       const {
  //         classtype = {},
  //         academic = {},
  //         grade = [],
  //         section = [],
  //         subject = [],
  //         group = [],
  //         sectionToggle = false,
  //         date = getminMaxDate().datearr,
  //         page: pageNumber = 1,
  //         tabValue: tabVal = 0,
  //         historicalData: historicalDataResponse = false,
  //       } = JSON.parse(localStorage.getItem('filterData')) || {};
  //       if (classtype?.id >= 0) {
  //         setHistoricalData(historicalDataResponse);
  //         if (date?.length) {
  //           setDateRangeTechPer([moment(date?.[0]), moment(date?.[1])]);
  //         }
  //         setSelectedClassType(classtype);
  //         if (window.location.pathname !== '/erp-online-class-student-view') {
  //           if (academic?.id > 0) {
  //             // setSelectedAcademicYear(academic);
  //             const acadId = academic?.id || '';
  //             if (selectedBranch) {
  //               const branchIds = selectedBranch?.branch?.id;
  //               let acadIds = selectedAcademicYear?.id;
  //               setSelectedAcadId(acadIds);
  //               callApi(
  //                 `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchIds}&module_id=${moduleId}`,
  //                 'gradeList'
  //               );
  //               if (grade?.length) {
  //                 setSelectedGrade(grade);
  //                 const gradeIds =
  //                   grade.filter((el) => el?.grade_id > 0).map((el) => el?.grade_id) ||
  //                   [];
  //                 getGroup(gradeIds, acadIds);
  //                 callApi(
  //                   `${endpoints.academics.sections}?session_year=${acadId}&branch_id=${branchIds}&grade_id=${gradeIds}&module_id=${moduleId}`,
  //                   'section'
  //                 );
  //                 if (sectionToggle) {
  //                   setSectionToggle(sectionToggle);
  //                   // setSelectedGroupData(group)
  //                   handleGroup('', group);
  //                   setSelectedSubject(subject);
  //                 }
  //                 if (section?.length) {
  //                   setSelectedSection(section);
  //                   const sectionIds =
  //                     section
  //                       .filter((el) => el?.section_id > 0)
  //                       .map((el) => el?.section_id) || [];
  //                   callApi(
  //                     `${endpoints.academics.subjects}?branch=${branchIds}&session_year=${acadId}&grade=${gradeIds}&section=${sectionIds}&module_id=${moduleId}`,
  //                     'subject'
  //                   );
  //                   if (classtype?.id === 0) {
  //                     if (subject?.length) {
  //                       setSelectedSubject(subject);
  //                     }
  //                   }
  //                 }
  //                 setPage(pageNumber);
  //                 setTabValue(tabVal);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, [moduleId, window.location.pathname]);
  useEffect(() => {
    if (page) {
      const getvalues = getminMaxDate();
      setMinStartDate(getvalues.mindate);
      setMaxStartDate(getvalues.maxDate);
      setDateRangeTechPer(getvalues.datearr);
      const [startDateTechPer, endDateTechPer] = getminMaxDate().datearr;
      if (
        window.location.pathname === '/erp-online-class' ||
        window.location.pathname === '/erp-online-class-teacher-view'
      ) {
        // if (selectedSubject?.length > 0 || selectedGroupId) {
        if (selectedSubject?.length > 0) {
          let url = `${endpoints.aol.classes}?is_aol=0&session_year=${
            selectedAcademicYear?.id
          }&class_type=${selectedClassType?.key}&start_date=${startDateTechPer.format(
            'YYYY-MM-DD'
          )}&end_date=${endDateTechPer.format(
            'YYYY-MM-DD'
          )}&page_number=${page}&page_size=${limit}&class_status=${
            parseInt(tabValue, 10) + 1
          }&module_id=${moduleId}&subject_id=${selectedSubject.map((el) => el?.key)}`;
          if (!sectionToggle)
            url += `&section_mapping_ids=${selectedSection.map((el) => el?.props?.value)}`;
          if (sectionToggle)
            url += `&section_mapping_ids=${[
              ...new Set(groupSectionMappingId),
            ].toString()}`;
          callApi(url, 'filter');
        } else if (
          selectedClassType &&
          window.location.pathname !== '/erp-online-class'
        ) {
          noFilterGetClasses();
        }
      } else if (
        window.location.pathname === '/erp-online-class-student-view' &&
        selectedClassType?.key >= 0 &&
        moduleId
      ) {
        setLoading(true);
        setFilterList([]);
        setTotalCount(0);
        axiosInstance
          .get(endpoints.studentViewBatchesApi.onclsAcessCheck)
          .then((result) => {
            if (result?.data?.status_code === 200) {
              callApi(
                `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
                  studentDetails &&
                  studentDetails.role_details &&
                  studentDetails.role_details.erp_user_id
                }&page_number=${page}&page_size=${limit}&class_type=${
                  selectedClassType?.key
                }&class_status=${parseInt(tabValue, 10) + 1}&module_id=${moduleId}`,
                'filter'
              );
            } else {
              setLoading(false);
              message.error('Access Denied');
            }
          })
          .catch((err) => {
            setLoading(false);
            message.error('Access Denied');
          });
      }
    }
  }, [page, flag]);
  useEffect(() => {
    if (tabValue === '0' || tabValue === '1') {
      setHistoricalData(false);
    }
    if (page == 1) {
      setFlag(!flag);
    } else {
      setPage(1);
    }
  }, [selectedClassType, tabValue, historicalData]);
  useEffect(() => {
    if (window.location.pathname !== '/erp-online-class') {
      setSelectedClassType({ key: '0', value: 'Compulsory Class' });
      formRef.current.setFieldsValue({
        classtype: 'Compulsory Class',
      });
    }
  }, []);
  // useEffect(() => {
  //   if (
  //     moduleId &&
  //     window.location.pathname === '/erp-online-class-teacher-view'
  //   ) {
  //     noFilterGetClasses();
  //   }
  // }, [tabValue, page]);
  // useEffect(() => {
  //   if (
  //     moduleId &&
  //     window.location.pathname === '/erp-online-class-teacher-view'
  //   ) {
  //     noFilterGetClasses();
  //   }
  // }, [moduleId]);

  // useEffect(() => {
  //   if (window.location.pathname === '/erp-online-class-teacher-view') {
  //     if (dateRangeTechPer[0] && dateRangeTechPer[1]) {
  //       noFilterGetClasses();
  //     }
  //   }
  // }, [dateRangeTechPer]);
  useEffect(() => {
    const getvalues = getminMaxDate();
    setMinStartDate(getvalues.mindate);
    setMaxStartDate(getvalues.maxDate);
    setDateRangeTechPer(getvalues.datearr);
    if (window.location.pathname === '/erp-online-class-student-view') {
      let data = JSON.parse(localStorage.getItem('filterData')) || '';
      localStorage.setItem('filterData', JSON.stringify({ ...data, historicalData }));
    }
  }, [historicalData]);
  useEffect(() => {
    setSelectedSection([]);
    setSelectedGroupData([]);
    setSelectedGroupId('');
    setGroupSectionMappingId([]);
    setSubjectList([]);
    setSelectedSubject([]);
    formRef.current.setFieldsValue({
      section: [],
      group: [],
      subject: [],
    });
  }, [sectionToggle]);

  const handleClassType = (e, value) => {
    if (value) {
      setSelectedClassType(value);
      setPage(1);
    } else {
      if (window.location.pathname === '/erp-online-class-student-view') {
        setSelectedClassType();
        setFilterList([]);
        setTotalCount(0);
      } else {
        handleClearFilter();
      }
    }
  };
  const handleGrade = (e, value) => {
    setSelectedGrade([]);
    setSectionList([]);
    setSelectedSection([]);
    setGroupList([]);
    setSelectedGroupData([]);
    setSelectedGroupId('');
    setGroupSectionMappingId([]);
    setSubjectList([]);
    setSelectedSubject([]);
    formRef.current.setFieldsValue({
      section: [],
      group: [],
      subject: [],
    });
    if (value?.length) {
      value =
        value.filter(({ key }) => key === 'all').length === 1
          ? [...gradeOptions].filter(({ key }) => key !== 'all')
          : value;
      const selectedGradeIds = value.map((el) => el?.key) || [];
      setSelectedGrade(value);
      getGroup(selectedGradeIds, selectedBranch?.id);
      callApi(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&grade_id=${selectedGradeIds}&module_id=${moduleId}`,
        'sectionList'
      );
    }
  };
  const getGroup = (gradeIds, AcadIds) => {
    axiosInstance
      .get(
        `${
          endpoints.assessmentErp.getGroups
        }?acad_session=${AcadIds}&grade=${gradeIds}&is_active=${true}` //&group_type=${2}
      )
      .then((result) => {
        if (result?.status === 200) {
          setGroupList(result?.data);
        }
      });
  };
  const handleSection = (e, value) => {
    setSelectedSection([]);
    setSubjectList([]);
    setSelectedSubject([]);
    formRef.current.setFieldsValue({
      subject: [],
    });
    if (value?.length) {
      value =
        value.filter(({ key }) => key === 'all').length === 1
          ? [...sectionOptions].filter(({ key }) => key !== 'all')
          : value;
      const selectedSectionIds = value.map((el) => el?.key) || [];
      const gradeIds = selectedGrade.map((el) => el?.key) || [];
      setSelectedSection(value);
      callApi(
        `${endpoints.academics.subjects}?session_year=${selectedAcademicYear?.id}&branch=${selectedBranch?.branch?.id}&grade=${gradeIds}&section=${selectedSectionIds}&module_id=${moduleId}`,
        'subjectList'
      );
    }
  };
  const handleGroup = (e, value) => {
    setSelectedGroupData([]);
    setSelectedGroupId('');
    setGroupSectionMappingId([]);
    setSelectedSubject([]);
    setSubjectList([]);
    formRef.current.setFieldsValue({
      subject: [],
    });
    if (value?.length) {
      let sectionIds = [];
      let branchIds = [];
      let GradeIds = [];
      let sessionIds = [];
      let secMappingIds = [];
      const retrieveIds = value?.forEach((item) => {
        let secids = item?.group_section_mapping.map((i) => i?.group_section_id);
        let branchids = item?.group_section_mapping.map((i) => i?.group_branch_id);
        let gradeids = item?.group_section_mapping.map((i) => i?.group_grade_id);
        let sessids = item?.group_section_mapping.map((i) => i?.group_session_year_id);
        let secmapids = item?.group_section_mapping.map((i) => i?.section_mapping_id);

        sectionIds.push(secids.toString());
        branchIds.push(branchids.toString());
        GradeIds.push(gradeids.toString());
        sessionIds.push(sessids.toString());
        secMappingIds.push(secmapids.toString());
      });
      let groupIds = value?.map((item) => item?.key);
      setGroupSectionMappingId(secMappingIds);
      setSelectedGroupData(value);
      setSelectedGroupId(groupIds.toString());
      callApi(
        `${
          endpoints.academics.subjects
        }?branch=${branchIds}&session_year=${sessionIds}&grade=${GradeIds}&section=${sectionIds.toString()}&module_id=${moduleId}`,
        'subjectList'
      );
    }
  };
  const handleSubject = (e, value) => {
    if (value.length) {
      setSelectedSubject(value);
    } else {
      setSelectedSubject([]);
    }
  };

  function callApi(api, key) {
    if (key === 'filter') {
      setLoading(true);
    }
    if (
      key === 'filter' &&
      JSON.parse(localStorage.getItem('isMsAPI')) &&
      historicalData === false
    ) {
      msCallFilterApi(api);
      return;
    }
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            const gradeData = result?.data?.data || [];
            gradeData.unshift({
              grade__grade_name: 'Select All',
              grade_id: 'all',
              id: 'all',
            });
            setGradeList(gradeData);
          }
          if (key === 'sectionList') {
            const sectionData = result?.data?.data || [];
            sectionData.unshift({
              id: 'all',
              section_id: 'all',
              section__section_name: 'Select All',
            });
            setSectionList(sectionData);
          }
          if (key === 'subjectList') {
            const transformedData =
              result?.data?.data.map((sub, index) => {
                return {
                  id: index,
                  ...sub,
                };
              }) || [];
            setSubjectList(transformedData);
          }
          if (key === 'filter') {
            handleApiRes(result);
          }
        } else {
          message.error(result?.data?.message);
          setFilterList([]);
        }
      })
      .catch((error) => {
        message.error(error?.message);
        setFilterList([]);
      });
  }
  function msCallFilterApi(api) {
    var url = api.split('?');
    url.shift();
    var path = url.join('?');
    let endpoint1 = getEndpoint(path);
    if (!endpoint1) {
      setLoading(false);
      return;
    }
    const isMsOriginURL = !['0', '1'].includes(tabValue);
    APIREQUEST('get', endpoint1, null, null, isMsOriginURL)
      .then((result) => {
        handleApiRes(result);
      })
      .catch((error) => {
        const { response = {} } = error || {};
        const { status = 502 } = response || {};
        message.error(
          status === 502 ? 'Data will be available after 3:00 pm' : error?.message
        );
        setLoading(false);
        setFilterList([]);
      });
  }
  const getEndpoint = (path) => {
    if (window.location.pathname === '/erp-online-class-student-view') {
      if (tabValue === '0' || tabValue === '1') {
        return `/oncls/v1/student-oncls/?${path}`;
      } else {
        return `/reports/v1/student-oncls/?${path}`;
      }
    } else {
      if (window.location.pathname === '/erp-online-class') {
        return ['0', '1'].includes(tabValue)
          ? `/oncls/v1/retrieve-online-class/?${path}&user_level=${userLevel}&audit=1`
          : `/reports/v1/retrieve-online-class/?${path}&user_level=${userLevel}&audit=1`;
      } else if (window.location.pathname === '/erp-online-class-teacher-view') {
        return ['0', '1'].includes(tabValue)
          ? `/oncls/v1/retrieve-online-class/?${path}&user_level=${userLevel}&audit=0`
          : `/reports/v1/retrieve-online-class/?${path}&user_level=${userLevel}&audit=0`;
      }
    }
  };
  const handleApiRes = (result) => {
    setTotalCount(result?.data?.count);
    const response = result?.data?.data || [];
    setFilterList(response);
    setSelectedViewMore('');
    const viewData = JSON.parse(localStorage.getItem('viewMoreData')) || '';
    if (viewData?.id) {
      let newViewData = response.filter((item) => item.id == viewData.id);
      localStorage.setItem('viewMoreData', JSON.stringify(newViewData[0] || {}));
      setSelectedViewMore(newViewData[0] || {});
    }
    setLoading(false);
  };

  const handleClearFilter = () => {
    setSelectedClassType();
    setSelectedGrade([]);
    setSectionList([]);
    setSelectedSection([]);
    setGroupList([]);
    setSelectedGroupData([]);
    setSelectedGroupId('');
    setGroupSectionMappingId([]);
    setSubjectList([]);
    setSelectedSubject([]);
    localStorage.removeItem('filterData');
    localStorage.removeItem('viewMoreData');
    setSectionToggle(false);
    setHistoricalData(false);
    setFilterList([]);
    setTotalCount(0);
    setSelectedViewMore('');
    const getvalues = getminMaxDate();
    setDateRangeTechPer(getvalues.datearr);
    formRef.current.resetFields();
  };
  function handleFilter() {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    setPage(() => 1);
    // setTabValue(0);
    setSelectedViewMore(() => '');
    localStorage.removeItem('viewMoreData');
    localStorage.removeItem('filterData');
    if (window.location.pathname === '/erp-online-class-student-view') {
      setLoading(true);
      axiosInstance
        .get(endpoints.studentViewBatchesApi.onclsAcessCheck)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            callApi(
              `${
                endpoints.studentViewBatchesApi.getBatchesApi
              }?module_id=${moduleId}&user_id=${
                studentDetails &&
                studentDetails.role_details &&
                studentDetails.role_details.erp_user_id
              }&page_number=${1}&page_size=${limit}&class_type=${
                selectedClassType?.id
              }&class_status=${parseInt(tabValue, 10) + 1}`,
              'filter'
            );
          } else {
            setLoading(false);
            message.error('Access Denied');
          }
        })
        .catch((err) => {
          setLoading(false);
          message.error('Access Denied');
        });
    } else {
      if (!selectedClassType) {
        message.error('Please Select Classtype');
        return;
      }
      if (!selectedGrade?.length > 0) {
        message.error('Please Select Grade');
        return;
      }
      if (!sectionToggle && !selectedSection?.length > 0) {
        message.error('Please Select Section');
        return;
      }
      if (sectionToggle && !selectedGroupId) {
        message.error('Please Select Group');
        return;
      }
      if (!selectedSubject?.length > 0) {
        message.error('Please Select Subject');
        return;
      }
      if (!startDateTechPer) {
        message.error('Please Select Start Date');
        return;
      }
      if (!endDateTechPer) {
        message.error('Please Select End Date');
        return;
      }
      setLoading(true);
      // localStorage.setItem(
      //   'filterData',
      //   JSON.stringify({
      //     classtype: selectedClassType,
      //     academic: selectedAcademicYear,
      //     grade: selectedGrade,
      //     section: selectedSection,
      //     subject: selectedSubject,
      //     date: dateRangeTechPer,
      //     group: selectedGroupData,
      //     sectionToggle: sectionToggle,
      //     page,
      //     tabValue,
      //     historicalData,
      //   })
      // );
      let url = `${endpoints.aol.classes}?is_aol=0&session_year=${
        selectedAcademicYear?.id
      }&class_type=${selectedClassType?.key}&start_date=${moment(startDateTechPer).format(
        'YYYY-MM-DD'
      )}&end_date=${moment(endDateTechPer).format('YYYY-MM-DD')}&class_status=${
        parseInt(tabValue, 10) + 1
      }&module_id=${moduleId}&page_number=${1}&page_size=${limit}&subject_id=${selectedSubject.map(
        (el) => el?.key
      )}`;
      if (!sectionToggle)
        url += `&section_mapping_ids=${selectedSection.map((el) => el?.props?.value)}`;
      if (sectionToggle)
        url += `&section_mapping_ids=${[...new Set(groupSectionMappingId)].toString()}`;
      callApi(url, 'filter');
    }
  }
  function noFilterGetClasses() {
    const filterdata = JSON.parse(localStorage.getItem('filterData'));
    if (!filterdata?.branch) {
      const getvalues = getminMaxDate();
      setMinStartDate(getvalues.mindate);
      setMaxStartDate(getvalues.maxDate);
      setDateRangeTechPer(getvalues.datearr);
      var [startDateTechPer, endDateTechPer] = getminMaxDate().datearr;
      // debugger
      // if (dateRangeTechPer[0] && dateRangeTechPer[1]) {
      //   startDateTechPer = dateRangeTechPer[0];
      //   endDateTechPer = dateRangeTechPer[1];
      // }
      // const currentDate = new Date(); // This gets the current date and time
      // const formattedDate = currentDate.toISOString().split('T')[0]; // Format it as "YYYY-MM-DD"
      // if (dateRangeTechPer[0] && dateRangeTechPer[1]) {
      //   if (tabValue === '0') {
      //     startDateTechPer = moment(formattedDate);
      //     endDateTechPer = moment(formattedDate);
      //   } else if (tabValue === '1') {
      //     startDateTechPer = moment(formattedDate);
      //     endDateTechPer = moment(maxStartDate);
      //   } else {
      //     startDateTechPer = dateRangeTechPer[0];
      //     endDateTechPer = dateRangeTechPer[1];
      //   }
      // }
      if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
        setLoading(true);
        const isMsOriginURL = !['0', '1'].includes(tabValue);
        const url = isMsOriginURL
          ? `/reports/v1/retrieve-online-class_no_filter/`
          : `/oncls/v1/retrieve-online-class_no_filter/`;

        APIREQUEST(
          'get',
          `${url}?module_id=${moduleId}&class_type=${
            selectedClassType?.key
          }&user_level=${userLevel}&class_status=${
            parseInt(tabValue, 10) + 1
          }&audit=0&start_date=${startDateTechPer?.format(
            'YYYY-MM-DD'
          )}&end_date=${endDateTechPer?.format(
            'YYYY-MM-DD'
          )}&page_number=${page}&page_size=${limit}`,
          null,
          null,
          isMsOriginURL
        )
          .then((result) => {
            handleApiRes(result);
          })
          .catch((error) => {
            const { response = {} } = error || {};
            const { status = 502 } = response || {};
            message.error(
              status === 502 ? 'Data will be available after 3:00 pm' : error?.message
            );
            setLoading(false);
            setFilterList([]);
          });
      } else {
        callApi(
          `${endpoints.aol.onlineClassNoFilter}?class_status=${
            parseInt(tabValue, 10) + 1
          }&start_date=${startDateTechPer?.format(
            'YYYY-MM-DD'
          )}&end_date=${endDateTechPer?.format(
            'YYYY-MM-DD'
          )}&page_number=${page}&page_size=${limit}`,
          'filter'
        );
      }
    }
  }
  const handleDownload = async () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    try {
      const { data } =
        JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false
          ? await APIREQUEST(
              'get',
              `/reports/v1/oncls-report/?start_date=${moment(startDateTechPer).format(
                'YYYY-MM-DD'
              )}&end_date=${moment(endDateTechPer).format('YYYY-MM-DD')}`,
              null,
              'arraybuffer',
              true
            )
          : await axiosInstance.get(
              `${endpoints.onlineClass.downloadOnlineClass_EXCEL}?start_date=${moment(
                startDateTechPer
              ).format('YYYY-MM-DD')}&end_date=${moment(endDateTechPer).format(
                'YYYY-MM-DD'
              )}`,
              {
                responseType: 'arraybuffer',
              }
            );
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `erp_classes_from${moment(startDateTechPer).format(
        'YYYY-MM-DD'
      )}to${moment(endDateTechPer).format('YYYY-MM-DD')}`;
      link.click();
      link.remove();
    } catch {
      message.error('error', 'Failed To Download, Try After Some Time');
    }
  };

  function handleClose(data) {
    setSelectedViewMore('');
    localStorage.removeItem('viewMoreData');
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    if (data === 'success') {
      setPage(1);
      if (window.location.pathname === '/erp-online-class-student-view') {
        setLoading(true);
        axiosInstance
          .get(endpoints.studentViewBatchesApi.onclsAcessCheck)
          .then((result) => {
            if (result?.data?.status_code === 200) {
              callApi(
                `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
                  studentDetails &&
                  studentDetails.role_details &&
                  studentDetails.role_details.erp_user_id
                }&page_number=${page}&page_size=${limit}&class_type=${
                  selectedClassType?.key
                }&module_id=${moduleId}&class_status=${parseInt(tabValue, 10) + 1}`,
                'filter'
              );
            } else {
              message.error('Access Denied');
              setLoading(false);
            }
          })
          .catch((err) => {
            setLoading(false);
            message.error('Access Denied');
          });
      }
      if (
        window.location.pathname === '/erp-online-class' ||
        window.location.pathname === '/erp-online-class-teacher-view'
      ) {
        let url = `${endpoints.aol.classes}?is_aol=0&session_year=${
          selectedAcademicYear?.id
        }&subject_id=${selectedSubject.map((el) => el?.subject__id)}&class_type=${
          selectedClassType?.id
        }&start_date=${startDateTechPer?.format(
          'YYYY-MM-DD'
        )}&end_date=${endDateTechPer?.format(
          'YYYY-MM-DD'
        )}&page_number=${page}&page_size=${limit}&class_status=${
          parseInt(tabValue, 10) + 1
        }&module_id=${moduleId}`;
        if (!sectionToggle)
          url += `&section_mapping_ids=${selectedSection.map((el) => el?.props?.value)}`;
        if (sectionToggle)
          url += `&section_mapping_ids=${[...new Set(groupSectionMappingId)].toString()}`;
        callApi(url, 'filter');
      }
    }
  }
  const handleCloseGrievanceModal = () => {
    setShowGrievanceModal(false);
  };

  const handleClickAccept = (row) => {
    const currentTime = getCurrentTime();
    const startTime = new Date(`${row?.online_class?.start_time}`).getTime(); // in milliseconds
    const endTime = new Date(`${row?.online_class?.end_time}`).getTime(); // in milliseconds
    const diffTime = startTime - 5 * 60 * 1000;
    if (diffTime > currentTime) {
      message.error(
        `You Can Join 5mins Before: ${moment(`${row?.online_class?.start_time}`).format(
          'hh:mm:ss A'
        )}`
      );
      return;
    } else if (endTime >= currentTime && currentTime >= diffTime) {
      handleJoinButton(row);
    } else {
      setClassOver(true);
      message.error('Class has ended!');
    }
  };
  const handleJoinButton = (row) => {
    const endTime = new Date(`${row?.online_class?.end_time}`).getTime(); // in milliseconds
    const currentTime = getCurrentTime();
    if (endTime >= currentTime) {
      handleIsAttended(row);
    } else {
      setClassOver(true);
      message.error('Class has ended!');
    }
  };
  const handleIsAttended = (row) => {
    const currentDate = new Date(); // This gets the current date and time
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format it as "YYYY-MM-DD"
    const params = {
      zoom_meeting_id: row && row?.id,
      class_date: formattedDate,
      is_attended: true,
      is_accepted: true,
    };
    if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
      msApiMarkAttandance(params, row);
      return;
    }
    apiMarkAttendance(params, row);
  };
  const msApiMarkAttandance = (params, row) => {
    APIREQUEST('put', '/oncls/v1/mark-attendance/', params)
      .then((res) => {
        setLoading(false);
        if (res.data.status_code == 200) {
          if (params?.is_attended) {
            openZoomClass(row?.join_url);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };
  const apiMarkAttendance = (params, row) => {
    axiosInstance
      .put(endpoints.studentViewBatchesApi.rejetBatchApi, params)
      .then((res) => {
        setLoading(false);
        if (res.data.status_code == 200) {
          if (params?.is_attended) {
            openZoomClass(row?.join_url);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };
  const openZoomClass = (url) => {
    if (navigator.userAgent.indexOf('iPhone') >= 0) {
      window.location.assign(url);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
    link.remove();
  };
  // useEffect(() => {
  //   if (
  //     window.location.pathname === '/erp-online-class-teacher-view' ||
  //     window.location.pathname === '/erp-online-class'
  //   ) {
  //     handleHostDisable(row);
  //   }
  // }, [new Date().getSeconds()]);
  function handleHost(data) {
    if (!handleHostDisable(data)) {
      // setLoading(true);
      if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
        msApihandleHost(data);
        return;
      }
      axiosInstance
        .get(`${endpoints.teacherViewBatches.hostApi}?id=${data.id}`)
        .then((res) => {
          setLoading(false);
          if (res?.data?.url) {
            // window.open(res?.data?.url, '_blank');
            openZoomClass(res?.data?.url);
          } else {
            message.error(res?.data?.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    } else {
      setDisableHost(true);
      message.error("Class can't be started now");
    }
  }
  const handleHostDisable = (row) => {
    // console.log(row, 'row');
    let disableFlag = false;
    const startTime = new Date(`${row?.online_class?.start_time}`).getTime(); // in milliseconds
    const endTime = new Date(`${row?.online_class?.end_time}`).getTime(); // in milliseconds
    const isActiveEnd = endTime;
    const isActiveStart = startTime - 5 * 60 * 1000;
    // console.log(starTime, 'startTime');
    // console.log(enTime, 'endTime');
    // console.log(isActiveStart, 'isActiveStart');
    if (isActiveStart <= getCurrentTime() && getCurrentTime() <= isActiveEnd) {
      setDisableHost(false);
      disableFlag = false;
    } else {
      setDisableHost(true);
      disableFlag = true;
    }
    return disableFlag;
  };
  const msApihandleHost = (data) => {
    APIREQUEST('get', `/oncls/v1/zoom-redirect/?id=${data.id}`)
      .then((res) => {
        setLoading(false);
        if (res?.data?.url) {
          // window.open(res?.data?.url, '_blank');
          openZoomClass(res?.data?.url);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };
  const getCurrentTime = () => {
    return parseInt(moment(new Date()).format('x')) || 0;
  };
  const getminMaxDate = () => {
    let mindate = '',
      maxDate = '';
    let datearr = [];
    if (JSON.parse(localStorage.getItem('isMsAPI'))) {
      if (historicalData) {
        mindate = moment(launchdate, 'YYYY-MM-DD')
          .subtract(1, 'year')
          .format('YYYY-MM-DD');
        maxDate = moment(launchdate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        datearr = [
          moment(maxDate, 'YYYY-MM-DD').subtract(6, 'days'),
          moment(maxDate, 'YYYY-MM-DD'),
        ];
      } else {
        if (tabValue === '0') {
          mindate = moment();
          maxDate = moment();
          datearr = [moment(), moment()]; // today
        } else if (tabValue === '1') {
          mindate = moment().add(1, 'day').format('YYYY-MM-DD');
          maxDate = moment(launchdate, 'YYYY-MM-DD').add(1, 'year').format('YYYY-MM-DD');
          datearr = [moment().add(1, 'day'), moment().add(7, 'days')]; // replace 7 by num of days
          // mindate = moment(launchdate).add(1, 'day').format('YYYY-MM-DD');
          // maxDate = moment();
          // datearr = [moment().subtract(4, 'days'), moment()];
        } else if (tabValue === '2') {
          mindate = moment(launchdate).add(1, 'day').format('YYYY-MM-DD');
          maxDate = moment();
          datearr = [moment().subtract(7, 'days'), moment()]; // replace 7 by num of days
        } else {
          mindate = moment(launchdate).add(1, 'day').format('YYYY-MM-DD');
          maxDate = moment(launchdate, 'YYYY-MM-DD').add(1, 'year').format('YYYY-MM-DD');
          datearr = [moment().subtract(7, 'days'), moment()]; // replace 7 by num of days
          // var a = moment(launchdate, 'YYYY-MM-DD').add(1, 'day');
          // var b = moment();
          // if (b.diff(a, 'days') > 6) {
          //   datearr = [moment().subtract(6, 'days'), moment()];
          // } else {
          //   datearr = [moment(mindate, 'YYYY-MM-DD'), moment().add(1, 'day')];
          // }
        }
      }
    } else {
      mindate = '';
      maxDate = '';
      datearr = [moment().subtract(6, 'days'), moment()];
    }
    return { mindate: mindate, maxDate: maxDate, datearr: datearr };
  };

  const columns2 = [
    {
      title: <span className='th-white th-fw-700'>Start Time</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'time',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {moment(row?.online_class?.start_time).format('hh:mm A')}{' '}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Title</span>,
      width: '30%',
      align: 'left',
      dataIndex: 'title',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.online_class?.title.length > 25 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomLeft'
              title={row?.online_class?.title}
              overlayStyle={{ maxWidth: '40%', minWidth: '20%' }}
            >
              {`${row.online_class?.title.substring(0, 25)}...`}
            </Tooltip>
          ) : (
            row?.online_class?.title
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Start Date</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'startdate',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {moment(row?.online_class?.start_time).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>End Date</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'enddate',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {moment(row?.online_class?.end_time).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      width: '25%',
      align: 'center',
      dataIndex: 'viewmore',
      render: (data, row) => (
        <Space direction='vertical'>
          <div className='row'>
            <Button
              type='primary'
              className='btn-block th-br-4 th-14'
              style={{ width: '100px' }}
              onClick={() => setSelectedViewMore(row)}
            >
              View More
            </Button>
            {/* {tabValue === '0' &&
              window.location.pathname === '/erp-online-class-student-view' && (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    style={{ width: '60px' }}
                    onClick={() => handleJoin(row)}
                  >
                    Join
                  </Button>
                </div>
              )}
            {tabValue === '0' &&
              window.location.pathname === '/erp-online-class-teacher-view' && (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    style={{ width: '60px' }}
                    onClick={() => handleHost(row)}
                  >
                    Host
                  </Button>
                </div>
              )}
            {tabValue === '0' &&
              window.location.pathname === '/erp-online-class' && (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    style={{ width: '60px' }}
                    disabled={handleHostDisable(row) || row?.is_cancelled}
                    onClick={() => {
                      if (email !== row?.online_class?.teacher?.email) {
                        // window.open(fullData && fullData?.join_url, '_blank');
                        openZoomClass(row?.join_url);
                      }
                      if (email === row?.online_class?.teacher?.email) {
                        // window.open(fullData && fullData?.presenter_url, '_blank');
                        openZoomClass(row?.presenter_url);
                      }
                    }}
                  >
                    {email === row?.online_class?.teacher?.email ? 'Host' : 'Audit'}
                  </Button>
                </div>
              )} */}
            {tabValue === '0' && <JoinHostAuditButton row={row} />}
          </div>
          {/* {tabValue === '0' && (
            <div className='row' style={{ alignItems: 'center', marginLeft: 'auto' }}>
              <Countdown
                date={new Date(row?.online_class?.start_time)}
                renderer={renderer}
              />
            </div>
          )} */}
        </Space>
      ),
    },
  ];
  const columns = [
    {
      title: <span className='th-white th-fw-700'>Start Time</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'time',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {moment(row?.online_class?.start_time).format('hh:mm A')}{' '}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Title</span>,
      width: '35%',
      align: 'left',
      dataIndex: 'title',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {row?.online_class?.title.length > 25 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomLeft'
              title={row?.online_class?.title}
              overlayStyle={{ maxWidth: '40%', minWidth: '20%' }}
            >
              {`${row.online_class?.title.substring(0, 25)}...`}
            </Tooltip>
          ) : (
            row?.online_class?.title
          )}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Start Date</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'startdate',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {moment(row?.online_class?.start_time).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>End Date</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'enddate',
      render: (data, row) => (
        <span className='th-black-1 th-16'>
          {moment(row?.online_class?.end_time).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: (
        <span className='th-white th-fw-700'>
          <ClockCircleTwoTone style={{ marginRight: '4px', fontSize: '16px' }} /> Status
        </span>
      ),
      width: '15%',
      align: 'center',
      dataIndex: 'status',
      render: (data, row) => (
        <span>
          <Countdown date={new Date(row?.online_class?.start_time)} renderer={renderer} />
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Action</span>,
      width: '25%',
      align: 'center',
      dataIndex: 'viewmore',
      render: (data, row) => (
        <Space direction='vertical'>
          <div className='row'>
            <Button
              type='primary'
              className='btn-block th-br-4 th-14'
              style={{ width: '100px' }}
              onClick={() => setSelectedViewMore(row)}
            >
              View More
            </Button>
            {/* {tabValue === '0' &&
              window.location.pathname === '/erp-online-class-student-view' && (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    style={{ width: '60px' }}
                    onClick={() => handleJoin(row)}
                  >
                    Join
                  </Button>
                </div>
              )}
            {tabValue === '0' &&
              window.location.pathname === '/erp-online-class-teacher-view' && (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    style={{ width: '60px' }}
                    onClick={() => handleHost(row)}
                  >
                    Host
                  </Button>
                </div>
              )}
            {tabValue === '0' &&
              window.location.pathname === '/erp-online-class' && (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    style={{ width: '60px' }}
                    disabled={handleHostDisable(row) || row?.is_cancelled}
                    onClick={() => {
                      if (email !== row?.online_class?.teacher?.email) {
                        // window.open(fullData && fullData?.join_url, '_blank');
                        openZoomClass(row?.join_url);
                      }
                      if (email === row?.online_class?.teacher?.email) {
                        // window.open(fullData && fullData?.presenter_url, '_blank');
                        openZoomClass(row?.presenter_url);
                      }
                    }}
                  >
                    {email === row?.online_class?.teacher?.email ? 'Host' : 'Audit'}
                  </Button>
                </div>
              )} */}
            {tabValue === '0' && <JoinHostAuditButton row={row} />}
          </div>
          {/* {tabValue === '0' && (
            <div className='row' style={{ alignItems: 'center', marginLeft: 'auto' }}>
              <Countdown
                date={new Date(row?.online_class?.start_time)}
                renderer={renderer}
              />
            </div>
          )} */}
        </Space>
      ),
    },
  ];

  const JoinHostAuditButton = ({ row }) => {
    // console.log(row, 'data in joinhostauditbutoton');

    return (
      <>
        {window.location.pathname === '/erp-online-class-student-view' && (
          <div className='pl-3'>
            <Button
              type='primary'
              className='btn-block th-br-4 th-14'
              style={{ width: '60px' }}
              onClick={() => handleClickAccept(row)}
            >
              Join
            </Button>
          </div>
        )}
        {window.location.pathname === '/erp-online-class-teacher-view' && (
          <div className='pl-3'>
            <Button
              type='primary'
              className='btn-block th-br-4 th-14'
              style={{ width: '60px' }}
              disabled={handleHostDisable(row) || row?.is_cancelled}
              onClick={() => handleHost(row)}
            >
              Host
            </Button>
          </div>
        )}
        {window.location.pathname === '/erp-online-class' && (
          <div className='pl-3'>
            <Button
              type='primary'
              className='btn-block th-br-4 th-14'
              style={{ width: '60px' }}
              disabled={handleHostDisable(row) || row?.is_cancelled}
              onClick={() => {
                if (email !== row?.online_class?.teacher?.email) {
                  // window.open(fullData && fullData?.join_url, '_blank');
                  openZoomClass(row?.join_url);
                }
                if (email === row?.online_class?.teacher?.email) {
                  // window.open(fullData && fullData?.presenter_url, '_blank');
                  openZoomClass(row?.presenter_url);
                }
              }}
            >
              {email === row?.online_class?.teacher?.email ? 'Host' : 'Audit'}
            </Button>
          </div>
        )}
      </>
    );
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <div className='th-red th-16'> Ongoing </div>;
      // return '';
    } else {
      return (
        <>
          <div className='th-black-1 th-16'>
            {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
          </div>
        </>
      );
    }
  };
  const TabContent = () => {
    return (
      <>
        <div className='mt-2'>
          <div className='convert col-md-12'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
              }
              loading={loading}
              columns={tabValue === '0' ? columns : columns2}
              rowKey={(record) => record?.id}
              dataSource={filterList}
              pagination={false}
              locale={noDataLocale}
              scroll={{
                x: window.innerWidth > 400 ? '100%' : 'max-content',
                y: 350,
              }}
            />
          </div>

          <div className='d-flex justify-content-center py-2'>
            <Pagination
              current={page}
              pageSize={15}
              showSizeChanger={false}
              onChange={(page) => {
                setPage(page);
              }}
              total={totalCount}
            />
          </div>
        </div>
      </>
    );
  };
  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        {window.location.pathname === '/erp-online-class-student-view' &&
          selectedClassType && <Empty description={'No classes found'} />}
        {window.location.pathname === '/erp-online-class-student-view' &&
          !selectedClassType && <Empty description={'Please select class type'} />}
        {window.location.pathname === '/erp-online-class-teacher-view' &&
          selectedClassType && <Empty description={'No classes found'} />}
        {window.location.pathname === '/erp-online-class-teacher-view' &&
          !selectedClassType && (
            <Empty description={'Please select filters to view classes'} />
          )}
        {window.location.pathname === '/erp-online-class' && (
          <Empty description={'No classes found'} />
        )}
      </div>
    ),
  };

  const classTypesOptions = classTypes.map((each) => {
    return (
      <Option key={each?.id} value={each?.type}>
        {each?.type}
      </Option>
    );
  });
  const gradeOptions = gradeList.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade__grade_name}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionList.map((each) => {
    return (
      <Option key={each?.section_id} value={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const groupOptions = groupList.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each?.group_name}
        group_section_mapping={each?.group_section_mapping}
      >
        {each?.group_name}
      </Option>
    );
  });
  const subjectOptions = subjectList.map((each) => {
    return (
      <Option key={each?.subject__id} value={each?.subject__subject_name}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const HistoricalDataEle = () => {
    // display only in completed and cancelled tabs
    return JSON.parse(localStorage.getItem('isMsAPI')) ? (
      <>
        <div className='row'>
          <div className='py-1'>
            <Switch
              style={{ marginRight: '5px' }}
              checked={historicalData}
              onChange={() => setHistoricalData(!historicalData)}
              disabled={tabValue === '0' || tabValue === '1'}
            />
          </div>
          <Tooltip
            title={`Recent data: records from ${moment(launchdate)
              .add(1, 'day')
              .format('YYYY-MM-DD')} till date
         Historical data: records before ${moment(launchdate)
           .add(1, 'day')
           .format('YYYY-MM-DD')}`}
            placement='bottomLeft'
            overlayStyle={{ maxWidth: '30%', minWidth: '20%' }}
          >
            <div className='py-1'>
              <InfoCircleFilled
                style={{ fontSize: '16px', color: 'grey', marginRight: '5px' }}
              />
            </div>
          </Tooltip>
          {historicalData ? (
            <div className='th-blue th-14 py-1'>Historical Data</div>
          ) : (
            <div className='th-grey th-14 py-1'>Recent Data </div>
          )}
        </div>
      </>
    ) : null;
  };
  return (
    <>
      <Layout>
        <FeeReminder />
        <div className='row pt-3 pb-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16 th-grey'>
                Online Class
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                {window.location.pathname === '/erp-online-class'
                  ? 'Online Class View'
                  : window.location.pathname === '/erp-online-class-teacher-view'
                  ? 'Teacher View Class'
                  : window.location.pathname === '/erp-online-class-student-view'
                  ? 'Student Class View'
                  : ''}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 shadow-sm'>
              <div className='row'>
                <Form
                  id='filterForm'
                  layout={'vertical'}
                  ref={formRef}
                  style={{ width: '100%' }}
                >
                  <div className='row'>
                    <div className='col-md-3 col-sm-6 col-12'>
                      <Form.Item
                        name='classtype'
                        rules={[
                          {
                            required: true,
                            message: 'Please select class type',
                          },
                        ]}
                      >
                        <Select
                          mode='single'
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          onChange={(e, value) => handleClassType(e, value)}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Class Type*'
                        >
                          {classTypesOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    {window.location.pathname === '/erp-online-class-student-view' && (
                      <div className='col-md-3 col-sm-6 col-12'>
                        <HistoricalDataEle />
                      </div>
                    )}
                    {window.location.pathname !== '/erp-online-class-student-view' && (
                      <>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='grade'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={2}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleGrade(e, value)}
                              dropdownMatchSelectWidth={true}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Grade*'
                            >
                              {gradeOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <div className='row py-1'>
                            {!sectionToggle ? (
                              <div className='th-grey th-16'>Section</div>
                            ) : (
                              <div className='th-grey th-14'>Section</div>
                            )}
                            <Switch
                              style={{ marginLeft: '10px', marginRight: '10px' }}
                              checked={sectionToggle}
                              onChange={() => setSectionToggle(!sectionToggle)}
                            />{' '}
                            {sectionToggle ? (
                              <div className='th-blue th-16'>Group</div>
                            ) : (
                              <div className='th-grey th-14'>Group</div>
                            )}{' '}
                          </div>
                        </div>
                        {!sectionToggle && (
                          <div className='col-md-3 col-sm-6 col-12'>
                            <Form.Item name='section'>
                              <Select
                                mode='multiple'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                maxTagCount={2}
                                allowClear={true}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                onChange={(e, value) => handleSection(e, value)}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select Section*'
                              >
                                {sectionOptions}
                              </Select>
                            </Form.Item>
                          </div>
                        )}
                        {sectionToggle && (
                          <div className='col-md-3 col-sm-6 col-12'>
                            <Form.Item name='group'>
                              <Select
                                mode='multiple'
                                getPopupContainer={(trigger) => trigger.parentNode}
                                maxTagCount={2}
                                allowClear={true}
                                suffixIcon={<DownOutlined className='th-grey' />}
                                className='th-grey th-bg-grey th-br-4 w-100 text-left'
                                placement='bottomRight'
                                showArrow={true}
                                onChange={(e, value) => handleGroup(e, value)}
                                dropdownMatchSelectWidth={true}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                showSearch
                                placeholder='Select Group*'
                              >
                                {groupOptions}
                              </Select>
                            </Form.Item>
                          </div>
                        )}
                        <div className='col-md-3 col-sm-6 col-12'>
                          <Form.Item name='subject'>
                            <Select
                              mode='multiple'
                              getPopupContainer={(trigger) => trigger.parentNode}
                              maxTagCount={2}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleSubject(e, value)}
                              dropdownMatchSelectWidth={true}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Subject*'
                            >
                              {subjectOptions}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className='col-md-2 col-sm-6 col-12'>
                          <HistoricalDataEle />
                        </div>
                        <div className='col-md-4 col-sm-6 col-12'>
                          <RangePicker
                            format='MM/DD/YYYY'
                            disabled={tabValue === '0'}
                            allowClear={false}
                            disabledDate={(current) => {
                              if (minStartDate && maxStartDate) {
                                return (
                                  current < moment(minStartDate) ||
                                  current > moment(maxStartDate)
                                );
                              }
                              if (minStartDate) {
                                return current < moment(minStartDate);
                              }
                              if (maxStartDate) {
                                return current > moment(maxStartDate);
                              }
                              return false; // No date restrictions
                            }}
                            value={dateRangeTechPer}
                            onChange={(newValue) => {
                              setDateRangeTechPer(newValue);
                            }}
                          />
                        </div>
                        <div className='col-md-3 col-sm-6 col-12'>
                          <div className='row no-gutters'>
                            <div className='col-md-6 col-sm-6 col-6 pr-1'>
                              <Button
                                type='secondary'
                                className='btn-block mt-0 th-br-4 th-14'
                                onClick={() => handleClearFilter()}
                              >
                                Clear All
                              </Button>
                            </div>
                            <div className='col-md-6 col-sm-6 col-6 pl-1'>
                              <Button
                                type='primary'
                                className='btn-block th-br-4 th-14'
                                onClick={() => handleFilter()}
                              >
                                Get Classes
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-2 col-sm-6 col-12'>
                          <Button
                            type='primary'
                            className='btn-block th-br-4 th-14'
                            onClick={handleDownload}
                            style={{ fontSize: '12px', padding: '5px' }}
                          >
                            Download Class Data
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Form>
              </div>
            </div>
            <div className='th-bg-white th-tabs mt-1'>
              <Tabs
                type='card'
                onChange={(key) => setTabValue(key.toString())}
                activeKey={tabValue}
              >
                <TabPane tab={<div>Today</div>} key='0'>
                  {TabContent()}
                </TabPane>
                <TabPane tab={<div>Upcoming</div>} key='1'>
                  {' '}
                  {TabContent()}
                </TabPane>
                <TabPane tab={<div>Completed</div>} key='2'>
                  {' '}
                  {TabContent()}
                </TabPane>
                <TabPane tab={<div>Cancelled</div>} key='3'>
                  {' '}
                  {TabContent()}
                </TabPane>
              </Tabs>
            </div>
          </div>
          {(user_level == 13 || user_level == 12) && isOrchids ? (
            <div
              className='row justify-content-end '
              style={{ position: 'fixed', bottom: '5%', right: '2%' }}
            >
              <div
                className='th-bg-white px-2 py-1 th-br-6 th-pointer'
                style={{ border: '1px solid #d9d9d9' }}
                onClick={() => setShowGrievanceModal(true)}
              >
                Not able to attend/join online classes?
                <br />
                <span className='th-primary pl-1' style={{ textDecoration: 'underline' }}>
                  Raise your query
                </span>
              </div>
            </div>
          ) : null}
          {showGrievanceModal && (
            <GrievanceModal
              module={'Online Class'}
              title={'Online Class Related Query'}
              showGrievanceModal={showGrievanceModal}
              handleClose={handleCloseGrievanceModal}
            />
          )}
          {selectedViewMore && (
            <Drawer
              title='Period Dates'
              placement='right'
              onClose={handleClose}
              visible={selectedViewMore}
              width={500}
              // zIndex={1000}
            >
              <SideDrawer
                setLoading={setLoading}
                historicalData={historicalData}
                tabValue={tabValue}
                loading={loading}
                fullData={selectedViewMore}
                handleClose={handleClose}
                viewMoreRef={viewMoreRef}
                selectedGrade={selectedGrade}
              />
            </Drawer>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ErpAdminViewClassv2;
