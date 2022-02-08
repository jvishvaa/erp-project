import React, { useContext, useRef, useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { AttachFile as AttachFileIcon } from '@material-ui/icons';
import {
  Button,
  TextField,
  Dialog,
  FormControl,
  DialogContent,
  useMediaQuery,
  useTheme,
  styled,
  Grid,
  SvgIcon,
  Divider,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import deleteIcon from '../../../assets/images/delete.svg';
import attachmenticon from '../../../assets/images/attachmenticon.svg';

const EditDairy = ({ lesson, onClose, periodId }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [doc, setDoc] = useState(null);
  const [filePath, setFilePath] = useState([]);
  const [files, setFiles] = useState([]);
  const [details, setDetail] = useState('');
  const [title, setTitle] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [createdDiary, setCreatedDiary] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(lesson?.title);
    setDetail(lesson?.message);
    setFilePath(lesson?.documents);
  }, []);

  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    let selectedFileType = event.target.files[0]?.type;
    if (!fileType.includes(selectedFileType)) {
      setAlert('error', 'File Type not supported');
      event.target.value = '';
      return;
    }
    const fileSize = event.target.files[0]?.size;
    if (!validateFileSize(fileSize)) {
      setAlert('error', 'File size must be less than 25MB');
      event.target.value = '';
      return;
    }
    const data = event.target.files[0];
    const fd = new FormData();
    fd.append('file', data);
    axiosInstance.post(`academic/dairy-upload/`, fd).then((result) => {
      if (result?.data?.status_code === 200) {
        if (storeData?.documents) {
          let imageData = storeData.documents;
          imageData.push(result?.data?.result);
          setFilePath([...filePath, imageData]);
        } else {
          setFilePath([...filePath, result?.data?.result]);
        }
        setAlert('success', result?.data?.message);
      } else {
        setAlert('error', result?.data?.message);
      }
    });
  };

  const removeFileHandler = (i, file) => {
    if (storeData?.documents) {
      let list = [...filePath];
      axiosInstance
        .post(`${endpoints.circular.deleteFile}`, {
          file_name: `${file}`,
          daily_diary_id: `${storeData?.id}`,
        })
        .then((result) => {
          if (result?.data?.status_code === 204) {
            list.splice(i, 1);
            setFilePath(list);
            setAlert('success', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
    if (!storeData?.documents) {
      const list = [...filePath];
      axiosInstance
        .post(`${endpoints.circular.deleteFile}`, {
          file_name: `${file}`,
        })
        .then((result) => {
          if (result?.data?.status_code === 204) {
            list.splice(i, 1);
            setFilePath(list);
            setAlert('success', result?.data?.message);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        })
        .finally(() => setLoading(false));
    }
  };
  const handleUpdate = () => {
    let payload = {
      title,
      message: details,
      user_id: [],
      dairy_type: 1,
      period_id: periodId,
    };
    if (filePath?.length) {
      payload['documents'] = filePath;
    }
    axiosInstance
      .put(
        `${endpoints.dailyDairy.updateDelete}${lesson?.id}/update-delete-dairy/`,
        payload
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          onClose();
        } else {
          setAlert('error', 'Something went wrong');
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong');
      });
  };
  const validateFileSize = (size) => {
    return size / 1024 / 1024 > 25 ? false : true;
  };
  const FileRow = (props) => {
    const { file, onClose, index } = props;
    setFiles(file);
    return (
      <>
        <div className='file_row_image'>
          <div className='file_name_container'>{index + 1}</div>
          <div className='file_closeCircular'>
            <span onClick={onClose}>
              <SvgIcon
                component={() => (
                  <img
                    style={{
                      width: '20px',
                      height: '20px',
                      // padding: '5px',
                      cursor: 'pointer',
                    }}
                    src={deleteIcon}
                    alt='given'
                  />
                )}
              />
            </span>
          </div>
        </div>
      </>
    );
  };
  return (
    <div style={{ marginTop: '100px', width: '800px' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ marginLeft: '5%', fontSize: '20px' }}>Edit Diary</div>
        <div
          style={{ position: 'absolute', top: '100px', right: '59px' }}
        >
          <CloseIcon style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
      </div>
      <Divider style={{ width: '90%', marginLeft: '5%' }} />
      <FormControl fullWidth>
        <div>
          <TextField
            multiline
            rows={6}
            autoComplete='off'
            style={{ width: '90%', marginLeft: '5%' }}
            defaultValue={details}
            onChange={(e) => setDetail(e.target.value)}
            id='outlined-basic'
            label='Details of Classwork'
            variant='outlined'
            margin='dense'
          />
        </div>
        <FormControl fullWidth>
          <div>
            <TextField
              multiline
              style={{ marginTop: 20, marginLeft: '5%', width: '90%' }}
              id='outlined-basic'
              label='Tools Used'
              autoComplete='off'
              rows={4}
              variant='outlined'
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              margin='dense'
            />
          </div>
        </FormControl>
      </FormControl>
      <div style={{ width: '40%' }}>
        <div style={{ display: 'flex' }}>
          {filePath?.length > 0 &&
            filePath?.map((file, i) => (
              <FileRow
                key={`homework_student_question_attachment_${i}`}
                file={file}
                index={i}
                onClose={() => removeFileHandler(i, file)}
              />
            ))}
        </div>
        <div>
          <Button
            startIcon={
              <SvgIcon
                component={() => (
                  <img style={{ height: '20px', width: '20px' }} src={attachmenticon} />
                )}
              />
            }
            // className={classes.attchmentbutton}
            title='Attach Supporting File'
            variant='contained'
            size='medium'
            disableRipple
            disableElevation
            disableFocusRipple
            disableTouchRipple
            component='label'
            style={{ textTransform: 'none', marginLeft: '13%', marginTop: '5%' }}
          >
            <input
              type='file'
              style={{ display: 'none' }}
              id='raised-button-file'
              accept='image/*, .pdf'
              onChange={handleImageChange}
            />
            Add Document
          </Button>
          <br />
          <small style={{ marginLeft: '13%' }}>Accepted files: [ jpeg,jpg,png ]</small>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 15,
          marginTop: 20,
        }}
      >
        <Button
          variant='contained'
          style={{
            backgroundColor: '#3780DE',
            color: 'white',
            padding: '7px 30px',
            marginLeft: '80%',
          }}
          onClick={handleUpdate}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditDairy;
