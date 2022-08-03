import BlogCard from '../../../myComponents/BlogCard';
import React from 'react';
const discussionData = [
  {
    author: 'Sarthak Jain',
    description: 'There will be a holiday tomorrow due to Republic Day celebrations.',
    date: '2022/05/30 10:04:03',
  },
  {
    author: 'Rohan Bharati1',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
  },
  {
    author: 'Ravi Ranjan',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
  },
  {
    author: 'Rohan Bharati2',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
  },
  {
    author: 'Ravi Ranjan',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
  },
  {
    author: 'Rohan Bharati',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
  },
];

const Discussions = () => {
  return (
    <div className='th-bg-white th-br-5 pt-3 pb-4 px-2 shadow-sm mt-4'>
      <div className='row justify-content-between mb-2'>
        <div className='col-6 th-16 my-2 th-fw-500 th-black-1'>Discussions</div>
      </div>
      <div classNmae='px-2' style={{ overflowY: 'auto', height: 260 }}>
        {discussionData?.map((item) => (
          <BlogCard data={item} />
        ))}
      </div>
    </div>
  );
};

export default Discussions;
