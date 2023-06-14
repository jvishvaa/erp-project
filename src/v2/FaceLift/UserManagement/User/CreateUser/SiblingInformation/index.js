import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, InputNumber, Radio, Row } from 'antd';
import React, { useState } from 'react';

const SiblingInformation = ({
  siblings,
  setSiblings,
  handleBack,
  handleSubmit,
  loading,
  editId,
}) => {
  const handleChange = (e, id, field) => {
    let temp = siblings;
    for (let i = 0; i < siblings?.length; i++) {
      if (id === temp[i].id) {
        console.log(e);
        if (field) {
          temp[i] = { ...temp[i], [field]: e };
        } else temp[i] = { ...temp[i], [e.target.name]: e.target.value };
      }
    }
    setSiblings([...temp]);
  };
  return (
    <React.Fragment>
      <div
        className='px-2'
        style={{
          height: '70vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          background: '#F8F8F8',
        }}
      >
        {siblings?.map((each, i) => (
          <div key={each?.id}>
            <div className='mb-4'>Sibling {i + 1}</div>
            <Form layout='vertical'>
              <Row gutter={24}>
                <Col md={7}>
                  <Form.Item label='Name'>
                    <Input
                      onChange={(e) => {
                        handleChange(e, each?.id);
                      }}
                      name='name'
                      value={each?.name}
                      className='w-100'
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='Gender'>
                    <Radio.Group
                      onChange={(e) => {
                        handleChange(e, each?.id);
                      }}
                      name='gender'
                      value={Number(each?.gender)}
                    >
                      <Radio value={1}>Male</Radio>
                      <Radio value={2}>Female</Radio>
                      <Radio value={3}>Others</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='Age'>
                    <InputNumber
                      onChange={(e) => {
                        handleChange(e, each?.id, 'age');
                      }}
                      name={'age'}
                      value={each?.age}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  {siblings.length > 1 && (
                    <Form.Item label=' '>
                      <MinusCircleOutlined
                        onClick={() => {
                          setSiblings(siblings?.filter((e) => e?.id !== each?.id));
                        }}
                        role='button'
                        className='th-18'
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row gutter={24} className='py-2'>
                <Col md={7}>
                  <Form.Item label='Grade'>
                    <Input
                      onChange={(e) => {
                        handleChange(e, each?.id);
                      }}
                      name='grade_name'
                      value={each?.grade_name}
                      className='w-100'
                    />
                  </Form.Item>
                </Col>
                <Col md={7}>
                  <Form.Item label='School Name'>
                    <Input
                      onChange={(e) => {
                        handleChange(e, each?.id);
                      }}
                      name='school_name'
                      value={each?.school_name}
                      className='w-100'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider />
          </div>
        ))}
        <div className='d-flex justify-content-end align-items-center my-4'>
          <Button
            onClick={() => {
              setSiblings([
                ...siblings,
                {
                  id: Math.random(),
                  name: '',
                  gender: '',
                  age: 0,
                  grade_name: '',
                  school_name: '',
                },
              ]);
            }}
            className='ml-3 px-4'
            type='primary'
            icon={<PlusOutlined />}
          >
            Add another sibling
          </Button>
        </div>
      </div>
      <div
        // style={{ position: 'sticky', bottom: '59px' }}
        className='d-flex justify-content-end align-items-center my-4'
      >
        <Button
          onClick={handleBack}
          className='ml-3 px-4'
          // type='primary'
        >
          Back
        </Button>
        <Button
          loading={loading}
          onClick={handleSubmit}
          className='ml-3 px-4'
          type='primary'
        >
          {editId ? 'Update' : 'Submit'}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default SiblingInformation;
