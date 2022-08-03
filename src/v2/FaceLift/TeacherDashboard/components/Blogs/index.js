import BlogCard from 'v2/FaceLift/myComponents/BlogCard';
import React from 'react';
const blogData = [
  {
    author: 'Sarthak Jain',
    description: 'There will be a holiday tomorrow due to Republic Day celebrations.',
    date: '2022/05/30 10:04:03',
    title: 'Seasons in color',
  },
  {
    author: 'Rohan Bharati',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
    title: 'Seasons in color',
  },
  {
    author: 'Ravi Ranjan',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
    title: 'Seasons in color',
  },
  {
    author: 'Rohan Bharati',
    description: 'There will be a holiday tomorrow due to Independence Day celebrations.',
    date: '2022/05/29 16:01:03',
    title: 'Seasons in color',
  },
];

const Blogs = () => {
  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm mt-3'>
      <div className='row justify-content-between '>
        <div className='col-6 th-16 my-2 th-fw-500 th-black-1'>Blogs</div>
      </div>
      <div classNmae='px-2' style={{ overflowY: 'auto', height: 265 }}>
        {blogData?.map((item) => (
          <BlogCard data={item} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
