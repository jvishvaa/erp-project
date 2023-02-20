import React from 'react';
import DiaryReport from '../TeacherDiaryReport';
import CurriculumCompletion from '../CurriculumCompletion';
const CurriculumTracker = (props) => {
  return (
    <div className={`th-bg-white th-br-5 py-3 px-2 shadow-sm`}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>Curriculum Tracker</div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <DiaryReport />
        </div>
        <div className='col-12'>
          <CurriculumCompletion />
        </div>
      </div>
    </div>
  );
};

export default CurriculumTracker;
