import React, { useState } from 'react';
import { Radio, Breadcrumb } from 'antd';
import DailyDiary from '../DailyDiary';
import GeneralDiary from '../GeneralDiary';
import Layout from 'containers/Layout';
import '../index.css';
import { useHistory } from 'react-router-dom';

const CreateDiary = () => {
  const [diaryType, setDiaryType] = useState(2);
  const history = useHistory();
  const handleDiaryType = () => {
    if (diaryType == 1) {
      setDiaryType(2);
    } else {
      setDiaryType(1);
    }
  };
  return (
    <>
      <Layout>
        <div className='row th-bg-white'>
          <div className='col-md-12 px-4'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey'
                onClick={() => {
                  history.push('/diary/teacher');
                }}
              >
                Diary
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1'>Create Diary</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='row py-2 pl-4'>
            <div
              className='th-bg-blue-3 px-2 py-1 th-br-4 th-diary-radio'
              style={{ border: '1px solid #d9d9d9' }}
            >
              <Radio.Group onChange={handleDiaryType} value={diaryType}>
                <Radio value={2}>Dialy Diary</Radio>
                <Radio value={1}>General Diary</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className='row'>{diaryType == 2 ? <DailyDiary /> : <GeneralDiary />}</div>
        </div>
      </Layout>
    </>
  );
};

export default CreateDiary;
