import React, { useEffect, useState, useContext } from 'react';
import Layout from 'containers/Layout';
import {
  Grid,
  TextField,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import GradeCard from './gradeCard';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import Loader from 'components/loader/loader';

function GradingCreate() {
  const [isbackReport, setisBackReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gradingSystemName, setGradingSystemName] = useState('');
  const [isValidated, setValidated] = useState(false);
  const [gradeCount, setGradeCount] = useState([
    {
      grade_name: '',
      start_mark: '',
      end_mark: '',
      description: '',
      parameter_details: [
        {
          parameter_name: '',
          parameter_description: '',
        },
      ],
      total_count: 0,
    },
  ]);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const GradingData = history?.location?.state?.gradeData;
  const [Edit, setisEdit] = useState(history?.location?.state?.isEdit);
  const [totalmarkcount, setTotalmarksCount] = useState(0);
  console.log(gradeCount, '@@');

  const subParameter = (index) => {
    if (gradeCount.length > 1) {
      let grades = [...gradeCount];
      //   grades.splice(index,1);
      grades.pop();
      setGradeCount(grades);
    } else {
      // setAlert('warning')
      console.log('Atleast one is mandatory for grade');
    }
  };

  const handlebackReport = () => {
    setisBackReport(!isbackReport);
  };

  //   useEffect(() => {
  //     if(isValidated){
  //         if(Edit) handlevalidate()
  //         else handleCreate()
  //     }

  //   },[isValidated])

  useEffect(() => {
    if (history?.location?.state?.gradeData) {
      if (Edit) {
        setisEdit(false);
        setGradingSystemName(GradingData?.grading_system_name);
        setGradeCount(GradingData?.grade_data);
        setisBackReport(GradingData?.is_back_page_activated);
      }
    }
  }, [history?.location?.state?.gradeData]);

  const handleChange = (index, field, value) => {
    const form = gradeCount[index];
    const modifiedForm = { ...form, [field]: value };
    setGradeCount((prevState) => [
      ...prevState.slice(0, index),
      modifiedForm,
      ...prevState.slice(index + 1),
    ]);
  };

  const backreportvalidate = (tovalidate, ops) => {
    if (isbackReport && ops !== 'create') {
      let verifyparameters = [];
      let check = tovalidate?.parameter_details?.forEach((data) => {
        if (data?.parameter_name?.length === 0)
          return setAlert('error', 'Parameter Name Required !');
        if (data?.parameter_description?.length === 0)
          return setAlert('error', 'Parameter Description Required !');
        else verifyparameters.push(true);
      });
      if (verifyparameters.length === tovalidate?.parameter_details.length) return true;
      else return false;
    } else {
      let all_validation_array = [];
      tovalidate.forEach((item) => {
        if (isbackReport) {
          let verifyparameters = [];
          let check = item?.parameter_details?.forEach((data) => {
            if (data?.parameter_name?.length === 0)
              return setAlert('error', 'Parameter Name Required !');
            if (data?.parameter_description?.length === 0)
              return setAlert('error', 'Parameter Description Required !');
            else verifyparameters.push(true);
          });
          if (verifyparameters?.length === item?.parameter_details?.length) {
            all_validation_array.push(true);
          }
        } else all_validation_array.push(true);
      });
      if (all_validation_array?.length === gradeCount?.length) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleValidation = (grade, task) => {
    let last_arr = grade[grade.length - 1];
    let checking_arr = [];
    let totalCount;

    // if (grade.length > 1) {

    grade.forEach((tovalidate, i, grade) => {
      if (i != 0) {
        totalCount =
          tovalidate?.start_mark == 0
            ? parseInt(tovalidate?.end_mark) -
              parseInt(tovalidate?.start_mark) +
              parseInt(totalCount)
            : parseInt(tovalidate?.end_mark) -
              parseInt(tovalidate?.start_mark) +
              1 +
              parseInt(totalCount);

        if (tovalidate.grade_name?.length === 0)
          return setAlert('error', 'Please Enter Grade Name !');
        else if (tovalidate?.start_mark?.length === 0)
          return setAlert('error', 'Please Enter Start Mark !');
        else if (tovalidate?.start_mark?.length > 2 && tovalidate?.start_mark > 0)
          return setAlert('error', 'Start Mark cannot be above 100 !');
        else if (tovalidate?.start_mark < 0 || tovalidate?.end_mark < 0)
          return setAlert('error', 'Marks cannot be negetive !');
        else if (tovalidate?.end_mark?.length === 0)
          return setAlert('error', 'Please Enter End Mark  !');
        else if (tovalidate?.end_mark > 100)
          return setAlert('error', 'End Mark cannot be above 100 !');
        else if (parseInt(tovalidate?.end_mark) <= parseInt(tovalidate?.start_mark))
          return setAlert('error', 'Start Mark should be less than End Mark!');
        else if (parseInt(tovalidate?.end_mark) >= parseInt(grade[i - 1]?.start_mark))
          return setAlert(
            'error',
            'End Mark should be lesser than start Mark of previous !'
          );
        else if ((tovalidate?.start_mark || tovalidate?.end_mark) < 0)
          return setAlert('error', 'Marks cannot be less than 0');
        else if (tovalidate?.description?.length === 0)
          return setAlert('error', 'Description Required !');
        if (tovalidate.start_mark > grade[i - 1]?.start_mark)
          return setAlert(
            'error',
            'Start Marks cannot be greater than previous start marks !'
          );
        if (parseInt(tovalidate.end_mark) !== parseInt(grade[i - 1]?.start_mark) - 1)
          return setAlert(
            'error',
            'End marks should be till the start mark - 1  of previous grade'
          );
        if (tovalidate.grade_name === grade[i - 1]?.grade_name)
          return setAlert('error', 'Grade name cannot be same !');
        if (tovalidate.start_mark === grade[i - 1]?.start_mark)
          return setAlert('error', 'start_mark cannot be same !');
        if (tovalidate.end_mark === grade[i - 1]?.end_mark)
          return setAlert('error', 'end_mark cannot be same !');
        if (tovalidate.start_mark === grade[i - 1]?.end_mark)
          return setAlert('error', 'Marks are overlapping please change one of them !');
        if (isbackReport) {
          let check;
          if (task === 'create' || task == 'update') {
            check = backreportvalidate(gradeCount, 'create');
          } else {
            check = backreportvalidate(tovalidate, 'add');
          }
          if (!check) return setAlert('error', 'Please fill all Parameter Details');
          if ((task === 'create' || task == 'update') && totalCount == 100 && check) {
            checking_arr.push(true);
          } else if ((task === 'create' || task == 'update') && totalCount != 100)
            return setAlert('error', 'Please fill all marks Percentage ( 0 - 100 )');
          else if ((task === 'create' || task == 'update') && totalCount >= 100)
            return setAlert(
              'error',
              'You cannot add more grades as marks limit Exceed(1-100) !'
            );
          else {
            checking_arr.push(true);
            setTotalmarksCount(totalCount);
          }
        } else {
          if ((task === 'create' || task == 'update') && totalCount == 100) {
            checking_arr.push(true);
          } else if ((task === 'create' || task == 'update') && totalCount != 100 && i === grade?.length -1)
            return setAlert('error', 'Please fill all marks Percentage ( 0 - 100 )');
          else if (totalCount >= 100)
            return setAlert(
              'error',
              'You cannot add more grades as marks limit Exceed(1-100) !'
            );
          else {
            checking_arr.push(true);
            setTotalmarksCount(totalCount);
          }
        }
      } else {
        totalCount =
          grade[0]?.start_mark == 0
            ? parseInt(grade[0]?.end_mark) -
              parseInt(grade[0]?.start_mark) +
              parseInt(grade[0].total_count)
            : parseInt(grade[0]?.end_mark) -
              parseInt(grade[0]?.start_mark) +
              1 +
              parseInt(grade[0].total_count);
        if (grade[0].grade_name?.length === 0)
          return setAlert('error', 'Please Enter Grade Name !');
        else if (grade[0]?.start_mark?.length === 0)
          return setAlert('error', 'Please Enter Start Mark !');
        else if (grade[0]?.start_mark?.length > 2 && grade[0]?.start_mark > 0)
          return setAlert('error', 'Start Mark cannot be above 100 !');
        else if (grade[0]?.start_mark < 0 || grade[0]?.end_mark < 0)
          return setAlert('error', 'Marks cannot be negetive !');
        else if (grade[0]?.end_mark?.length === 0)
          return setAlert('error', 'Please Enter End Mark  !');
        else if (grade[0]?.end_mark > 100)
          return setAlert('error', 'End Mark cannot be above 100 !');
        else if (grade[0]?.end_mark < 100)
          return setAlert('error', 'End Mark should be 100 !');
        else if (parseInt(grade[0]?.end_mark) <= parseInt(grade[0]?.start_mark))
          return setAlert('error', 'End Mark should be greater than start Mark !');
        else if ((grade[0]?.start_mark || grade[0]?.end_mark) < 0)
          return setAlert('error', 'Marks cannot be less than 0');
        else if (grade[0]?.description?.length === 0)
          return setAlert('error', 'Description Required !');
        if (isbackReport) {
          let check = backreportvalidate(grade[0]);
          if (!check) return setAlert('error', 'Please fill all Parameter Details');
          if ((task === 'create' || task == 'update') && totalCount == 100 && check) {
            checking_arr.push(true);
          } else if ((task === 'create' || task == 'update') && totalCount != 100)
            return setAlert('error', 'Please fill all marks Percentage ( 0 - 100 )');
          else if (totalCount >= 100)
            return setAlert(
              'error',
              'You cannot add more grades as marks limit Exceed(1-100) !'
            );
          else {
            checking_arr.push(true);
            setTotalmarksCount(totalCount);
          }
        } else {
          if ((task === 'create' || task == 'update') && totalCount == 100) {
            checking_arr.push(true);
            setTotalmarksCount(totalCount);
          } else if (
            (task === 'create' || task == 'update') &&
            totalCount != 100 &&
            grade.length === 1
          )
            return setAlert('error', 'Please fill all marks Percentage ( 0 - 100 )');
          else if (totalCount >= 100)
            return setAlert(
              'error',
              'You cannot add more grades as marks limit Exceed(1-100) !'
            );
          else {
            checking_arr.push(true);
            setTotalmarksCount(totalCount);
          }
        }
      }
    });

    if
      (task !== 'addCard' && (checking_arr.length === grade.length) &&
      totalCount === 100
    ) {
      // setTotalmarksCount(totalCount);
      setValidated(true);
      return true;
    }else if((checking_arr.length === grade.length) && totalCount !== 100){
        setValidated(true);
        return true
    }
  };

  const addGradeCard = async () => {
    let validated = await handleValidation(gradeCount, 'addCard');
    if (validated || isValidated) {
      setValidated(false);
      setGradeCount((prev) => [
        ...prev,
        {
          grade_name: '',
          start_mark: '',
          end_mark: '',
          description: '',
          parameter_details: [
            {
              parameter_name: '',
              parameter_description: '',
            },
          ],
          total_count: totalmarkcount,
        },
      ]);
    }
  };

  const handleUpdate = async () => {
    let validated = await handlevalidate('update');
    if (validated || isValidated) {
      setLoading(true);
      let params = {
        grading_system_name: gradingSystemName,
        grade_data: gradeCount,
        is_back_page_activated: isbackReport,
      };
      axiosInstance
        .put(`${endpoints.gradingSystem.GradingData}${GradingData?.id}/`, params)
        .then((res) => {
          setLoading(false);
          //   setGradingData(res.data.result);
          setAlert('success', 'Updated Successfully');
          history.push('./grading-system');
        })
        .catch((error) => {
          setLoading(false);
          setAlert(
            'error',
            error.response.data.message ||
              error.response.data.msg ||
              'Issue occuring whilw creating'
          );
          console.log(error); // to give set Alert later
        });
    }
  };

  // const handlevalidation = () => {
  //     let all_validation_array = []
  //    gradeCount.forEach((item) => {
  //     debugger
  //         if(item?.grade_name?.length === 0) return setAlert('error','Please Enter Grade Name !')
  //         else if(item?.start_mark?.length === 0) return setAlert('error','Please Enter Start Mark !')
  //         else if(item?.start_mark?.length > 2) return setAlert('error','Start Mark cannot be above 100 !')
  //         else if(item?.end_mark?.length === 0 ) return setAlert('error','Please Enter End Mark  !')
  //         else if(item?.end_mark > 100 ) return setAlert('error','End Mark cannot be above 100 !')
  //         else if(parseInt(item?.end_mark) <= parseInt(item?.start_mark)) return setAlert('error','End Mark should be greater than start Mark !')
  //         else if((item?.start_mark || item?.end_mark) < 0) return setAlert('error','Marks cannot be less than 0')
  //         else if(item?.description?.length === 0) return setAlert('error','Description Required !')
  //         else if(isbackReport){
  //             let verifyparameters = []
  //             let check = item?.parameter_details?.forEach((data) => {
  //                 if(data?.parameter_name?.length===0) return setAlert('error','Parameter Name Required !')
  //                 if(data?.parameter_description?.length===0) return setAlert('error','Parameter Description Required !')
  //                 else verifyparameters.push(true)
  //             })
  //             if(verifyparameters?.length === item?.parameter_details?.length){
  //                 all_validation_array.push(true)
  //             }
  //         }
  //         else all_validation_array.push(true)
  //     })
  //     if((all_validation_array?.length === gradeCount?.length)) {
  //         setValidated(true)
  //     }
  //     setLoading(false)
  // }

  const handlevalidate = async (task) => {
    if (!gradingSystemName.length) {
      return setAlert('error', 'Grading System Name Required !');
    } else {
      return await handleValidation(gradeCount, task);
    }
  };

  const handleCreate = async () => {
    let validated = await handlevalidate('create');
    if (validated || isValidated) {
      setLoading(true);
      let params = {
        grading_system_name: gradingSystemName,
        grade_data: gradeCount,
        is_back_page_activated: isbackReport,
      };
      axiosInstance
        .post(`${endpoints.gradingSystem.GradingData}`, params)
        .then((res) => {
          setLoading(false);
          //   setGradingData(res.data.result);
          setAlert('success', 'Created Successfully');
          history.push('./grading-system');
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
      setLoading(false);
    }
  };
  const handleback = () => {
    history.push('./grading-system');
  };

  return (
    <Layout>
      {loading && <Loader />}
      <Grid container>
        <Grid container item xs={12} md={12}>
          <Grid item md={3} sm={4} xs={12} style={{ margin: '2% 4%' }}>
            <TextField
              fullWidth
              className='meeting-name'
              label='Grade System Name'
              variant='outlined'
              size='small'
              autoComplete='off'
              name='meetingNameFilter'
              value={gradingSystemName}
              required
              onChange={(e) => {
                setGradingSystemName(e?.target?.value);
              }}
            />
          </Grid>
          <Grid container justifyContent='flex-end' item xs={9} sm={3} md={7}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isbackReport}
                  onChange={handlebackReport}
                  name='checkedB'
                  color='primary'
                />
              }
              label='Back page Activation'
            />
          </Grid>
        </Grid>
        <Grid container xs={12} md={12}>
          <div>
            <IconButton
              onClick={() => {
                addGradeCard();
              }}
            >
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
          </div>
          <Grid item container md={10} xs={10}>
            {gradeCount?.map((item, index) => (
              <GradeCard
                index={index}
                gradingData={item}
                isbackReport={isbackReport}
                handleChange={handleChange}
                isEdit={history?.location?.state?.isEdit}
                subgrade={subParameter}
              />
            ))}
            <div style={{ display: 'flex', alignItems: 'end' }}>
              {gradeCount.length > 1 && (
                <IconButton onClick={() => subParameter()}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent='space-between'
          item
          xs={12}
          md={12}
          style={{ margin: '2%' }}
        >
          {/* <Grid item md={3} xs = {12}> */}
          {history?.location?.state?.isEdit ? (
            <Button color='primary' variant='contained' onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button color='primary' variant='contained' onClick={handleCreate}>
              Create
            </Button>
          )}
          <Button color='primary' variant='contained' onClick={handleback}>
            Back
          </Button>
        </Grid>
        {/* <Grid item md={3} xs = {12}>
            <Button 
            color='primary'
            variant='contained'
            onClick={handleback}
            >
            Back
          </Button>
         </Grid> */}

        {/* </Grid> */}
      </Grid>
    </Layout>
  );
}

export default GradingCreate;
