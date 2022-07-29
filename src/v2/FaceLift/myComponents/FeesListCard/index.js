import React from 'react';

const FeesListCard = (props) => {
  const { duration, amount } = props.data;
  return (
    <div className='col-md-12'>
      <div
        className='d-flex justify-content-between mt-2 p-2 '
        style={{ background: '#F8F8F8', borderRadius: 6 }}
      >
        <div className='th-black-2'>{duration}</div>
        <div className='th-black-1'>₹ {amount}</div>
      </div>
    </div>
  );
};

export default FeesListCard;
