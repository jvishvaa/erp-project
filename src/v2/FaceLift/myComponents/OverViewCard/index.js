import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 4,
  },
  colorPrimary: {
    backgroundColor: '#D9D9D9',
  },
  bar: {
    borderRadius: 4,
    backgroundColor: '#1b4ccb',
  },
}))(LinearProgress);

const OverviewCard = (props) => {
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  const history = useHistory();
  const { title, value, icon } = props.data;
  const { selectedBranchList } = props;

  const selectedBranchs = selectedBranchList?.map((item) => item?.selectedBranch);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const percentage = value ? (value < 0 ? 0 : Math.round(value)) : 0;
  const Redirections = (type) => {
    switch (type) {
      case 'Curriculum Completion':
        return handleCurriculumCompletion(true);
      case 'Academic Report':
        return handleTestScore();
      case 'Attendance Report':
        return handleCurriculumCompletion(false);
    }
  };

  const handleCurriculumCompletion = (iscurriculam) => {
    history.push({
      pathname: `/curriculum-completion-branchWise`,
      state: {
        branchData: selectedBranchList.length > 0 ? selectedBranchs : [selectedBranch],
        module_id: moduleId,
        iscurriculam: iscurriculam,
      },
    });
  };
  const handleTestScore = () => {
    history.push({
      pathname: `/academic-report`,
    });
  };

  return (
    <div className='col-md-4 th-custom-col-padding'>
      <div
        className='th-bg-grey th-br-6 px-2 py-3 th-pointer'
        style={{ minHeight: '150px' }}
        onClick={() => Redirections(title)}
      >
        <div className=''>
          <img src={icon} />
        </div>
        <div className='my-2 th-fw-500 th-14 th-black-1 pr-4'>{title}</div>
        {title === 'Attendance Report' && (
          <>
            {' '}
            <div className='th-20 th-fw-600 pb-2'>
              <span>{percentage}%</span>
            </div>
            <div>
              <BorderLinearProgress variant='determinate' value={percentage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
