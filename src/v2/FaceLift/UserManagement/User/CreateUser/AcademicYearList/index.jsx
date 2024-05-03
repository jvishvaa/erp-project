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
  message,
} from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import endpointsV1 from 'config/endpoints';
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
  editId,
  userLevel,
  isOrchids,
  roleBasedUiConfig,
  selectedUserLevel,
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
  const [selectedAcadId, setSelectedAcadId] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [branchCode, setBranchCode] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (userLevel) {
      
   
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
    if (currentObj.acadId) {
      setSelectedAcadId(currentObj.acadId);
      console.log(currentObj.acadId, 'currentObj.acadId');
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
      fetchBranches(currentObj?.academic_year, module);
      fetchGrades(
        currentObj?.branch,
        null,
        module,
        currentObj?.academic_year,
        currentObj.acadId
      );

      if (roleBasedUiConfig?.includes(userLevel?.toString())) {
        fetchSubjects(currentObj?.editGrade, null, null, null, null, currentObj.acadId);
      } else {
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
    }
  }
  }, [module,userLevel]);
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
  const fetchBranches = (session_year, module) => {
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
            acadId: obj.acadId,
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

  const fetchGrades = (branches, branch_code, module, session_year, acadId) => {
    if (branches?.length > 0) {
      setBranchCode(branch_code);
      setSelectedBranch(branches);
      setSelectedAcadId(acadId);
      console.log({ acadId, userLevel, selectedUserLevel }, 'testing');
      if (roleBasedUiConfig?.includes(userLevel?.toString())) {
        axiosInstance
          .get(`${endpointsV1.userManagement.gradeList}`, {
            params: {
              acad_session: acadId ? acadId?.join(',') : selectedAcadId?.join(','),
            },
          })
          .then((response) => {
            if (response.data.status_code === 200) {
              const transformedData = response.data.result?.map((obj) => ({
                // item_id: grade?.id,
                id: obj?.grade_id,
                grade_name: obj?.grade__grade_name,
                // branch_id: grade?.acad_session__branch_id,
              }));
              setGrades([...transformedData]);
            }
          })
          .catch((error) => {
            message.error(error?.response?.data?.message ?? 'Something went wrong!');
          })
          .finally(() => {
            // setLoading(false);
          });
        return;
      }
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
        .catch((err) => {
          console.log(err);
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
            setSections([...transformedData]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setSections([]);
    }
  };

  const fetchSubjects = (
    sections,
    editBranch,
    editGrade,
    module,
    session_year,
    acadId
  ) => {
    if (sections?.length > 0) {
      setSelectedSections(sections);
      let newEditGrade = [...new Set(editGrade)];
      let newsec = [...new Set(sections)];
      let params1 = {
        ...(roleBasedUiConfig?.includes(userLevel?.toString())
          ? {
              acad_session: acadId ? acadId?.join(',') : selectedAcadId?.join(','),
              grades: sections?.join(','),
            }
          : {
              session_year: selectedYear ?? session_year,
              branch: editBranch ? editBranch?.join(',') : selectedBranch?.join(','),
              grade: editGrade ? newEditGrade?.join(',') : selectedGrade?.join(','),
              section: newsec?.join(','),
              module_id: module ?? moduleId,
            }),
      };
      axiosInstance
        .get(
          `${
            roleBasedUiConfig?.includes(userLevel?.toString())
              ? endpointsV1.userManagement.subjectList
              : endpoints.academics.subjects
          }`,
          { params: params1 }
        )
        .then((response) => {
          if (response.data.status_code === 200) {
            const transformedData = response?.data?.data
              ? response?.data?.data.map((obj) => ({
                  id: obj.subject__id,
                  item_id: obj.subject__id,
                  subject_name: obj.subject__subject_name,
                }))
              : response?.data?.result
              ? response?.data?.result.map((obj) => ({
                  id: obj.subject_id,
                  item_id: obj.subject_id,
                  subject_name: obj.subject__subject_name,
                }))
              : [];
            if (transformedData?.length > 0) {
              setSubjects([...transformedData]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
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
    <Select.Option
      key={each?.id}
      value={each?.id}
      code={each?.branch_code}
      acadId={each?.acadId}
    >
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
    <Select.Option key={each?.item_id} value={each?.item_id} id={each?.id}>
      {each?.subject_name}
    </Select.Option>
  ));
  const onChange = (value, name, obj) => {
    let newData = multipleAcademicYear;
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].id === currentObj.id) {
        newData[i][name] = value;
        if (name === 'branch') {
          newData[i]['acadId'] = obj.map(each => each?.acadId);
          newData[i]['branchObj'] = obj;
        }
        if (name==='academic_year') {
          newData[i]['academicYearObj'] = obj;
        } 
        if (name==='subjects') {
          newData[i]['subjectsObj'] = obj;
        } 
      }
    }
    setMultipleAcademicYear([...newData]);
  };
  const onChangeGrade = (value, mappinIds,obj) => {
    let newData = multipleAcademicYear;
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].id === currentObj.id) {
        newData[i]['grade'] = value;
        newData[i]['editGrade'] = mappinIds;
        newData[i]['gradeObj'] = obj;
      }
    }
    setMultipleAcademicYear([...newData]);
  };

  const onChangeSection = (value, mappinIds) => {
    let newData = multipleAcademicYear;
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].id === currentObj.id) {
        newData[i]['section'] = value;
        newData[i]['editSection'] = mappinIds;
      }
    }
    setMultipleAcademicYear([...newData]);
  };
  const handleDelete = () => {
    setMultipleAcademicYear(multipleAcademicYear?.filter((e) => e.id !== currentObj?.id));
  };
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
                  fetchBranches(e, moduleId);
                  acadForm.current.resetFields([
                    'branch',
                    'grade',
                    'section',
                    'subjects',
                  ]);
                  onChange(e, 'academic_year',obj);
                  setBranches([]);
                  setGrades([]);
                  setSections([]);
                  setSubjects([]);
                }}
                getPopupContainer={(trigger) => trigger.parentNode}
                listHeight={150}
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
                disabled={
                  currentObj?.isEdit &&
                  isOrchids &&
                  !(is_superuser || user_level === 1) &&
                  userLevel === 13
                }
                onChange={(e, obj) => {
                  if (e.includes('all')) {
                    let values = branches?.map((e) => e?.id);
                    acadForm.current.setFieldsValue({
                      branch: values,
                    });
                    let acadId = branches?.map((e) => e?.acadId);
                    let branch_code = branches?.map((i) => i.branch_code);
                    fetchGrades(values, branch_code, null, null, acadId);
                    onChange(values, 'branch', branches);
                  } else {
                    let acadId = obj?.map((e) => e?.acadId);
                    let branch_code = obj?.map((i) => i.code);
                    fetchGrades(e, branch_code, null, null, acadId);
                    onChange(e, 'branch', obj);
                  }
                  acadForm.current.resetFields(['grade', 'section', 'subjects']);
                  setGrades([]);
                  setSections([]);
                  setSubjects([]);
                }}
                getPopupContainer={(trigger) => trigger.parentNode}
                listHeight={150}
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
                disabled={
                  currentObj?.isEdit &&
                  isOrchids &&
                  !(is_superuser || user_level === 1) &&
                  userLevel === 13
                }
                getPopupContainer={(trigger) => trigger.parentNode}
                listHeight={150}
                onChange={(e, value) => {
                  if (e.includes('all')) {
                    let values = grades?.map((e) => e?.grade_name);
                    acadForm.current.setFieldsValue({
                      grade: values,
                    });
                    if (roleBasedUiConfig?.includes(userLevel?.toString())) {
                      fetchSubjects(grades?.map((e) => e.id));
                    } else {
                      fetchSections(grades?.map((e) => e?.id));
                    }
                    onChangeGrade(
                      values,
                      grades?.map((e) => e.id),
                      grades
                    );
                  } else {
                    if (roleBasedUiConfig?.includes(userLevel?.toString())) {
                      fetchSubjects(value?.map((e) => e.id));
                    } else {
                      fetchSections(value?.map((e) => e.id));
                    }
                    onChangeGrade(
                      e,
                      value?.map((e) => e.id),
                      value
                    );
                  }
                  acadForm.current.resetFields(['section', 'subjects']);
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
          {!roleBasedUiConfig?.includes(userLevel?.toString()) ? (
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
                  listHeight={150}
                  onChange={(e, value) => {
                    if (e.includes('all')) {
                      let values = sections?.map((e) => e?.item_id);
                      acadForm.current.setFieldsValue({
                        section: values,
                      });
                      fetchSubjects(sections?.map((e) => e?.id));
                      onChangeSection(
                        values,
                        sections?.map((e) => e.id)
                      );
                    } else {
                      fetchSubjects(value?.map((e) => e.id));
                      onChangeSection(
                        e,
                        value?.map((e) => e.id)
                      );
                    }
                    acadForm.current.resetFields(['subjects']);
                    setSubjects([]);
                  }}
                  showSearch
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
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
          ) : null}
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
                listHeight={150}
                maxLength={maxSubjectSelection ?? subjects?.length}
                onChange={(e, value) => {
                  console.log(e, value, subjects, 'drop');
                  if (e.includes('all')) {
                    let values = subjects?.map((e) => e?.item_id);
                    let valuesId = subjects?.map((e) => e?.id);
                    acadForm.current.setFieldsValue({
                      subjects: values,
                    });
                    setSelectedSubjects(subjects?.map((e) => e?.item_id));
                    onChange(values, 'subjects',subjects);
                    onChange(valuesId, 'subjectsId');
                  } else {
                    setSelectedSubjects(value?.map((e) => value?.value));
                    onChange(e, 'subjects',value);
                    let subjectids = value?.map((e) => e?.id);
                    onChange(subjectids, 'subjectsId');
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
          {currentObj?.isEdit ? (
            userLevel == 13 && isOrchids ? null : (
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
            )
          ) : (
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
