import React, { useContext, useRef, useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  TextField,
  FormControl,
  useTheme,
  styled,
  Grid,
  SvgIcon,
  Divider,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import deleteIcon from '../../../assets/images/delete.svg';
import DeleteIcon from '@material-ui/icons/Delete';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import Loader from '../../../components/loader/loader';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';

const Input = styled('input')({
  display: 'none',
});
const Note = styled('div')({
  color: 'dark-grey',
  marginTop: 5,
  marginLeft: 10,
  fontSize: 12,
});
const CreateDiary = (props, { lesson }) => {
  const theme = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const [filePath, setFilePath] = useState([]);
  const [files, setFiles] = useState([]);
  const [details, setDetail] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const s3Images = `${endpoints.assessmentErp.s3}/`;
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png'];
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
    setLoading(true);
    axiosInstance.post(`academic/dairy-upload/`, fd).then((result) => {
      if (result?.data?.status_code === 200) {
        setFilePath([...filePath, result?.data?.result]);
        setAlert('success', result?.data?.message);
        setLoading(false);
      } else {
        setAlert('error', result?.data?.message);
        setLoading(false);
      }
    });
  };

  const removeFileHandler = (i, file) => {
    const list = [...filePath];
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      })
      .finally(() => setLoading(false));
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
          <div className='file_name_container'>File {index + 1}</div>
          <div className='file_closeCircular'>
            <img
              style={{
                width: '50px',
                height: '50px',
                cursor: 'pointer',
              }}
              src={`${s3Images}${file}`}
              alt={`${s3Images}${file}`}
              onClick={() => {
                const fileSrc = `${s3Images}${file}`;
                openPreview({
                  currentAttachmentIndex: 0,
                  attachmentsArray: [
                    {
                      src: fileSrc,
                      name: `demo`,
                      extension: '.png',
                    },
                  ],
                });
              }}
            />
            <span onClick={onClose}>
              <SvgIcon component={() => <DeleteIcon style={{ cursor: "pointer" }} />} />
            </span>
          </div>
        </div>
      </>
    );
  };

  const handleSubmit = async () => {
    if (!details) {
      setAlert('error', "Please Enter Details of classwork")
      return;
    }
    if (!title) {
      setAlert('error', "Please Enter Tools Used")
      return;
    }
    let payload = {
      title,
      message: details,
      user_id: [],
      dairy_type: 1,
      period_id: props.periodId,
    };
    if (filePath?.length) {
      payload['documents'] = filePath;
    }
    try {
      const result = await axiosInstance.post(
        endpoints.generalDairy.SubmitDairy,
        payload
      );
      if (result.data.status_code === 200) {
        setTitle('');
        setDetail('');
        props.onClose();
        props.handleDiary();
        setAlert('success', result?.data?.message);
      } else {
        setAlert('error', 'Something Went Wrong');
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  return (
    <div style={{ marginTop: '100px', width: '700px' }}>
      {loading && <Loader />}
      {/* <div> */}
      <div style={{ display: 'flex' }}>
        <div style={{ marginLeft: '5%', fontSize: '20px' }}>Create Diary</div>
        {/* </div> */}
        <div
          style={{ position: 'absolute', top: '100px', right: '59px' }}
          onClick={props.onClose}
        >
          <CloseIcon style={{ cursor: 'pointer' }} />
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
          <div style={{ display: 'flex', flexDirection: "row", overflowY: 'hidden' }}>
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
        </FormControl>
      </FormControl>
      <div style={{ width: '40%' }}>
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
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateDiary;
