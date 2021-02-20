import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
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
    courseKey,
    gradeKey,
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
    setCourseId,
    setSelectedCourse,
  } = props;

  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [noOfWeeks, setNoOfWeeks] = useState(
    '' || [...collectData][funBatchSize(Number(selectedLimit.substring(2)))]['weeks']
  );
  const [toggle, setToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [recursiveContent, setRecursiveContent] = useState([
    { weeks: '', price: '', id: '' },
  ]);
  const [nonRecursiveContent, setNonRecursiveContent] = useState([
    { weeks: '', price: '', id: '' },
  ]);

  useEffect(() => {
    if (clearFlag) {
      setNoOfWeeks('');
      setToggle(false);
      setEditToggle(false);
      setRecursiveContent([{ weeks: '', price: '', id: '' }]);
      setNonRecursiveContent([{ weeks: '', price: '', id: '' }]);
    }
  }, [clearFlag]);

  useEffect(() => {
    if (selectedLimit) {
      const index = collectData.findIndex(
        (datarow) => datarow['limit'] === selectedLimit
      );
      setNoOfWeeks(collectData[index]['weeks'] || '');
      setEditToggle(collectData[index]['toggle']);
      if (collectData[index]['toggle']) setToggle(true);
      else setToggle(false);
      setRecursiveContent(collectData[index]['data']);
      setNonRecursiveContent(collectData[index]['singleData']);
    }
  }, [selectedLimit, firstHit]);

  const handleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (toggle) {
      const list = [...recursiveContent];
      if (name === 'price') {
        if (value.match(/^[0-9]*\.?([0-9]+)?$/)) {
          list[index][name] = value;
        } else setAlert('warning', 'Price can contain only numbers!');
      } else {
        list[index][name] = value;
      }
      setRecursiveContent(list);
    } else {
      const list = [...nonRecursiveContent];
      if (name === 'price') {
        if (value.match(/^[0-9]*\.?([0-9]+)?$/)) list[index][name] = value;
        else setAlert('warning', 'Price can contain only numbers!');
      } else {
        list[index][name] = value;
      }
      setNonRecursiveContent(list);
    }
  };

  const handleAdd = () => {
    const list = [...recursiveContent];
    let flag = true,
      ind = 0;
    if (list.length >= 2) {
      for (let i = 1; i < list.length; i++) {
        if (
          list[i - 1]['price'] + 1 > list[i]['price'] ||
          list[i - 1]['weeks'] + 1 > list[i]['weeks']
        ) {
          flag = false;
          ind = i;
          break;
        } else {
          flag = true;
        }
      }
    }
    if (flag) list.push({ weeks: '', price: '', id: '' });
    else
      setAlert(
        'error',
        `Price and weeks must be more than it's previous value for index ${ind + 1}`
      );

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
    if (isEdit && editToggle) {
      setAlert('warning', "Can't be changed to Non-Recurring!");
    } else {
      setToggle((prev) => !prev);
    }
  };

  const handleNumberOfWeeks = (value) => {
    setNoOfWeeks(value);
    [...recursiveContent][0]['weeks'] = parseInt(value);
    setRecursiveContent([...recursiveContent]);
    [...nonRecursiveContent][0]['weeks'] = parseInt(value);
    setNonRecursiveContent([...nonRecursiveContent]);
  };

  useEffect(() => {
    const list = [...collectData];
    for (let i = 0; i < list.length; i++) {
      if (list[i]['limit'] === selectedLimit) {
        list[i]['weeks'] = noOfWeeks;
        list[i]['toggle'] = editToggle ? editToggle : toggle;
        list[i]['data'] = recursiveContent;
        list[i]['singleData'] = nonRecursiveContent;
        break;
      }
    }
    setCollectData(list);
  }, [noOfWeeks, recursiveContent, nonRecursiveContent]);

  const handleBack = () => {
    history.push(`/course-list/${gradeKey}`);
  };

  const handleSubmit = () => {
    const list = [...collectData];
    const batchData = [];
    for (let i = 0; i < list.length; i++) {
      const coursePriceArray = [];
      if (isEdit) {
        if (list[i]['toggle']) {
          for (let k = 0; k < list[i]['data'].length; k++) {
            coursePriceArray.push({
              no_of_week: parseInt(list[i]['data'][k]['weeks']),
              price: parseFloat(list[i]['data'][k]['price']),
              id: Number(list[i]['data'][k]['id']),
            });
          }
        } else {
          coursePriceArray.push({
            no_of_week: parseInt(list[i]['singleData'][0]['weeks']),
            price: parseFloat(list[i]['singleData'][0]['price']),
            id: Number(list[i]['singleData'][0]['id']),
          });
        }
      } else {
        if (list[i]['toggle']) {
          for (let k = 0; k < list[i]['data'].length; k++) {
            coursePriceArray.push({
              no_of_week: parseInt(list[i]['data'][k]['weeks']),
              price: parseFloat(list[i]['data'][k]['price']),
            });
          }
        } else {
          coursePriceArray.push({
            no_of_week: parseInt(list[i]['singleData'][0]['weeks']),
            price: parseFloat(list[i]['singleData'][0]['price']),
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
        id: Number(list[i]['id']),
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
              setCourseId('');
              setSelectedCourse('');
              if (gradeKey && courseKey) history.push(`/course-list/${gradeKey}`);
            } else {
              setAlert('error', result.data.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        if (timeSlot.length > 0) {
          axiosInstance
            .post(`${endpoints.aol.createCoursePrice}`, request)
            .then((result) => {
              if (result.data.status_code === 200) {
                setAlert('success', result.data.message);
                resetContent();
                setCourseId('');
                setSelectedCourse('');
              } else {
                setAlert('error', result.data.message);
              }
            })
            .catch((error) => {
              setAlert('error', error.message);
            });
        } else {
          setAlert('warning', 'Time slot is mandatory!');
        }
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
        {toggle ? (
          <div className='recursiveContainer'>
            {recursiveContent?.map((row, index) => (
              <div className='recursiveRow'>
                <div className='addRemoveIconContainer'>
                  {index === recursiveContent?.length - 1 && (
                    <Add className='addRecIcon' onClick={handleAdd} />
                  )}
                  {index !== recursiveContent?.length - 1 && (
                    <Remove
                      className='removeRecIcon'
                      onClick={() => handleRemove(index)}
                    />
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
                      value={index === 0 ? noOfWeeks : row.weeks}
                      onChange={(e) => handleChange(e, index)}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          autoComplete: 'off',
                          readOnly: index === 0 && true,
                        },
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
                    value={row?.price}
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
        ) : (
          <div className='recursiveContainer'>
            <div className='recursiveRow'>
              <div className='weekContainer'>
                <div className='recursiveWeekContainer'>
                  <TextField
                    size='small'
                    id='week'
                    variant='outlined'
                    type='number'
                    name='weeks'
                    placeholder='Weeks'
                    value={noOfWeeks}
                    onChange={(e) => handleChange(e, 0)}
                    InputProps={{
                      inputProps: { min: 0, autoComplete: 'off', readOnly: true },
                    }}
                  />
                </div>
              </div>
              <div className='recursivePriceContainer'>
                <TextField
                  size='small'
                  id='pricebox'
                  variant='outlined'
                  name='price'
                  placeholder='Price'
                  value={[...nonRecursiveContent][0]['price']}
                  onChange={(e) => handleChange(e, 0)}
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
          </div>
        )}
      </div>
      <div
        className={
          courseKey && gradeKey ? 'multiButtonContainer' : 'singleButtonContainer'
        }
      >
        {courseKey && gradeKey && (
          <Button onClick={handleBack} className='backCoursePriceButton'>
            Back
          </Button>
        )}
        <Button onClick={handleSubmit} className='submitCoursePriceButton'>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default DurationContainer;
