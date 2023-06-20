import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Row,
  Select,
} from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';
const { Option } = Select;
const AcademicYearList = ({
  multipleAcademicYear,
  setMultipleAcademicYear,
  currentObj,
  maxSubjectSelection,
  roleConfig,
  user_level,
  is_superuser,
}) => {
  const acadForm = useRef();
  const [moduleId, setModuleId] = useState('');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [branchCode, setBranchCode] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  useEffect(() => {
    let NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    let module = '';
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
              module = item.child_id;
            }
          });
        }
      });
      fetchAcademicYears();
    }
    if (
      currentObj.academic_year ||
      currentObj.branch ||
      currentObj.grade ||
      currentObj.section ||
      currentObj.subjects
    ) {
      acadForm.current.setFieldsValue({
        academic_year: currentObj?.academic_year,
        branch: currentObj?.branch,
        grade: currentObj?.grade,
        section: currentObj?.section,
        subjects: currentObj?.subjects,
      });
      console.log(currentObj, 'currentObj');
      fetchBranches(currentObj?.academic_year);
      fetchGrades(currentObj?.branch, null, module, currentObj?.academic_year);
      fetchSections(
        currentObj?.editGrade,
        null,
        currentObj?.branch,
        module,
        currentObj?.academic_year
      );
      fetchSubjects(
        currentObj?.editSection,
        currentObj?.branch,
        currentObj?.editGrade,
        module,
        currentObj?.academic_year
      );
    }
  }, [module]);
  const fetchAcademicYears = () => {
    let url = '/erp_user/list-academic_year/';
    if (moduleId) url += `?module_id=${moduleId}`;
    axiosInstance
      .get(url)
      .then((response) => {
        let transformedData = response.data.data?.map((obj = {}) => ({
          id: obj?.id || '',
          session_year: obj?.session_year || '',
          is_default: obj?.is_current_session || '',
        }));
        setAcademicYears(transformedData);
      })
      .catch(() => {});
  };
  const fetchBranches = (session_year) => {
    setSelectedYear(session_year);
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${session_year}&module_id=${module}`
      )
      .then((response) => {
        if (response.data.status_code === 200) {
          var data = response?.data?.data?.results.map((obj) => {
            let tempArr = obj?.branch;
            tempArr['acadId'] = obj?.id;
            return tempArr;
          });
          const transformedData = data?.map((obj) => ({
            id: obj.id,
            branch_name: obj.branch_name,
            branch_code: obj.branch_code,
          }));
          // if (transformedData?.length > 1) {
          //   transformedData.unshift({
          //     id: 'all',
          //     branch_name: 'Select All',
          //     branch_code: 'all',
          //   });
          // }
          setBranches([...transformedData]);
        } else {
        }
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetchGrades = (branches, branch_code, module, session_year) => {
    if (branches?.length > 0) {
      setBranchCode(branch_code);
      setSelectedBranch(branches);
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${
            selectedYear ?? session_year
          }&branch_id=${branches?.toString()}&module_id=${module ?? moduleId}`
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((grade) => ({
                  item_id: grade?.id,
                  id: grade?.grade_id,
                  grade_name: grade?.grade__grade_name,
                  branch_id: grade?.acad_session__branch_id,
                }))
              : [];
            if (transformedData?.length > 1) {
              //   transformedData.unshift({
              //     item_id: 'all',
              //     id: 'all',
              //     grade_name: 'Select All',
              //     branch_id: '',
              //   });
              // }
            }
            setGrades([...transformedData]);
          }
        })
        .catch(() => {
          console.log('');
        });
    } else {
      setGrades([]);
    }
  };

  const fetchSections = (grades, grade_id, editBranch, module, session_year) => {
    if (grades?.length > 0) {
      setSelectedGrade(grades);
      axiosInstance
        .get(
          `${endpoints.academics.sections}?session_year=${
            selectedYear ?? session_year
          }&branch_id=${
            editBranch ? editBranch?.toString() : selectedBranch?.toString()
          }&grade_id=${grades?.toString()}&module_id=${module ?? moduleId}`
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((section) => ({
                  item_id: section.id,
                  id: section.section_id,
                  section_name: `${section.section__section_name}`,
                  branch_id: section?.branch_id,
                  grade_id: section?.grade_id,
                }))
              : [];
            console.log(transformedData, 'section');
            setSections([...transformedData]);
          }
        })
        .catch(() => {
          console.log('');
        });
    } else {
      setSections([]);
    }
  };

  const fetchSubjects = (sections, editBranch, editGrade, module, session_year) => {
    console.log(sections, editGrade, grades, 'oiyyui');
    if (sections?.length > 0) {
      setSelectedSections(sections);
      axiosInstance
        .get(
          `${endpoints.academics.subjects}?session_year=${
            selectedYear ?? session_year
          }&branch=${
            editBranch ? editBranch?.toString() : selectedBranch?.toString()
          }&grade=${
            editGrade ? editGrade?.toString() : selectedGrade?.toString()
          }&section=${sections?.toString()}&module_id=${module ?? moduleId}`
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((obj) => ({
                  id: obj.subject__id,
                  item_id: obj.id,
                  subject_name: obj.subject__subject_name,
                }))
              : [];
            if (transformedData?.length > 1) {
              //   transformedData.unshift({
              //     item_id: 'all',
              //     id: 'all',
              //     grade_name: 'Select All',
              //     branch_id: '',
              //   });
              // }
            }
            setSubjects([...transformedData]);
          }
        })
        .catch(() => {
          console.log('');
        });
    } else {
      setSubjects([]);
    }
  };
  const sessionOption = academicYears?.map((each) => (
    <Select.Option key={each?.id} value={each?.id}>
      {each?.session_year}
    </Select.Option>
  ));
  const branchOption = branches?.map((each) => (
    <Select.Option key={each?.id} value={each?.id} code={each?.branch_code}>
      {each?.branch_name}
    </Select.Option>
  ));
  const gradeOption = grades?.map((each) => (
    <Select.Option key={each?.item_id} value={each?.grade_name} id={each?.id}>
      {each?.grade_name}
    </Select.Option>
  ));
  const sectionOption = sections?.map((each) => (
    <Select.Option key={each?.item_id} value={each?.item_id} id={each?.id}>
      {each?.section_name}
    </Select.Option>
  ));
  const subjectOption = subjects?.map((each) => (
    <Select.Option key={each?.item_id} value={each?.id}>
      {each?.subject_name}
    </Select.Option>
  ));
  const onChange = (value, name) => {
    let newData = multipleAcademicYear;
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].id === currentObj.id) {
        newData[i][name] = value;
      }
    }
    setMultipleAcademicYear([...newData]);
  };
  const handleDelete = () => {
    setMultipleAcademicYear(multipleAcademicYear?.filter((e) => e.id !== currentObj?.id));
  };
  console.log(multipleAcademicYear, 'multipleAcademicYear');
  return (
    <React.Fragment>
      <Form ref={acadForm} layout='vertical'>
        <Divider className='my-1' />
        <Row className='py-2' gutter={24}>
          <Col md={8}>
            <Form.Item name={'academic_year'} label='Academic Year'>
              <Select
                disabled={currentObj?.isEdit}
                onChange={(e, obj) => {
                  fetchBranches(e);
                  acadForm.current.resetFields([
                    'branch',
                    'grade',
                    'section',
                    'subjects',
                  ]);
                  onChange(e, 'academic_year');
                  setBranches([]);
                  setGrades([]);
                  setSections([]);
                  setSubjects([]);
                }}
                getPopupContainer={(trigger) => trigger.parentNode}
                showSearch
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                placeholder='Academic Year'
                className='w-100'
              >
                {sessionOption}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item
              name={'branch'}
              rules={[
                {
                  required: true,
                  message: 'Please select branch!',
                },
              ]}
              label='Branch'
            >
              <Select
                maxTagCount={3}
                allowClear
                value={currentObj?.branch}
                onChange={(e, obj) => {
                  if (e.includes('all')) {
                    let values = branches?.map((e) => e?.id);
                    acadForm.current.setFieldsValue({
                      branch: values,
                    });
                    let branch_code = branches?.map((i) => i.branch_code);
                    fetchGrades(values, branch_code);
                    onChange(values, 'branch');
                  } else {
                    let branch_code = obj?.map((i) => i.code);
                    fetchGrades(e, branch_code);
                    onChange(e, 'branch');
                  }
                  acadForm.current.resetFields(['grade', 'section', 'subjects']);
                  setGrades([]);
                  setSections([]);
                  setSubjects([]);
                }}
                getPopupContainer={(trigger) => trigger.parentNode}
                showSearch
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode='multiple'
                placeholder='Branch'
                className='w-100'
              >
                {branches?.length > 1 && (
                  <Select.Option key={'all'} value={'all'}>
                    Select All
                  </Select.Option>
                )}
                {branchOption}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please select grade!',
                },
              ]}
              name={'grade'}
              required
              label='Grade'
            >
              <Select
                maxTagCount={3}
                allowClear
                value={currentObj?.grade}
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={(e, value) => {
                  if (e.includes('all')) {
                    let values = grades?.map((e) => e?.grade_name);
                    acadForm.current.setFieldsValue({
                      grade: values,
                    });
                    fetchSections(grades?.map((e) => e?.id));
                  } else {
                    fetchSections(value?.map((e) => e.id));
                  }
                  acadForm.current.resetFields(['section', 'subjects']);
                  // onChange(e, 'grade');
                  setSections([]);
                  setSubjects([]);
                }}
                showSearch
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode='multiple'
                placeholder='Grade'
                className='w-100'
              >
                {grades?.length > 1 && (
                  <Select.Option key={'all'} value={'all'}>
                    Select All
                  </Select.Option>
                )}
                {gradeOption}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item
              name={'section'}
              rules={[
                {
                  required: true,
                  message: 'Please select section!',
                },
              ]}
              label='Section'
            >
              <Select
                maxTagCount={3}
                allowClear
                value={currentObj?.section}
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={(e, value) => {
                  if (e.includes('all')) {
                    let values = sections?.map((e) => e?.item_id);
                    acadForm.current.setFieldsValue({
                      section: values,
                    });
                    fetchSubjects(sections?.map((e) => e?.id));
                    onChange(values, 'section');
                  } else {
                    fetchSubjects(value?.map((e) => e.id));
                    onChange(e, 'section');
                  }
                  acadForm.current.resetFields(['subjects']);
                  setSubjects([]);
                }}
                showSearch
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode='multiple'
                placeholder='Section'
                className='w-100'
              >
                {sections?.length > 1 && (
                  <Select.Option key={'all'} value={'all'}>
                    Select All
                  </Select.Option>
                )}
                {sectionOption}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please select subject',
                },
                {
                  validator: (_, value) => {
                    if (roleConfig?.includes(user_level) || is_superuser) {
                      return Promise.resolve();
                    }
                    if (value && value.length > maxSubjectSelection) {
                      return Promise.reject(
                        `You can select up to ${maxSubjectSelection} subjects.`
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              name={'subjects'}
              label='Subject'
            >
              <Select
                maxTagCount={3}
                allowClear
                value={currentObj?.subjects}
                getPopupContainer={(trigger) => trigger.parentNode}
                maxLength={maxSubjectSelection ?? subjects?.length}
                onChange={(e, value) => {
                  if (e.includes('all')) {
                    let values = subjects?.map((e) => e?.id);
                    acadForm.current.setFieldsValue({
                      subjects: values,
                    });
                    setSelectedSubjects(subjects?.map((e) => e?.id));
                    onChange(values, 'subjects');
                  } else {
                    setSelectedSubjects(value?.map((e) => e.id));
                    onChange(e, 'subjects');
                  }
                }}
                showSearch
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                mode='multiple'
                placeholder='Subject'
                className='w-100'
              >
                {subjects?.length > 1 &&
                  (roleConfig?.includes(user_level) || is_superuser) && (
                    <Select.Option key={'all'} value={'all'}>
                      Select All
                    </Select.Option>
                  )}
                {subjectOption}
              </Select>
            </Form.Item>
          </Col>
          {!currentObj?.isEdit && (
            <Col md={4}>
              <Form.Item label=' '>
                <Popconfirm
                  onConfirm={() => {
                    handleDelete();
                  }}
                  title='Are you sure to delete?'
                  okText='Yes'
                  cancelText='No'
                >
                  <Button type='primary' icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default AcademicYearList;
