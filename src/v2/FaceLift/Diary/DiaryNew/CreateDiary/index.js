import React, { useState } from 'react';
import { Radio, Breadcrumb, Checkbox } from 'antd';
import DailyDiary from '../DailyDiary';
import GeneralDiary from '../GeneralDiary';
import Layout from 'containers/Layout';
import '../index.css';
import { useHistory } from 'react-router-dom';

const CreateDiary = () => {
  const [diaryType, setDiaryType] = useState(2);
  const [isSubstituteClass, setIsSubstituteClass] = useState(false);
  const history = useHistory();
  const handleDiaryType = () => {
    if (diaryType == 1) {
      setDiaryType(2);
    } else {
      setDiaryType(1);
    }
  };
  const handleSubstituteCheck = (e) => {
    setIsSubstituteClass(e.target.checked);
  };
  return (
    <>
      <Layout>
        <div className='row pt-2'>
          <div className='col-md-12 px-4'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-pointer th-16'
                onClick={() => {
                  history.push('/diary/teacher');
                }}
              >
                Diary
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Create Diary</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='col-12 py-2'>
            <div className='row th-bg-white py-2'>
              <div className='row py-2 pl-4'>
                <div
                  className='th-bg-blue-3 px-2 py-1 th-br-4 th-diary-radio'
                  style={{ border: '1px solid #d9d9d9' }}
                >
                  <Radio.Group onChange={handleDiaryType} value={diaryType}>
                    <Radio value={2}>Daily Diary</Radio>
                    <Radio value={1}>General Diary</Radio>
                  </Radio.Group>
                </div>
                {diaryType == 2 && (
                  <div
                    className='px-2 py-2 ml-2 th-br-4'
                    style={{ border: '1px solid #d9d9d9' }}
                  >
                    <Checkbox
                      onChange={handleSubstituteCheck}
                      checked={isSubstituteClass}
                    >
                      Substitute Class
                    </Checkbox>
                  </div>
                )}
              </div>

              <div className='row'>
                {diaryType == 2 ? (
                  <DailyDiary isSubstituteClass={isSubstituteClass} />
                ) : (
                  <GeneralDiary />
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateDiary;
