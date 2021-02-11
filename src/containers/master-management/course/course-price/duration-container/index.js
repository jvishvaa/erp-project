import React, { useState, useEffect, useContext } from 'react';
import { TextField, Switch, FormControlLabel, Button, SvgIcon } from '@material-ui/core';
import './duration.css';
import { Add, Remove } from '@material-ui/icons';
import RupeeIcon from '../../../../../assets/images/rupee-indian.svg';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';

const DurationContainer = (props) => {
  const {
    isEdit,
    timeSlot,
    timeSlotDisplay,
    courseId,
    selectedLimit,
    collectData,
    setCollectData,
    funBatchSize,
    firstHit,
    resetContent,
    clearFlag,
  } = props;

  const { setAlert } = useContext(AlertNotificationContext);
  const [noOfWeeks, setNoOfWeeks] = useState(
    '' || [...collectData][funBatchSize(Number(selectedLimit.substring(2)))]['weeks']
  );
  const [toggle, setToggle] = useState(false);
  const [recursiveContent, setRecursiveContent] = useState([{ weeks: '', price: '', id: '' }]);

  useEffect(() => {
    if (clearFlag) {
      setNoOfWeeks('');
      setToggle(false);
      setRecursiveContent([{ weeks: '', price: '', id: '' }]);
    }
  }, [clearFlag]);

  useEffect(() => {
    if (selectedLimit) {
      const index = collectData.findIndex(
        (datarow) => datarow['limit'] === selectedLimit
      );
      setNoOfWeeks(collectData[index]['weeks']);
      setToggle(collectData[index]['toggle']);
      setRecursiveContent(collectData[index]['data']);
    }
  }, [selectedLimit, firstHit]);

  const handleChange = (e, index) => {
    const list = [...recursiveContent];
    let name = e.target.name;
    let value = e.target.value;

    if (name === 'price') {
      if (value.match(/^[0-9]*\.?([0-9]+)?$/)) list[index][name] = value;
      else setAlert('warning', 'Price can contain only numbers!');
    } else {
      list[index][name] = value;
    }
    setRecursiveContent(list);
  };

  const handleAdd = () => {
    const list = [...recursiveContent];
    list.push({ weeks: '', price: '', id: '' });
    setRecursiveContent(list);
  };

  const handleRemove = (index) => {
    const list = [...recursiveContent];
    list.splice(index, 1);
    setRecursiveContent(list);
  };

  const handleToggle = () => {
    const list = [...collectData];
    const index = collectData.findIndex((datarow) => datarow['limit'] === selectedLimit);
    if (isEdit && list[index]['toggle']) {
        setAlert('warning', "Can't be changed to Non-Recurring!");
    } else {
      setRecursiveContent([{ weeks: '', price: '', id: '' }]);
      setToggle(!toggle);
    }
  };

  const handleNumberOfWeeks = (value) => {
    setNoOfWeeks(value);
    if (!toggle) {
      const list = [...recursiveContent];
      list[0]['weeks'] = value;
      setRecursiveContent(list);
    }
  };

  useEffect(() => {
    const list = [...collectData];
    for (let i = 0; i < list.length; i++) {
      if (list[i]['limit'] === selectedLimit) {
        list[i]['weeks'] = noOfWeeks;
        list[i]['toggle'] = toggle;
        list[i]['data'] = recursiveContent;
        break;
      }
    }
    setCollectData(list);
  }, [noOfWeeks, recursiveContent.length]);

  const handleSubmit = () => {
    const list = [...collectData];
    const batchData = [];
    for (let i = 0; i < list.length; i++) {
      const coursePriceArray = [];
      if (isEdit) {
        for (let k = 0; k < list[i]['data'].length; k++) {
          coursePriceArray.push({
            no_of_week: Number(list[i]['data'][k]['weeks']),
            price: parseFloat(list[i]['data'][k]['price']),
            id: Number(list[i]['data'][k]['id']),
          });
        }
      } else {
        for (let k = 0; k < list[i]['data'].length; k++) {
          coursePriceArray.push({
            no_of_week: Number(list[i]['data'][k]['weeks']),
            price: parseFloat(list[i]['data'][k]['price']),
          });
        }
      }

      const daysArray = [
        ...list[i]['comboDays']
          .map((value) => (value.combo !== 'Others' ? value.send : null))
          .filter((value) => value !== null),
        ...list[i]['otherDays'].map((value) => value.send),
      ];

      batchData.push({
        days: list[i]['days'].length > 0 ? list[i]['days'] : daysArray,
        batch_size: list[i]['limit'].substring(2),
        is_recurring: list[i]['toggle'] ? 'True' : 'False',
        course_price: coursePriceArray,
        id: list[i]['id'],
      });
    }
    let request = {};
    if (isEdit) {
      request = {
        course: courseId,
        batch: batchData,
        time_slot: timeSlotDisplay,
      };
    } else {
      request = {
        course: courseId,
        batch: batchData,
        time_slot: timeSlot.map((value) => value.slot),
      };
    }

    if (courseId) {
      if (isEdit) {
        axiosInstance
          .put(`${endpoints.aol.updateCoursePrice}`, request)
          .then((result) => {
            if (result.data.status_code === 200) {
              setAlert('success', result.data.message);
              resetContent();
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        axiosInstance
          .post(`${endpoints.aol.createCoursePrice}`, request)
          .then((result) => {
            if (result.data.status_code === 200) {
              setAlert('success', result.data.message);
              resetContent();
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      }
    } else {
      setAlert('warning', 'Please select course!');
    }
  };

  return (
    <div className='durationWrapper'>
      <div className='durationTag'>Duration</div>
      <div className='durationContainer'>
        <div className='weeksContainer'>
          <TextField
            size='small'
            id='weeks'
            label='No. of weeks'
            variant='outlined'
            className='dropdownIcon'
            type='number'
            name='weeks'
            value={noOfWeeks}
            onChange={(e) => handleNumberOfWeeks(e.target.value)}
            InputProps={{ inputProps: { min: 0, autoComplete: 'off' } }}
          />
        </div>
        <div className='isRecursiveSwitch'>
          <FormControlLabel
            className='switchLabel'
            control={
              <Switch
                checked={toggle}
                onChange={handleToggle}
                name='optional'
                color='primary'
              />
            }
            label={toggle ? 'Recurring' : 'Non-Recurring'}
          />
        </div>
        <div className='recursiveContainer'>
          {recursiveContent.map((row, index) => (
            <div className='recursiveRow'>
              <div className='addRemoveIconContainer'>
                {index === recursiveContent.length - 1 && toggle && (
                  <Add className='addRecIcon' onClick={handleAdd} />
                )}
                {index !== recursiveContent.length - 1 && toggle && (
                  <Remove className='removeRecIcon' onClick={() => handleRemove(index)} />
                )}
              </div>
              <div className='weekContainer'>
                <div className='recursiveWeekContainer'>
                  <TextField
                    size='small'
                    id={`weeks${index}`}
                    variant='outlined'
                    type='number'
                    name='weeks'
                    placeholder='Weeks'
                    value={!toggle ? noOfWeeks : row.weeks}
                    onChange={(e) => handleChange(e, index)}
                    InputProps={{
                      inputProps: { min: 0, autoComplete: 'off', readOnly: !toggle },
                    }}
                  />
                </div>
              </div>
              <div className='recursivePriceContainer'>
                <TextField
                  size='small'
                  id={`price${index}`}
                  variant='outlined'
                  name='price'
                  placeholder='Price'
                  value={row.price}
                  onChange={(e) => handleChange(e, index)}
                  InputProps={{
                    inputProps: { autoComplete: 'off' },
                    startAdornment: (
                      <div>
                        <SvgIcon
                          component={() => (
                            <img
                              style={{
                                height: '20px',
                                width: '20px',
                                marginTop: '5px',
                                marginRight: '5px',
                              }}
                              src={RupeeIcon}
                            />
                          )}
                        />
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='buttonContainer'>
        <Button onClick={handleSubmit} className='submitCoursePriceButton'>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default DurationContainer;
