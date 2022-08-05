import React, { useState } from 'react';
import { Modal, Tabs, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import '../index.css';
import MemberListModal from './MemberListModal';

const { TabPane } = Tabs;

const MembersModal = (props) => {
  const [showMemberListModal, setShowmemberListModal] = useState(false);
  const handleMemberListModalClose = () => {
    setShowmemberListModal(false);
  };
  const onChange = (key) => {
    setShowTab(key);
  };

  const [showTab, setShowTab] = useState(1);
  const data = [
    { section: 'Grade 3A', selected: 25, total: 50 },
    { section: 'Grade 3B', selected: 0, total: 50 },
    { section: 'Grade 4A', selected: 0, total: 50 },
    { section: 'Grade 4B', selected: 10, total: 50 },
    { section: 'Grade 4C', selected: 0, total: 50 },
  ];
  return (
    <>
      <Modal
        centered
        visible={props?.show}
        // visible={true}
        width={500}
        title={false}
        closable={false}
        className='th-bg-white'
        style={{ borderRadius: '10px 10px 0px 0px' }}
        onCancel={props?.handleClose}
        footer={[
          <span className='mr-2 th-14 th-black-2'>86 Members Selected</span>,
          <Button className='th-fw-500 th-br-4 th-bg-primary th-white th-14 px-4 py-1'>
            Publish
          </Button>,
        ]}
      >
        <div className='pb-3 th-modal-tabs'>
          <Tabs type='card' onChange={onChange}>
            <TabPane tab='STUDENTS' key='1'>
              <div className='row px-3 th-black-2 py-2'>
                {data?.map((item, i) => (
                  <div
                    className='row my-2 th-bg-grey py-2'
                    style={{ border: item?.selected > 0 ? '1px solid blue' : '' }}
                    onClick={() => setShowmemberListModal(true)}
                  >
                    <div
                      className={`col-10 th-14 ${item?.selected > 0 ? 'th-primary' : ''}`}
                    >
                      {item.section}{' '}
                      <span className='th-12'>
                        ({item.selected}/{item.total} Selected)
                      </span>
                    </div>
                    <div className='col-2 text-center'>
                      <RightOutlined className='th-black-1' />
                    </div>
                  </div>
                ))}
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
      <MemberListModal
        show={showMemberListModal}
        handleClose={handleMemberListModalClose}
      />
    </>
  );
};

export default MembersModal;
