import React from 'react';
import Box from '@material-ui/core/Box';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { getCategoryColor } from 'v2/generalAnnouncementFunctions';

const AnnouncementCard = (props) => {
  const {
    category__category_name: category,
    content: details,
    created_time: date,
  } = props.data;

  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  return (
    <div className=''>
      <div
        className='col-md-12 my-2 th-bg-grey th-br-2 p-2'
        style={{ borderLeft: `3px ${getCategoryColor(category)} solid` }}
      >
        <div
          className='th-fw-400 th-14 text-uppercase'
          style={{ color: `${getCategoryColor(category)}` }}
        >
          {category}
        </div>

        <div className='d-flex align-items-center justify-content-between '>
          <div style={{ width: '75%', whiteSpace: 'nowrap' }}>
            <Box
              component='div'
              textOverflow='ellipsis'
              overflow='hidden'
              className='th-12 th-fw-400 th-black-2'
            >
              {extractContent(details)}
            </Box>
          </div>
          <div className='th-12 th-fw-400 th-grey'>{getTimeInterval(date)}</div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
