import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
} from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import AcademicYearList from '../AcademicYearList';
import { useParams } from 'react-router-dom';
const SchoolInformation = ({
  roles,
  designations,
  fetchDesignation,
  branches,
  fetchGrades,
  grades,
  fetchSections,
  sections,
  fetchSubjects,
  subjects,
  handleNext,
  schoolFormValues,
  setSchoolFormValues,
  selectedYear,
  setSelectedSubjects,
  setSelectedSubjectsId,
  editId,
  multipleAcademicYear,
  setMultipleAcademicYear,
  sectionMappingId,
  setSectionMappingId,
  setUserLevel,
  setParent,
  userLevel,
  setGrades,
  setSections,
  setSubjects,
  maxSubjectSelection,
  roleConfig,
  editSessionYear,
}) => {
  const schoolForm = useRef();
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const is_superuser = userData?.is_superuser;
  const user_level = userData?.user_level;
  const params = useParams();
  useEffect(() => {
    if (schoolFormValues && Object.keys(schoolFormValues).length > 0) {
      schoolForm.current.setFieldsValue(schoolFormValues);
    } else {
      schoolForm.current.setFieldsValue({
        academic_year: selectedYear?.session_year,
      });
    }
  }, [schoolFormValues]);

  const roleOption = roles?.map((each) => (
    <Select.Option key={each?.id} value={each?.id}>
      {each?.level_name}
    </Select.Option>
  ));
  const designationOption = designations?.map((each) => (
    <Select.Option key={each?.id} value={each?.id}>
      {each?.designation}
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
    <Select.Option
      key={each?.item_id}
      value={each?.section_name}
      id={each?.id}
      mapping_id={each?.item_id}
    >
      {each?.section_name}
    </Select.Option>
  ));
  const subjectOption = subjects?.map((each) => (
    <Select.Option key={each?.item_id} value={each?.item_id} id={each?.id}>
      {each?.subject_name}
    </Select.Option>
  ));
  const handleSubmit = (formValues) => {
    if (editId) {
      let validateMultipeAcadFields = multipleAcademicYear?.filter(
        (each) =>
          !each?.academic_year ||
          each?.branch?.length == 0 ||
          each?.grade?.length == 0 ||
          each?.section?.length == 0 ||
          each?.subjects?.length == 0
      );
      if (validateMultipeAcadFields?.length > 0) {
        if (!validateMultipeAcadFields[0]?.academic_year) {
          message.error(
            'Academic Year, Branch, Grade, Section and Subject are required fields!'
          );
          return;
        }
        if (validateMultipeAcadFields[0]?.branch?.length < 1) {
          message.error('Branch,Grade, Section and Subject are a required field!');
          return;
        }
        if (validateMultipeAcadFields[0]?.grade?.length < 1) {
          message.error('Grade,Section and Subject are  a required field!');
          return;
        }
        if (validateMultipeAcadFields[0]?.section?.length < 1) {
          message.error('Section and Subject are  a required field!');
          return;
        }
        if (validateMultipeAcadFields[0]?.subjects?.length < 1) {
          message.error('Subject is a required field!');
          return;
        }
      }
    }
    setLoading(true);
    setSchoolFormValues(formValues);
    handleNext();
    setLoading(false);
  };
  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'qa' ||
    window.location.host.split('.')[0] === 'mcollege' ||
    window.location.host.split('.')[0] === 'aolschool' ||
    window.location.host.split('.')[0] === 'dps' ||
    window.location.host.split('.')[0] === 'localhost:3000'
      ? true
      : false;
  return (
    <React.Fragment>
      <div
        className='px-2'
        style={{
          height: '60vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          background: '#F8F8F8',
        }}
      >
        <Form ref={schoolForm} id='schoolForm' onFinish={handleSubmit} layout='vertical'>
          <Row className='py-2' gutter={24}>
            <Col md={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please select user level!',
                  },
                ]}
                name={'user_level'}
                label='User Level'
              >
                <Select
                  onChange={(e) => {
                    fetchDesignation({ user_level: e });
                    setUserLevel(e);
                    schoolForm.current.resetFields(['designation']);
                  }}
                  placeholder='User Level'
                  className='w-100'
                  showSearch
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {roleOption}
                </Select>
              </Form.Item>
            </Col>
            {userLevel !== 13 && (
              <Col md={8}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please select designation!',
                    },
                  ]}
                  name={'designation'}
                  label='Designation'
                >
                  <Select
                    showSearch
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    placeholder='Designation'
                    className='w-100'
                  >
                    {designationOption}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
          <Divider className='my-1' />
          <Row className='py-2 ' gutter={24}>
            <Col md={8}>
              <Form.Item name={'academic_year'} label='Academic Year'>
                <Input
                  disabled
                  // value={params?.id ? schoolFormValues?.academic_year:selectedYear?.session_year}
                  placeholder='Academic Year'
                  className='w-100'
                />
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
                  disabled={
                    editId &&
                    isOrchids &&
                    !(is_superuser || user_level === 1) &&
                    userLevel === 13
                  }
                  getPopupContainer={(trigger) => trigger.parentNode}
                  listHeight={150}
                  onChange={(e, obj) => {
                    if (e.includes('all')) {
                      let values = branches?.map((e) => e?.id);
                      schoolForm.current.setFieldsValue({
                        branch: values,
                      });
                      let branch_code = branches?.map((i) => i.branch_code);
                      fetchGrades(values, branch_code, editSessionYear);
                    } else {
                      let branch_code = obj?.map((i) => i.code);
                      fetchGrades(e, branch_code, editSessionYear);
                    }

                    schoolForm.current.resetFields(['grade', 'section', 'subjects']);
                    setGrades([]);
                    setSections([]);
                    setSubjects([]);
                  }}
                  showSearch
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
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
                  getPopupContainer={(trigger) => trigger.parentNode}
                  listHeight={150}
                  disabled={
                    editId &&
                    isOrchids &&
                    !(is_superuser || user_level === 1) &&
                    userLevel === 13
                  }
                  onChange={(e, value) => {
                    if (e.includes('all')) {
                      let values = grades?.map((e) => e?.grade_name);
                      schoolForm.current.setFieldsValue({
                        grade: values,
                      });
                      fetchSections(
                        grades?.map((e) => e?.id),
                        null,
                        null,
                        editSessionYear
                      );
                    } else {
                      fetchSections(
                        value?.map((e) => e.id),
                        null,
                        null,
                        editSessionYear
                      );
                    }
                    schoolForm.current.resetFields(['section', 'subjects']);

                    setSections([]);
                    setSubjects([]);
                  }}
                  showSearch
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
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
                  getPopupContainer={(trigger) => trigger.parentNode}
                  listHeight={150}
                  onChange={(e, value) => {
                    if (e.includes('all')) {
                      let values = sections?.map((e) => e?.section_name);
                      schoolForm.current.setFieldsValue({
                        section: values,
                      });
                      fetchSubjects(
                        sections?.map((e) => e?.id),
                        null,
                        null,
                        editSessionYear
                      );
                      setSectionMappingId(sections?.map((e) => e?.item_id));
                    } else {
                      setSectionMappingId(value?.map((e) => e?.mapping_id));
                      fetchSubjects(
                        value?.map((e) => e.id),
                        null,
                        null,
                        editSessionYear
                      );
                    }
                    schoolForm.current.resetFields(['subjects']);
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
                  maxLength={maxSubjectSelection ?? subjects?.length}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  listHeight={150}
                  onChange={(e, value) => {
                    if (e.includes('all')) {
                      let values = subjects
                        ?.map((e) => e?.item_id)
                        .filter((elem) => elem);
                      schoolForm.current.setFieldsValue({
                        subjects: values,
                      });
                      setSelectedSubjects(subjects?.map((e) => e?.id));
                      setSelectedSubjectsId(subjects?.map((e) => e?.value));
                    } else {
                      setSelectedSubjects(
                        value?.map((e) => e?.id).filter((elem) => elem)
                      );
                      setSelectedSubjectsId(
                        value?.map((e) => e?.value).filter((elem) => elem)
                      );
                    }
                  }}
                  showSearch
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
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
          </Row>
        </Form>
        {editId && (
          <>
            {multipleAcademicYear?.map((each) => (
              <AcademicYearList
                key={each?.id}
                currentObj={each}
                multipleAcademicYear={multipleAcademicYear}
                setMultipleAcademicYear={setMultipleAcademicYear}
                maxSubjectSelection={maxSubjectSelection}
                roleConfig={roleConfig}
                user_level={user_level}
                is_superuser={is_superuser}
                editId={editId}
                userLevel={userLevel}
                isOrchids={isOrchids}
              />
            ))}
            <div className='d-flex justify-content-end align-items-center my-4 '>
              <Button
                onClick={() => {
                  setMultipleAcademicYear([
                    ...multipleAcademicYear,
                    {
                      id: Math.random(),
                      academic_year: null,
                      branch: [],
                      grade: [],
                      section: [],
                      subjects: [],
                      subjectsId: [],
                      isEdit: false,
                    },
                  ]);
                }}
                className='ml-3 px-4'
                type='primary'
                icon={<PlusOutlined />}
              >
                Add
              </Button>
            </div>
          </>
        )}
      </div>
      <div className='d-flex justify-content-end align-items-center my-4'>
        <Button
          loading={loading}
          htmlType='submit'
          form='schoolForm'
          className='ml-3 px-4'
          type='primary'
        >
          Next
        </Button>
      </div>
    </React.Fragment>
  );
};

export default SchoolInformation;
