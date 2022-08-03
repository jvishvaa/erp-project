import React from 'react';
import ShortcutCard from 'v2/FaceLift/myComponents/ShortcutCard';

const Shortcut = () => {
  const shortcutsData = [
    {
      title: 'Academic Report',
      url: '/academic-report',
    },
    {
      title: 'ClassWorks',
      url: '/erp-online-class-teacher-view',
    },
    {
      title: 'Homeworks',
      url: '/homework/teacher',
    },
    {
      title: 'Assessment Report',
      url: '/assessment-reports',
    },
  ];

  return (
    <div
      className='th-bg-white th-br-5 py-3 px-2 shadow-sm mt-3'
      style={{ minHeight: 240 }}
    >
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
