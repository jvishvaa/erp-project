import React, { useState } from 'react';
import { Modal, Tabs, Button, Table, Avatar, Input, Select, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import demoPic from 'v2/Assets/images/student_pic.png';

import '../index.css';
const { Option } = Select;
const { TabPane } = Tabs;
const MemberListModal = (props) => {
  const onChange = (key) => {
    setShowTab(key);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  const [showTab, setShowTab] = useState(1);
  const data = [
    { name: 'Student 1', roll: 1, selected: true },
    { name: 'Student 2', roll: 2, selected: false },
    { name: 'Student 3', roll: 1, selected: true },
    { name: 'Student 2', roll: 2, selected: false },
    { name: 'Student 4', roll: 1, selected: true },
    { name: 'Student 2', roll: 2, selected: false },
    { name: 'Student 5', roll: 1, selected: true },
    { name: 'Student 2', roll: 2, selected: false },
    { name: 'Student 1', roll: 1, selected: true },
    { name: 'Student 7', roll: 2, selected: false },
    { name: 'Student 1', roll: 1, selected: true },
    { name: 'Student 2', roll: 2, selected: false },
    { name: 'Student 1', roll: 1, selected: true },
  ];
  const columns = [
    {
      title: <span className='th-bg-white'>Select All</span>,
      render: (text, row) => (
        <div className='d-flex align-items-center pl-sm-0 pl-4'>
          <Avatar size={40} src={demoPic} />
          <div className='d-flex flex-column px-2 '>
            <span className='th-black-1 th-fw-400'>{row.name}</span>
            <span className='th-grey th-14 th-fw-400'>Roll No. {row.roll}</span>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <Modal
        centered
        visible={props?.show}
        closable={false}
        title={false}
        width={500}
        style={{ borderRadius: '10px 10px 0px 0px' }}
        className='th-bg-white mr-3'
        onCancel={props?.handleClose}
        footer={[
          <span className='mr-2 th-14 th-black-2'>86 Members Selected</span>,
          <Button className='th-fw-500 th-br-4 th-bg-primary th-white th-14 px-4 py-1'>
            Save
          </Button>,
        ]}
      >
        <div className='th-modal-tabs '>
          <Tabs type='card' onChange={onChange}>
            <TabPane tab='STUDENTS' key='1'>
              <div className='row px-3 th-black-2'>
                <div className='row align-items-center'>
                  <div className='col-7'>
                    <Input
                      className='th-br-4 th-16 th-br-10'
                      placeholder='Seach a Student'
                      suffix={<SearchOutlined />}
                    />
                  </div>
                  <div className='col-5'>
                    <Select
                      className='th-black-2 th-bg-grey th-br-2 w-100'
                      bordered={false}
                      defaultValue={'1'}
                    >
                      <Option value='1'>Grade 3A</Option>
                      <Option value='2'>Grade 3B</Option>
                      <Option value='2'>Grade 4A</Option>
                    </Select>
                  </div>
                </div>
                <div className='row mt-2 py-2'>
                  <div className='col-12'>
                    {' '}
                    <Checkbox>Select All</Checkbox>
                  </div>
                  <div className='px-2'>
                    <Table
                      rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                      }}
                      columns={columns}
                      dataSource={data}
                      showHeader={false}
                      pagination={false}
                      scroll={{
                        y: 350,
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab='TEACHERS' key='2'>
              school_sub_domain_name
            </TabPane>
            <TabPane tab='ADMINS' key='3'>
              vff
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default MemberListModal;
