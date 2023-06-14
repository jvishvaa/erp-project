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
  Radio,
  Row,
  Select,
} from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import AcademicYearList from '../AcademicYearList';
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
  editId,
  multipleAcademicYear,
  setMultipleAcademicYear,
  sectionMappingId,
  setSectionMappingId,
}) => {
  const schoolForm = useRef();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(schoolFormValues, 'schoolFormValues');
    if (schoolFormValues && Object.keys(schoolFormValues).length > 0) {
      schoolForm.current.setFieldsValue(schoolFormValues);
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
    <Select.Option key={each?.item_id} value={each?.subject_name} id={each?.id}>
      {each?.subject_name}
    </Select.Option>
  ));
  const handleSubmit = (formValues) => {
    setLoading(true);
    setSchoolFormValues(formValues);
    handleNext();
    setLoading(false);
  };
  return (
    <React.Fragment>
      <div
        className=''
        style={{
          height: '70vh',
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
                    fetchDesignation(e);
                    schoolForm.current.resetFields(['designation']);
                  }}
                  placeholder='User Level'
                  className='w-100'
                >
                  {roleOption}
                </Select>
              </Form.Item>
            </Col>
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
                <Select placeholder='Designation' className='w-100'>
                  {designationOption}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider className='my-1' />
          <Row className='py-2' gutter={24}>
            <Col md={8}>
              <Form.Item name={'academic_year'} label='Academic Year'>
                <Input
                  disabled
                  value={selectedYear?.session_year}
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
                  onChange={(e, obj) => {
                    let branch_code = obj?.map((i) => i.code);
                    fetchGrades(e, branch_code);
                    schoolForm.current.resetFields(['grade']);
                  }}
                  mode='multiple'
                  placeholder='Branch'
                  className='w-100'
                >
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
                  onChange={(e, value) => {
                    fetchSections(value?.map((e) => e.id));
                    schoolForm.current.resetFields(['section']);
                  }}
                  mode='multiple'
                  placeholder='Grade'
                  className='w-100'
                >
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
                  onChange={(e, value) => {
                    setSectionMappingId(value?.map((e) => e.mapping_id));
                    fetchSubjects(value?.map((e) => e.id));
                    schoolForm.current.resetFields(['subject']);
                  }}
                  mode='multiple'
                  placeholder='Section'
                  className='w-100'
                >
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
                ]}
                name={'subjects'}
                label='Subject'
              >
                <Select
                  onChange={(e, value) => {
                    setSelectedSubjects(value?.map((e) => e.id));
                  }}
                  mode='multiple'
                  placeholder='Subject'
                  className='w-100'
                >
                  {subjectOption}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {editId &&
          multipleAcademicYear?.map((each) => (
            <AcademicYearList
              key={each?.id}
              currentObj={each}
              multipleAcademicYear={multipleAcademicYear}
              setMultipleAcademicYear={setMultipleAcademicYear}
            />
          ))}
        <div className='d-flex justify-content-end align-items-center my-4'>
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
      </div>
      <div
        // style={{ position: 'sticky', bottom: '59px' }}
        className='d-flex justify-content-end align-items-center my-4'
      >
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
