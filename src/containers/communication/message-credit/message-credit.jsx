/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './message-credit.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// eslint-disable-next-line no-unused-vars
const MessageCredit = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [smsCreditId, setSmsCreditId] = useState();
  const [branchList, setBranchList] = useState([]);
  const [testData, setTestData] = useState([]);
  const handleSubmit = async (index) => {
    const addSmsCreditUrl = `${endpoints.communication.editGroup}${smsCreditId}/sms-credits/`;
    try {
      const request = {
        sms_credit_amount: testData[index].AmountAdded,
      };
      const response = await axiosInstance.put(addSmsCreditUrl, request, {
        headers: {
          // 'application/json' is the modern content-type for JSON, but some
          // older servers may use 'text/json'.
          // See: http://bit.ly/text-json
          'content-type': 'application/json',
        },
      });
      if (response.data.status_code === 200) {
        setAlert('success', 'Successfully Added Credit');
        const tempData = testData.slice();
        tempData[index].AvailableSMS += tempData[index].AmountAdded;
        tempData[index].AmountAdded = 0;
        tempData[index].Adding = false;
        setTestData(tempData);
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const handleAddingSms = (e, index) => {
    const tempData = testData.slice();
    tempData[index].AmountAdded = Number(e.target.value);
    setTestData(tempData);
  };
  const handleStatusChange = (index) => {
    const tempData = testData.slice();
    setSmsCreditId(tempData[index].id);
    tempData[index].Adding = true;
    setTestData(tempData);
  };
  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.branches);
      if (result.status === 200) {
        setBranchList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const getSmsCreditApi = async () => {
    try {
      let smsCreditUrl = endpoints.communication.getSmsCredit;
      if (selectedBranch && selectedBranch !== 0) {
        smsCreditUrl += `?branch=${selectedBranch}`;
      }
      const result = await axiosInstance.get(smsCreditUrl);
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) =>
          resultOptions.push({
            id: items.id,
            BranchName: items.branch_fk.branch_name,
            AvailableSMS: Number(items.available_sms),
            useSMS: Number(items.used_sms),
            AmountAdded: 0,
            Adding: false,
          })
        );
        setTestData(resultOptions);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  useEffect(() => {
    getSmsCreditApi();
  }, [selectedBranch]);
  useEffect(() => {
    if (!branchList.length) {
      getBranchApi();
    }
  }, []);
  return (
    <div className='message_credit__page'>
      <div className='add_credit_message_title'>Communication &gt; Add SMS credit</div>
      <div className='sms_credit_branch'>
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel id='demo-simple-select-outlined-label'>Branch</InputLabel>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            label='Branch'
          >
            <MenuItem value={0}>
              <em>All</em>
            </MenuItem>
            {branchList.map((items, index) => (
              <MenuItem key={`sms_type_${index}`} value={items.id}>
                {items.branch_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
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
                  <input
                    type='submit'
                    className='add_credit_save_button'
                    onClick={() => handleSubmit(index)}
                    value='Save'
                  />
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
