import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import QuestionCard from './questionCard';

const SectionCard = () => {

    const [drawerOpen , setDrawerOpen] = useState(false)
    
    const handleAddQuestion = () => {
        setDrawerOpen(true)
    }

    const onClose = () => {
        setDrawerOpen(false)
    }
 
  return (
    <>
      <div className='row col-md-12 mt-3'>
        <div className='th-fw-900 col-md-7'>Section A</div>
        <div className='d-flex align-items-center col-md-5'>
          <div className='d-flex col-md-7'>
            <div>Total Questions Added</div>
            <div className='col-md-4'>
              <Input style={{ width: '3rem', height: '1.5rem' }} />
            </div>
          </div>
          <div className='d-flex col-md-5'>
            Total Marks Added
            <div className='col-md-4'>
              <Input style={{ width: '3rem', height: '1.5rem' }} />
            </div>
          </div>
        </div>
      </div>
      <div className='row mx-5 my-4' style={{ border: '1px solid black' }}>
        <div className='row mx-4'>
          <span>Instruction</span>
          <TextArea rows={4} maxLength={6} />
        </div>
        <hr />
        <QuestionCard />
        <hr />
        <div className='row col-md-12 justify-content-end my-3'>
          <div className='col-md-3'>
            <Button className='w-100 th-button' onClick={handleAddQuestion}>Add Question from 'Question Bank'</Button>
          </div>
        </div>
      </div>
      <Drawer
          placement='right'
          onClose={onClose}
          closable={false}
          visible={drawerOpen}
          width={600}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                form='incomeForm'
                type='primary'
                htmlType='submit'
              >
                <PlusOutlined size='small' />
                Add to Section
              </Button>
            </div>
          }
        >

          <div className='row d-flex col-md-12'>
            <div className='col-md-8'>
            (Section A)
            </div>
             <div className='d-flex justify-content-end col-md-4'>
              <Checkbox>Set Marks</Checkbox>
              <Input style={{width:'50px',height:'24px'}} />
            </div>
          </div>
          <div className='mx-3'>

          </div>


        </Drawer>
    </>
  );
};

export default SectionCard;
