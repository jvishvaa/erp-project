/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import './message-credit.css';

// eslint-disable-next-line no-unused-vars
const MessageCredit = withRouter(({ history, ...props }) => {
  const [testData, setTestData] = useState([
    { BranchName: 'Gondor', AvailableSMS: 125, useSMS: 5, AmountAdded: 0, Adding: false },
    { BranchName: 'das', AvailableSMS: 515, useSMS: 10, AmountAdded: 0, Adding: false },
    { BranchName: 'Handi', AvailableSMS: 250, useSMS: 50, AmountAdded: 0, Adding: false },
    { BranchName: 'Atros', AvailableSMS: 180, useSMS: 58, AmountAdded: 0, Adding: false },
    { BranchName: 'Alur', AvailableSMS: 415, useSMS: 85, AmountAdded: 0, Adding: false },
  ]);
  const handleSubmit = (index) => {
    const tempData = testData.slice();
    tempData[index].AvailableSMS += tempData[index].AmountAdded;
    tempData[index].AmountAdded = 0;
    tempData[index].Adding = false;
    setTestData(tempData);
  };
  const handleAddingSms = (e, index) => {
    const tempData = testData.slice();
    tempData[index].AmountAdded = Number(e.target.value);
    setTestData(tempData);
  };
  const handleStatusChange = (index) => {
    const tempData = testData.slice();
    tempData[index].Adding = true;
    setTestData(tempData);
  };
  return (
    <div className='message_credit__page'>
      <table className='sms_credit_table'>
        <thead>
          <tr>
            <th className='sms_credit_table_header'>Branch</th>
            <th className='sms_credit_table_header'>Available SMS Credit</th>
            <th className='sms_credit_table_header'>Used SMS Credit</th>
            <th className='sms_credit_table_header'>Amount to be Added</th>
            <th className='sms_credit_table_header'>Add SMS Credit</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((items, index) => (
            <tr key={`message_credit_table_${index}`}>
              <td className='sms_credit_table_cells'>{items.BranchName}</td>
              <td className='sms_credit_table_cells'>{items.AvailableSMS}</td>
              <td className='sms_credit_table_cells'>{items.useSMS}</td>
              <td className='sms_credit_table_cells'>
                {items.Adding ? (
                  <input
                    type='number'
                    className='add_sms_credit_box'
                    value={Number(items.AmountAdded).toString()}
                    onChange={(e) => handleAddingSms(e, index)}
                  />
                ) : (
                  <input
                    type='number'
                    className='add_sms_credit_box'
                    value={items.AmountAdded}
                    readOnly
                  />
                )}
              </td>
              <td className='sms_credit_table_cells'>
                {items.Adding ? (
                  <input type='submit' onClick={() => handleSubmit(index)} value='Save' />
                ) : (
                  <AddCircleIcon
                    style={{ color: '#005c99' }}
                    variant='contained'
                    onClick={() => handleStatusChange(index)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default MessageCredit;
