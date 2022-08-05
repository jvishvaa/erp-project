import React, { useState, useEffect, createRef, useRef } from 'react';
import { Select, Form, message, Drawer, Space, Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import notesIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/notesIcon.svg';
import pointerNotesIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pointerNotesIcon.svg';
import pptIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/pptIcon.svg';
import scheduleIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/scheduleIcon.svg';
import youtubeIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/youtubeIcon.svg';

const { Option } = Select;

const planData = [
  {
    period: 'Rhyming Sounds: Period 1',
    module: 'XYZ',
    chapter: 'Chapter 4 - Rhyming Words',
    resources: 5,
    status: 'Completed',
    assigned: 'Ms. Shailaja Gosain',
    date: '19/06/2022',
  },
  {
    period: 'Rhyming Sounds: Period 2',
    module: 'XYZ',
    chapter: 'Chapter 4 - Rhyming Words',
    resources: 5,
    status: 'Completed',
    assigned: 'Ms. Shailaja Gosain',
    date: '19/06/2022',
  },
  {
    period: 'Rhyming Sounds: Period 3',
    module: 'XYZ',
    chapter: 'Chapter 4 - Rhyming Words',
    resources: 5,
    status: 'Not Completed',
    assigned: 'Ms. Shailaja Gosain',
    date: '19/06/2022',
  },
  {
    period: 'Rhyming Sounds: Period 4',
    module: 'XYZ',
    chapter: 'Chapter 4 - Rhyming Words',
    resources: 5,
    status: 'Completed',
    assigned: 'Ms. Shailaja Gosain',
    date: '19/06/2022',
  },
];

const ResourcesIcon = [notesIcon, youtubeIcon, pptIcon, pointerNotesIcon, scheduleIcon];

const PeriodView = () => {
  const formRef = createRef();
  const [cardIndex, setCardIndex] = useState(0);
  const slider = useRef(null);

  function scroll(e) {
    if (slider === null) return 0;

    e.wheelDelta < 0 ? slider.current.slickNext() : slider.current.slickPrev();
  }
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const settings = {
    className: 'center',
    dots: false,
    infinite: true,
    lazyload: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '35px',
    beforeChange: (current, next) => {
      setCardIndex(next);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: 2,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res.data.status_code === 200) {
          setGradeData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSectionData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.academics.subjects}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: null,
      subject: null,
    });
    setSectionData([]);
    setSubjectData([]);
    if (e) {
      setGradeId(e);

      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: 2,
        grade_id: e,
      });
    }
  };
  const handleSection = (e) => {
    formRef.current.setFieldsValue({
      subject: null,
    });
    setSubjectData([]);
    if (e) {
      setSectionId(e);
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch: selectedBranch?.branch?.id,
        module_id: 2,
        grade: gradeId,
        section: e,
      });
    }
  };
  const handleSubject = (e) => {
    setSubjectId(e);
  };
  const handleClearSubject = () => {
    setSubjectId('');
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject__id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const handleClearSection = () => {
    setSectionId('');
  };
  const handleClearGrade = () => {
    setGradeId('');
    setSectionId('');
  };

  useEffect(() => {
    fetchGradeData();
  }, []);

  useEffect(() => {
    let slickListDiv = document.getElementById('slider');

    slickListDiv.addEventListener('wheel', scroll, true);

    return () => {
      slickListDiv.removeEventListener('wheel', scroll, true);
    };
  }, []);

  return (
    <div className='row mt-3'>
      <div className='col-12'>
        <Form id='filterForm' ref={formRef} layout={'horizontal'}>
          <div className='row align-items-center'>
            <div className='col-md-2 col-6 px-0'>
              <Form.Item name='grade'>
                <Select
                  allowClear
                  placeholder='Select Grade'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleGrade(e);
                  }}
                  onClear={handleClearGrade}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {gradeOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2 col-6 pr-0'>
              <Form.Item name='section'>
                <Select
                  allowClear
                  placeholder='Select Section'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleSection(e);
                  }}
                  onClear={handleClearSection}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {sectionOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
              <Form.Item name='subject'>
                <Select
                  placeholder='Select Subject'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleSubject(e);
                  }}
                  onClear={handleClearSubject}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {subjectOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
              <Form.Item name='volume'>
                <Select
                  placeholder='Select Volume'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleSubject(e);
                  }}
                  onClear={handleClearSubject}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {subjectOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
              <Form.Item name='topic'>
                <Select
                  placeholder='Select Topic'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleSubject(e);
                  }}
                  onClear={handleClearSubject}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >
                  {subjectOptions}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      <div className='row pt-4' id='slider'>
        <Slider
          {...settings}
          className='th-slick'
          style={{ width: 'inherit' }}
          ref={slider}
        >
          {planData?.map((item, i) => (
            <div className='th-custom-col-padding px-2 py-3 th-br-6'>
              <div
                className={`${i === cardIndex ? 'slide activeSlide' : 'slide'} th-br-6`}
                style={{ border: '1px solid #d9d9d9', minHeight: 170 }}
                onClick={() => showDrawer()}
              >
                <div
                  className='row px-2 py-1 th-bg-grey th-black-1'
                  style={{
                    borderBottom: '1px solid #d9d9d9',
                    borderRadius: '6px 6px 0 0',
                  }}
                >
                  {item.period}
                </div>
                <div className='row px-2 py-2 flex-column th-black-2'>
                  <div>
                    Module: <span className='th-primary'>{item.module}</span>
                  </div>
                  <div>
                    Chapter: <span className='th-primary'>{item.chapter}</span>
                  </div>
                </div>
                <div className='row px-2 py-2 flex-column th-black-2'>
                  <div>
                    Resources: <span className='th-primary'>5</span>
                  </div>
                  <div>
                    Status:
                    {item?.status === 'Completed' ? (
                      <span className='th-green'>
                        {item.status} by {item.assigned}
                      </span>
                    ) : (
                      <span className='th-red'>{item.status}</span>
                    )}
                  </div>
                </div>
                <div
                  className='row px-2 py-1 th-14 th-grey '
                  style={{ borderTop: '1px solid #d9d9d9' }}
                >
                  Last Updated on: {item.date}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div>
        <Drawer
          title='Resources'
          placement='right'
          onClose={closeDrawer}
          visible={drawerVisible}
          closable={false}
          extra={
            <Space>
              <CloseOutlined onClick={closeDrawer} />
            </Space>
          }
        >
          {planData?.map((item, i) => (
            <div
              className='th-br-6 mb-4'
              style={{ border: '1px solid #d9d9d9', minHeight: 170 }}
            >
              <div
                className='row px-2 py-1 th-bg-grey th-black-1 justify-content-between'
                style={{
                  borderBottom: '1px solid #d9d9d9',
                  borderRadius: '6px 6px 0 0',
                }}
              >
                {item.period}
                <Checkbox className='th-custom-checkbox' />
              </div>
              <div className='row px-2 py-2 flex-column th-black-2'>
                <div>
                  Module: <span className='th-primary'>{item.module}</span>
                </div>
                <div>
                  Chapter: <span className='th-primary'>{item.chapter}</span>
                </div>
              </div>
              <div className='row px-2 py-2 flex-column th-black-2'>
                <div>
                  Resources: <span className='th-primary'>5</span>
                </div>
                <div className='row py-2 justify-content-between'>
                  {ResourcesIcon.map((item) => (
                    <img src={item} />
                  ))}
                </div>
              </div>
              <div
                className='row px-2 py-1 th-14 th-grey '
                style={{ borderTop: '1px solid #d9d9d9' }}
              >
                Last Updated on: {item.date}
              </div>
            </div>
          ))}
        </Drawer>
      </div>
    </div>
  );
};

export default PeriodView;
