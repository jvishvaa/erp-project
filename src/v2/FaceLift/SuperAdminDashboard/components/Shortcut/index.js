import React, { useState, useEffect } from 'react';
import ShortcutCard from 'v2/FaceLift/myComponents/ShortcutCard';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Shortcut = (props) => {
  const { selectedBranchList } = props;
  const history = useHistory();
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
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const branchListAttendance = selectedBranchList;
  const acadIds = branchListAttendance?.map((o, i) => (o.id = o.acadId));
  const selectedBranchs = selectedBranchList?.map((item) => item?.selectedBranch);
  const feesBranch = [selectedBranch];

  const shortcutsData = [
    {
      title: 'View All Attendance',
      url: '/staff-attendance-report/branch-wise',
      state: {
        acadId: selectedBranchList?.length > 0 ? branchListAttendance : branchList,
      },
    },
    {
      title: 'Fees overview',
      url: '/fees-table-status',
      state: {
        branch: feesBranch,
        filter: true,
      },
    },
    {
      title: 'Curriculum Completion',
      url: '/curriculum-completion-branchWise',
      state: {
        branchData: selectedBranchList.length > 0 ? selectedBranchs : [selectedBranch],
        module_id: moduleId,
        iscurriculam: true,
      },
    },
    {
      title: 'Avg. Test Score',
      url: '/academic-report',
    },
    {
      title: 'Attendance Overview',
      url: '/curriculum-completion-branchWise',
      branchData: selectedBranchList.length > 0 ? selectedBranchs : [selectedBranch],
      module_id: moduleId,
      iscurriculam: false,
    },
  ];

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 240 }}>
      <div className='th-16 mt-2 th-fw-500 th-black-1 col-md-12 pb-2'>Shortcuts</div>
      <div
        className='row justify-content-between '
        style={{ overflowY: 'auto', overflowX: 'hidden', height: 170 }}
      >
        {shortcutsData?.map((item) => (
          <ShortcutCard data={item} />
        ))}
      </div>
    </div>
  );
};

export default Shortcut;
