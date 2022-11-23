import React, { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  FormControlLabel,
  Typography,
  useMediaQuery,
  Switch
} from '@material-ui/core';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Divider, Radio, Table } from 'antd';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'containers/academicCalendar/fullcalendar/acadCalendar.scss';

const CreateSubject = ({ setLoading, handleGoBack, centralSubjects }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [optional, setOptional] = useState(false);
  const [tableView, setTableView] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let newArr = centralSubjects.map((item, index) => ({ ...item, key: item?.id }))
  const [open, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: <span style={{ fontSize: '20px', fontWeight: 600 }} className='th-white '>Subject Name</span>,
      dataIndex: 'subject_name',
      render: (text) => <span className='th-black-2 th-16'>{text}</span>,
      key: 'id',
      width: 150
    },
  ];

  const onSelectChange = (newSelectedRowKeys, value) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys, value);
    handleSeect(value)
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedSubjects(value)
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

  const tableViewChange = (event) => {
    setTableView(event.target.checked);
  };

  const handleChange = (event) => {
    setOptional(event.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.createSubject, {
        subject_name: subjectName,
        description: description,
        is_optional: optional,
        eduvate_subject_id: null
      })
      .then((result) => {
        if (result.data.status_code === 201) {
          setSubjectName('');
          setDescription('');
          setLoading(false);
          setOptional(false);
          handleGoBack();
          setAlert('success', ` ${result.data?.message || result.data?.msg}`);
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.message || error.response.data.msg);
      });
  };

  const handleSeect = (value) => {
    setLoading(true);
    console.log(value);
    const val = {
      eduvate_subject_id: value[0]?.id,
      subject_name: value[0]?.subject_name,
      description: '',
      is_optional: false,
    }
    console.log(val);
    axiosInstance
      .post(endpoints.masterManagement.createSubject, val)
      .then((result) => {
        console.log(result);
        //  setCentralGrades(result?.data?.result)
        if (result.data.status_code === 201) {
          setLoading(false);
          setOptional(false);
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
      <div>
        {/* <div style={{ width: '95%', margin: '20px auto' }} >
          <span style={{ fontSize: '20px' }}>Table View</span>
          <Switch onChange={tableViewChange} checked={tableView} />
        </div>
        {!tableView ?
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div style={{ width: '95%', margin: '20px auto' }}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
                  <TextField
                    id='subname'
                    style={{ width: '100%' }}
                    label='Subject Name'
                    variant='outlined'
                    size='small'
                    value={subjectName}
                    // inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
                    inputProps={{ maxLength: 20 }}
                    name='subname'
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
                  <TextField
                    id='description'
                    label='Description'
                    variant='outlined'
                    size='small'
                    style={{ width: '100%' }}
                    multiline
                    rows={4}
                    rowsMax={6}
                    inputProps={{ maxLength: 100 }}
                    value={description}
                    name='description'
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    className='switchLabel'
                    control={
                      <Switch
                        checked={optional}
                        onChange={handleChange}
                        name='optional'
                        color='primary'
                      />
                    }
                    label={
                      <Typography color='secondary'>
                        {optional ? 'Optional' : 'Not-Optional'}
                      </Typography>
                    }
                  />
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
          </form>
          : */}
        <div>
          <Button style={{ minWidth: '5%', margin: '0 1%' }} onClick={handleGoBack}>Back</Button>
        </div>
        <div style={{ padding: '2%', width: '50%', margin: '0 auto' }} className='tableSubjectAdd'>
          
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
          <div style={{ margin: '1% 0', display: 'flex', justifyContent: 'space-between' }} >
            <Button className='buttonAddSub' style={{ minWidth: '10%' }} onClick={showModal}>Add Subject</Button>
          </div>
        </div>
        {/* } */}
      </div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: '700px' }}
        className='addSubjectCss'
      >
        <DialogTitle id="alert-dialog-title">{"Add Subject"}</DialogTitle>
        <DialogContent>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div style={{ width: '95%', margin: '20px auto' }}>
              <div>
                <div className={isMobile ? '' : 'addEditPadding'}>
                  <TextField
                    id='subname'
                    style={{ width: '100%' }}
                    label='Subject Name'
                    variant='outlined'
                    size='small'
                    value={subjectName}
                    // inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 20 }}
                    inputProps={{ maxLength: 20 }}
                    name='subname'
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div container spacing={5}>
                <div className={isMobile ? '' : 'addEditPadding'}>
                  <TextField
                    id='description'
                    label='Description'
                    variant='outlined'
                    size='small'
                    style={{ width: '100%' }}
                    multiline
                    rows={4}
                    rowsMax={6}
                    inputProps={{ maxLength: 100 }}
                    value={description}
                    name='description'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div container spacing={5}>
                <div >
                  <FormControlLabel
                    className='switchLabel'
                    control={
                      <Switch
                        checked={optional}
                        onChange={handleChange}
                        name='optional'
                        color='primary'
                      />
                    }
                    label={
                      <Typography color='secondary'>
                        {optional ? 'Optional' : 'Not-Optional'}
                      </Typography>
                    }
                  />
                </div>
              </div>
            </div>
            <div container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
              <div className={isMobile ? '' : 'addEditButtonsPadding'}>
                <Button
                  variant='contained'
                  style={{ width: '100%' }}
                  className='cancelButton labelColor'
                  size='medium'
                  onClick={handleGoBack}
                >
                  Back
                </Button>
              </div>
              <div className={isMobile ? '' : 'addEditButtonsPadding'}>
                <Button
                  variant='contained'
                  style={{ color: 'white', width: '100%' }}
                  color='primary'
                  size='medium'
                  type='submit'
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateSubject;
