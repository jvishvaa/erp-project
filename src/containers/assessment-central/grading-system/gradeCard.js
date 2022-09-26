import React, { useEffect, useState, useRef } from 'react';
import { Grid, TextField, IconButton, Paper } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ParameterCard from './parameterCard';

const GradeCard = ({
  isbackReport,
  handleChange,
  index,
  gradingData,
  isEdit,
  subgrade,
}) => {
  const [edit, setisEdit] = useState(isEdit ? true : false);
  const [parameterData, setparameterData] = useState([
    {
      parameter_name: '',
      parameter_description: '',
    },
  ]);
  const firstUpdate = useRef(true);

  const [gradeData, setGradeData] = useState({
    grade_name: gradingData?.grade_name,
    start_mark: gradingData?.start_mark,
    end_mark: gradingData?.end_mark,
    description: gradingData?.description,
  });

  useEffect(() => {
    if (gradingData) {
      setGradeData({
        grade_name: gradingData?.grade_name,
        start_mark: gradingData?.start_mark,
        end_mark: gradingData?.end_mark,
        description: gradingData?.description,
      });
      setparameterData(gradingData?.parameter_details);
      setisEdit(false);
    }
  }, [edit]);

  const handleParameterChange = (index, field, value) => {
    const form = parameterData[index];
    const modifiedForm = { ...form, [field]: value };
    setparameterData((prevState) => [
      ...prevState.slice(0, index),
      modifiedForm,
      ...prevState.slice(index + 1),
    ]);
  };

  //   useState(() => {
  //     handleChange(index ,grade_name,gradeData?.grade_name)
  //   },[parameterData])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleChange(index, 'grade_name', gradeData?.grade_name);
  }, [gradeData?.grade_name]);

  useEffect(() => {
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    handleChange(index, 'parameter_details', parameterData);
  }, [parameterData]);

  useEffect(() => {
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    handleChange(index, 'start_mark', gradeData?.start_mark);
  }, [gradeData?.start_mark]);

  useEffect(() => {
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    handleChange(index, 'end_mark', gradeData?.end_mark);
  }, [gradeData?.end_mark]);

  useEffect(() => {
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    handleChange(index, 'description', gradeData?.description);
  }, [gradeData?.description]);

  const addParameter = () => {
    setparameterData((prev) => [
      ...prev,
      {
        parameter_name: '',
        parameter_description: '',
      },
    ]);
  };
  const subParameter = () => {
    if (parameterData.length > 1) {
      let parameters = [...parameterData];
      parameters.pop();
      setparameterData(parameters);
    } else {
      // setAlert('warning')
      console.log('Atleast one parameter is mandatory for back Report');
    }
  };

  return (
    // <Grid container>
    <>
      {/* <Grid item container> */}
      <Grid
        container
        item
        md={11}
        xs={11}
        style={{
          padding: '10px',
          margin: '2% 0',
          background: 'white',
          border: '1px solid darkgrey',
        }}
      >
        <Grid container item xs={12} md={12} spacing={5} style={{ margin: '1% 0' }}>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              fullWidth
              required
              className='grade_name'
              label='Grade Name'
              variant='outlined'
              size='small'
              autoComplete='off'
              name='grade_name'
              value={gradeData?.grade_name}
              onChange={(e) => {
                setGradeData((prev) => ({ ...prev, grade_name: e?.target?.value }));
              }}
            />
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            style={{
              border: '1px solid darkgrey',
              borderRadius: '10px',
            //   margin: '0 2%',
            }}
          >
            <Grid container item justifyContent='center'>
              Percentage
            </Grid>
            <Grid container item justifyContent='center' style={{marginTop : '5%'}}>
              <div style={{ width: '100px' }}>
                <TextField
                  label='Start'
                  className='start_mark'
                  variant='outlined'
                  size='small'
                  autoComplete='off'
                  required
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={gradeData?.start_mark}
                  name='start_mark'
                  onChange={(e) => {
                    setGradeData((prev) => ({ ...prev, start_mark: e?.target?.value }));
                  }}
                />
              </div>
              <p style={{width: '20%', display: 'flex',justifyContent: 'center'}}>To</p>
              <div style={{ width: '100px' }}>
                <TextField
                  label='End'
                  className='end_mark'
                  variant='outlined'
                  size='small'
                  autoComplete='off'
                  value={gradeData?.end_mark}
                  name='end_mark'
                  type='number'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled = {!isEdit}   
                  onChange={(e) => {
                    setGradeData((prev) => ({ ...prev, end_mark: e?.target?.value }));
                  }}
                  required
                />
              </div>
            </Grid>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              fullWidth
              className='description'
              label='Description'
              variant='outlined'
              size='small'
              autoComplete='off'
              name='description'
              value={gradeData?.description}
              onChange={(e) => {
                setGradeData((prev) => ({ ...prev, description: e?.target?.value }));
              }}
              required
            />
          </Grid>
        </Grid>
        {isbackReport && (
          <Grid container item md={12} xs={12} style={{ margin: '1% 0' }}>
            <div>
              <IconButton onClick={() => addParameter()}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </div>
            <Grid container md={10}>
              <Paper elevation={2} container style={{ width: '100%' }}>
                <Grid container spacing={1}>
                  <Grid container item xs={12} md={12} style={{ alignItems: 'center' }}>
                    {parameterData?.map((item, i) => (
                      <ParameterCard
                        index={i}
                        isEdit={isEdit}
                        parameterData={item}
                        ParameterChange={handleParameterChange}
                      />
                    ))}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {parameterData.length > 1 && <div style={{ display: 'flex', alignItems: 'end' }}>
              <IconButton onClick={() => subParameter()}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </div>}
          </Grid>
        )}
      </Grid>
      {/* {index !== 0 && <div>
          <IconButton onClick={() => subgrade(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </div>} */}
      {/* </Grid> */}
    </>
  );
};

export default GradeCard;
