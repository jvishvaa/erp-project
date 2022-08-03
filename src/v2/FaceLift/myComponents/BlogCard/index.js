import React from 'react';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';

const BlogCard = (props) => {
  const { author, title, description, date } = props.data;
  return (
    <div className='col-md-12'>
      <div className='row my-2 th-bg-grey th-br-6 py-2 px-2'>
        <div className='col-2 th-fw-400 th-14 text-uppercase p-1'>
          <Avatar style={{ width: '33px', height: '33px' }}>H</Avatar>
        </div>
        <div className='col-10 px-0'>
          <div className='th-black-1 th-14 h-fw-400  text-capitalize '>{author}</div>
          <div className='d-flex justify-content-between'>
            <div classname='th-black-2 ' style={{ width: '80%', whiteSpace: 'nowrap' }}>
              <Box
                component='div'
                textOverflow='ellipsis'
                overflow='hidden'
                className='th-black-2'
              >
                {title && (
                  <span className='text-uppercase th-12 th-fw-400'>{title}:</span>
                )}
                {description}
              </Box>
            </div>
            <div className='text-right th-12 th-fw-400 th-grey-1'>02m ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
