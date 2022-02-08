import React, { useState } from 'react';
import { createPlugin } from '@fullcalendar/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Cards from './cards';

let div = document.createElement('div');

const getDate = (dateInfo) => {
  console.log(dateInfo);
};

const CustomViewConfig = {
  classNames: ['custom-view'],
  text: 'day',
  datesSet: function (dateInfo) {
  },
  content: function (props) {
    return (
      <>
      <div style={{display: 'flex' , justifyContent: 'center' , margin: '20px 0'}} >
        <div style={{ fontSize: '20px', fontWeight: '600' , width: '75%' }}>Period List</div>
      </div>
        <div>
          <Cards props={props} />
        </div>
      </>
    );
  },
};

export default createPlugin({
  views: {
    day: CustomViewConfig,
  },
});
