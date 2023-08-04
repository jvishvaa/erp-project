import React, { useState, useEffect, createRef } from 'react';
import { Select, Form, message, Spin } from 'antd';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import './index.css';
import { useHistory } from 'react-router-dom';
import { CaretDownOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { EyeFilled } from '@ant-design/icons';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import axiosInstance from 'config/axios';
import './newebook.scss';
import { Card, Divider, Tag, Button, Pagination } from 'antd';
import moment from 'moment';
import EbookCards from './ebookcards.js';
import NewIbook from './newIbooks';
const { Option } = Select;

const EbookViewStudent = (props) => {
  const formRef = createRef();
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [moduleId, setModuleId] = useState();

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const [volumeData, setvolumeData] = useState([]);
  const [volumeId, setvolumeId] = useState(null);
  const [volumeName, setvolumeName] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState();
  const [centralGrade, setCentralGrade] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState();
  const [centralSubject, setCentralSubject] = useState();
  const [annualPlanData, setAnnualPlanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [ebookData, setEbookData] = useState([]);
  const [ibookData, setIbookData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [recently, setRecently] = useState(false);
  const [ibookSortedData, setIbookSortedData] = useState([]);
  const [showCategoryCount, setShowCategoryCount] = useState(5);
  const [selectedSubject, setSelectedSUbject] = useState('');
  const env = window.location.host;
  const domain = window.location.host.split('.');
  let domain_name =
    env.includes('qa') || env.includes('localhost')
      ? 'olvorchidnaigaon'
      : env.includes('test')
      ? 'orchids'
      : domain[0];

  const fetchVolumeData = () => {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setvolumeData(result?.data?.result?.results);
        } else {
        }
      })
      .catch((error) => {});
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      // module_id: moduleId,
      book_id: props?.showTab == 1 ? 3 : 4,
    };
    axiosInstance
      .get(`${endpoints.newEbook.ebookGrade}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.result);
          if (user_level == 13) {
            setGradeId(res?.data?.result[0]?.erp_grade);
            setGradeName(res?.data?.result[0]?.erp_grade_name);
            setCentralGrade(res?.data?.result[0]?.central_grade);
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchSubjectData = (params = {}) => {
    axiosInstance
      .get(`${endpoints.newEbook.ebookSubjectStudent}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    console.log('hit subject tab change');
    if (user_level == 13) {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        academic_year: selectedAcademicYear?.session_year,
        book_type: props?.showTab == 1 ? 3 : 4,
      });
    }
  }, [gradeId]);

  const handleSubject = (item) => {
    if (item) {
      setSubjectId(item.erp_subject_id);
      setCentralSubject(item.eduvate_subject_id);
      setSubjectName(item.erp_sub_name);
      setSelectedSUbject(item);
      setPage(1);
      setvolumeId(null);
      formRef.current.setFieldsValue({
        volume: 'All',
      });
    }
  };

  const handleBoard = (e, val) => {
    console.log(e, val, 'volume');
    setvolumeId(val);
  };
  const handleClearBoard = () => {
    setvolumeId('');
    setvolumeName('');
    setEbookData([]);
  };

  const handlePageChange = (e) => {
    setPage(e);
  };

  const boardOptions = volumeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });

  useEffect(() => {
    fetchGradeData();
    fetchVolumeData();
  }, [props?.showTab]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    let domain = window.location.host.split('.');
    console.log(subjectId, volumeId, page, selectedSubject, centralGrade, 'idss');
    if (
      selectedSubject != '' &&
      centralGrade != undefined &&
      subjectId != undefined &&
      page
    ) {
      setRecently(false);
      if (props?.showTab == 1) {
        let obj = {
          grade: centralGrade,
          subject: centralSubject,
          is_ebook: 'true',
          branch: selectedBranch?.branch?.id,
          domain_name: domain_name,
          academic_year: selectedAcademicYear?.id,
          session_year: selectedAcademicYear?.session_year,
          page_number: page,
          page_size: '8',
          book_type: '3',
        };

        if (volumeId != null && volumeId?.key != '0') {
          obj['volume'] = volumeId?.value;
        }
        fetchEbooks(obj);
      } else if (props?.showTab == 2) {
        let obj = {
          branch: selectedBranch?.branch?.id,
          academic_year: selectedAcademicYear?.id,
          session_year: selectedAcademicYear?.session_year,
          is_ebook: 'true',
          ebook_type: '1',
          grade: centralGrade,
          subject: centralSubject,
          domain_name: domain_name,
          page: page,
          page_size: '8',
          book_type: '4',
        };
        if (volumeId != null && volumeId?.key != '0') {
          obj['volume'] = volumeId?.value;
        }
        fetchIbooks(obj);
      }
    }
  }, [volumeId, page, selectedSubject]);

  const fetchEbooks = (params) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newEbook.ebookList}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          message.success('Ebooks Fetched Successfully', [0.0002]);
          setLoading(false);
          setEbookData(res.data.result.data);
          setTotal(res.data.result.total_ebooks);
        } else {
          message.error(res.data.description);
          setLoading(false);
          setEbookData([]);
          setTotal();
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchEbooksDefault = (params) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newEbook.ebookList}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          // message.success('Ebooks Fetched Successfully', [0.0002]);
          setLoading(false);
          setEbookData(res.data.result.data);
          setTotal(res.data.result.total_ebooks);
        } else {
          message.error(res.data.description);
          setLoading(false);
          setEbookData([]);
          setTotal();
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchIbooks = (params) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newibook.ibookList}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setIbookData(res.data.result.result);
          setTotal(res.data.result.count);
          message.success('Ibooks Fetched Successfully', [0.0002]);
          setLoading(false);
        } else {
          message.error(res.data.description);
          setLoading(false);
          setIbookData([]);
          setTotal();
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchIbooksDefault = (params) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newibook.ibookList}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setIbookData(res.data.result.result);
          setTotal(res.data.result.count);
          // message.success('Ibooks Fetched Successfully', [0.0002]);
          setLoading(false);
        } else {
          message.error(res.data.description);
          setLoading(false);
          setIbookData([]);
          setTotal();
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (ibookData?.length > 0) {
      setIbookSortedData(getSortedIbookData(ibookData));
    } else {
      setIbookSortedData([]);
    }
  }, [ibookData]);

  const getSortedIbookData = (data) => {
    const conceptWisedata = data
      ?.sort((a, b) => Number(a.chapter) - Number(b.chapter))
      ?.reduce((initialValue, data) => {
        let key = data?.chapter_name;
        if (!initialValue[key]) {
          initialValue[key] = [];
        }
        initialValue[key].push(data);
        return initialValue;
      }, {});
    const sortedConceptData = Object.keys(conceptWisedata)?.map((concept) => {
      return {
        concept,
        data: conceptWisedata[concept],
      };
    });

    return sortedConceptData;
  };

  const handleReadEbook = (data) => {
    console.log(data);
  };

  useEffect(() => {
    formRef.current.setFieldsValue({
      volume: 'All',
    });
  }, []);

  useEffect(() => {
    if (subjectData?.length > 0) {
      handleSubject(subjectData[0]);
    }
  }, [subjectData]);

  return (
    <>
      <div className='col-12 d-flex justify-content-start '>
        <Form id='filterForm' ref={formRef} layout={'horizontal'} className='col-md-2'>
          <div className='row align-items-center'>
            <div className='col-md-12 col-6 pr-0 px-0'>
              <div className='mb-2 text-left'>Volume</div>
              <Form.Item name='volume'>
                <Select
                  placeholder='Select Volume'
                  allowClear
                  defaultActiveFirstOption={true}
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, val) => {
                    handleBoard(e, val);
                  }}
                  onClear={handleClearBoard}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {volumeData?.length > 0 && (
                    <Option key='0' value='All'>
                      All
                    </Option>
                  )}
                  {boardOptions}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
      <div className='row'>
        <div className='mb-3'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='row'>
                {subjectData?.slice(0, showCategoryCount).map((item) => (
                  <div className='md-1 px-1 py-1'>
                    <Button
                      className={`${
                        item?.eduvate_subject_id == selectedSubject?.eduvate_subject_id
                          ? 'th-button-active'
                          : 'th-button'
                      } th-br-4`}
                      onClick={() => handleSubject(item)}
                    >
                      <span>{item?.erp_sub_name}</span>
                    </Button>
                  </div>
                ))}
                {subjectData?.length > 5 && (
                  <div className='md-1 px-1 py-1'>
                    <Button
                      className='th-button th-br-4'
                      type='secondary'
                      onClick={() => {
                        showCategoryCount == subjectData?.length
                          ? setShowCategoryCount(5)
                          : setShowCategoryCount(subjectData?.length);
                      }}
                    >
                      Show {showCategoryCount == subjectData?.length ? 'Less' : 'All'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ minHeight: '55vh' }}>
        {loading ? (
          <div className='row justify-content-center py-3 mt-5'>
            <Spin title='Loading...' />
          </div>
        ) : (
          <>
            {props?.showTab == 1 ? (
              <div>
                <span style={{ marginLeft: '1%', fontSize: '20px' }}>
                  {/* {recently ? 'Recently Viewed Books' : ''} */}
                </span>
                <EbookCards
                  data={ebookData}
                  total={total}
                  page={page}
                  handlePageChange={handlePageChange}
                  recently={recently}
                  fetchEbooksDefault={fetchEbooksDefault}
                  fetchEbooks={fetchEbooks}
                  centralGrade={centralGrade}
                  centralSubject={centralSubject}
                  volumeId={volumeId}
                  branchId={selectedBranch?.branch?.id}
                />
              </div>
            ) : props?.showTab == 2 ? (
              <div>
                <span style={{ marginLeft: '1%', fontSize: '20px' }}>
                  {/* {recently ? 'Recently Viewed Books' : ''} */}
                </span>
                <NewIbook
                  data={ibookSortedData}
                  total={total}
                  page={page}
                  handlePageChange={handlePageChange}
                  centralSubject={centralSubject}
                />
              </div>
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EbookViewStudent;
