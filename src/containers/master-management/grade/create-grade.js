import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Divider, Radio, Table } from 'antd';
import Autocomplete from '@material-ui/lab/Autocomplete';
import '../master-management.css'

const CreateGrade = ({ setLoading, handleGoBack, centralGrades }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeName, setGradeName] = useState('');
  const [gradeType, setGradeType] = useState('');
  const [selectionType, setSelectionType] = useState('checkbox');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  let newArr = centralGrades.map((item , index) => ({...item,key : item?.id}))
  const [ selectedGrades ,  setSelectedGrades] = useState()


  const columns = [
    {
      title: <span style={{fontSize: '20px' , fontWeight: 600}} className='th-white '>Eduvate Grade Name</span>,
      dataIndex: 'grade_name',
      render: (text) => <span className='th-black-2 th-16'>{text}</span>,
      key: 'id',
      width : 150
    },
  ];

  const onSelectChange = (newSelectedRowKeys , value) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys , value);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedGrades(value)
    handleSeect(value)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.is_check === true,
    }),
    hideSelectAll: true,
    columnWidth: '30px'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createGrade, {
        grade_name: gradeName,
        grade_type: gradeType,
      })
      .then((result) => {
        if (result.data.status_code === 201) {
          {
            setGradeName('');
            setGradeType('');
            setLoading(false);
            setAlert('success', `Grade ${result.data?.message || result.data?.msg}`);
          }
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error?.response?.data?.message || error?.response?.data?.msg);
      });
  };

  function capitalize(str) {
    return str.toLowerCase().replace(/\b./g, function (a) {
      return a.toUpperCase();
    });
  }
  const handleSeect = (value) => {
    setLoading(true);
    console.log(value);
    const val = {
      eduvate_grade_id: value[0]?.id,
      grade_name: value[0]?.grade_name,
      description: '',
      is_optional: false,
      grade_type: value[0]?.grade_name
    }
    console.log(val);
    axiosInstance
      .post(endpoints.masterManagement.createGrade, val)
      .then((result) => {
        console.log(result);
        //  setCentralGrades(result?.data?.result)
        if (result.data.status_code === 201) {
          setLoading(false);
          handleGoBack();
          setAlert('success', ` ${result.data?.message || result.data?.msg}`);
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setAlert('error', error?.response?.data.message || error?.response?.data.msg);
      });
  }

  return (
    <>
      {/* <form autoComplete='off' onSubmit={handleSubmit}>
        <div style={{ width: '95%', margin: '20px auto' }}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
              <abbr title={gradeName} style={{ textDecoration: 'none' }}>
                <TextField
                  id='gradename'
                  label='Grade Name'
                  style={{ width: '100%' }}
                  variant='outlined'
                  size='small'
                  value={gradeName}
                  inputProps={{ pattern: '^[a-zA-Z0-9 +_-]+', maxLength: 50 }}
                  name='gradename'
                  onChange={(e) => setGradeName(capitalize(e.target.value))}
                  required
                />y
              </abbr>
            </Grid>
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
              <abbr title={gradeName} style={{ textDecoration: 'none' }}>
                <Autocomplete
                  size='small'
                  // onChange={handleAcademicYear}
                  // style={{ width: '100%' }}
                  id='session-year'
                  options={centralGrades || []}
                  // value={yearDisplay || ''}
                  getOptionLabel={(option) => option?.grade_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Central Grade'
                      placeholder='Central Grade'
                    />
                  )}
                />
              </abbr>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
              <abbr title={gradeType} style={{ textDecoration: 'none' }}>
                <TextField
                  id='gradetype'
                  label='Grade Type'
                  variant='outlined'
                  size='small'
                  style={{ width: '100%' }}
                  value={gradeType}
                  inputProps={{ maxLength: 50 }}
                  name='gradetype'
                  onChange={(e) => setGradeType(e.target.value)}
                  required
                />
              </abbr>
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
            <Button
              variant='contained'
              style={{ width: '100%' }}
              className='cancelButton labelColor'
              size='medium'
              onClick={handleGoBack}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%' }}
              color='primary'
              size='medium'
              type='submit'
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form> */}
      <div>
      <Button style={{minWidth: '5%' , margin: '0 1%'}} onClick={handleGoBack} className='eduvateGradeBack' >Back</Button>
      </div>
      <div style={{padding: '2%' , width: '50%', margin: '0 auto'}} className='tableSubjectAdd'>
        <div style={{marginBottom: '1%'}} >
        </div>
        <div>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={newArr}
            pagination={false}
            className='th-table'
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
            }
          />
        </div>
        {/* <Button onClick={handleSeect}>Submit</Button> */}
      </div>
    </>
  );
};

export default CreateGrade;
