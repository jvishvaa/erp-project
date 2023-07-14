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

const EbookView = (props) => {
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
  const [volumeId, setvolumeId] = useState();
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
      module_id: moduleId,
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
      .get(`${endpoints.newEbook.ebookSubject}`, {
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

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
      // board: null,
    });
    setSubjectData([]);
    handleClearSubject();
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
      setCentralGrade(item.key);
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: item.value,
        book_type: props?.showTab == 1 ? 3 : 4,
      });
    }
  };
  useEffect(() => {
    if (user_level == 13) {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade: gradeId,
        book_type: props?.showTab == 1 ? 3 : 4,
      });
    }
  }, [gradeId]);
  const handleClearGrade = () => {
    setGradeId('');
    setGradeName('');
    setCentralGrade('');
    setSubjectId('');
    setCentralSubject('');
    setSubjectName('');
    setvolumeId('');
    setvolumeName('');
    setEbookData([]);
    fetchEbooksDefault({
      book_type: '3',
      session_year: selectedAcademicYear?.session_year,
      page_number: page,
      page_size: '10',
      domain_name: domain_name,
    });
    setRecently(true);
    formRef.current.setFieldsValue({
      grade: null,
      subject: null,
      volume: null,
    });
  };
  const handleSubject = (item) => {
    if (item) {
      setSubjectId(item.value);
      setCentralSubject(item.centralId);
      setSubjectName(item.children);
    }
  };
  const handleClearSubject = () => {
    setSubjectId('');
    setCentralSubject('');
    setSubjectName('');
  };
  const handleBoard = (e) => {
    setvolumeId(e);
  };
  const handleClearBoard = () => {
    setvolumeId('');
    setvolumeName('');
    setEbookData([]);
  };

  const handlePageChange = (e) => {
    setPage(e);
  };

  const gradeOptions = gradeData?.map((each, i) => {
    return (
      <Option key={each.central_grade} value={each.erp_grade}>
        {each?.erp_grade_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each, i) => {
    return (
      <Option
        key={each.erp_subject_id}
        value={each.erp_subject_id}
        centralId={each.eduvate_subject_id}
      >
        {each?.erp_sub_name}
      </Option>
    );
  });
  const boardOptions = volumeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });

  useEffect(() => {
    if (moduleId) {
      fetchGradeData();
      fetchVolumeData();
    }
    setRecently(true);
  }, [moduleId, props?.showTab]);

  useEffect(() => {
    setRecently(true);
  }, [props?.changeRecent]);

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
    if (subjectId && volumeId) {
      setRecently(false);
      if (props?.showTab == 1) {
        fetchEbooks({
          grade: centralGrade,
          subject: centralSubject,
          is_ebook: 'true',
          volume: volumeId,
          branch: selectedBranch?.branch?.id,
          domain_name: domain_name,
          academic_year: selectedAcademicYear?.id,
          session_year: selectedAcademicYear?.session_year,
          page_number: page,
          page_size: '10',
          book_type: '3',
        });
      } else if (props?.showTab == 2) {
        fetchIbooks({
          branch: selectedBranch?.branch?.id,
          academic_year: selectedAcademicYear?.id,
          session_year: selectedAcademicYear?.session_year,
          is_ebook: 'true',
          ebook_type: '1',
          grade: centralGrade,
          subject: centralSubject,
          volume: volumeId,
          domain_name: domain_name,
          page: page,
          page_size: '10',
          book_type: '4',
        });
      }
    }
  }, [subjectId, volumeId, page]);

  useEffect(() => {
    handleClearGrade();
    if (props?.showTab == 1) {
      fetchEbooksDefault({
        book_type: '3',
        session_year: selectedAcademicYear?.session_year,
        page_number: page,
        page_size: '10',
        domain_name: domain_name,
      });
    }
    if (props?.showTab == 2) {
      fetchIbooksDefault({
        book_type: '4',
        session_year: selectedAcademicYear?.session_year,
        page_number: page,
        page_size: '10',
        domain_name: domain_name,
      });
    }
  }, [props?.showTab, props?.changeRecent]);

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

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              <div className='col-md-2 col-6 px-0'>
                <div className='mb-2 text-left'>Grade</div>
                <Form.Item name='grade'>
                  <Select
                    allowClear
                    placeholder={
                      gradeName ? (
                        <span className='th-black-1'>{gradeName}</span>
                      ) : (
                        'Select Grade'
                      )
                    }
                    showSearch
                    disabled={user_level == 13}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleGrade(value);
                    }}
                    onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                <div className='mb-2 text-left'>Subject</div>
                <Form.Item name='subject'>
                  <Select
                    allowClear
                    placeholder='Select Subject'
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleSubject(value);
                    }}
                    onClear={handleClearSubject}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                <div className='mb-2 text-left'>Volume</div>
                <Form.Item name='volume'>
                  <Select
                    placeholder='Select Volume'
                    allowClear
                    //   defaultValue={'CBSE'}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e) => {
                      handleBoard(e);
                    }}
                    onClear={handleClearBoard}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {boardOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
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
                  {recently ? 'Recently Viewed Books' : ''}
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
                  {recently ? 'Recently Viewed Books' : ''}
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

export default EbookView;
