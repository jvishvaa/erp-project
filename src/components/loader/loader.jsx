import React from 'react';
import './loader.css';

const Loader = (props) => {
  const { message = 'loading' } = props;
  return (
    <div className='erp_loader_wrapper'>
      <div className='erp_loader-container'>
        <div>
          <div className='erp_loader'>
            <div className='erp_loader-dot' />
            <div className='erp_loader-dot' />
            <div className='erp_loader-dot' />
            <div className='erp_loader-dot' />
            <div className='erp_loader-dot' />
            <div className='erp_loader-dot' />
          </div>
          <p className='erp_loader--title'>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
