/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  IconButton,
  OutlinedInput,
  FormHelperText,
  Typography,
  Badge,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CancelIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.scss';
import { uploadFile } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const QuestionCard = ({
  addNewQuestion,
  question,
  index,
  handleChange,
  removeQuestion,
}) => {
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [enableAttachments, setEnableAttachments] = useState(false);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const firstUpdate = useRef(true);
  const fileUploadInput = useRef(null);
  const { setAlert } = useContext(AlertNotificationContext);

  const onChange = (field, value) => {
    handleChange(index, field, value);
  };
  const handleFileUpload = async (file) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      setFileUploadInProgress(true);
      const filePath = await uploadFile(fd);
      setAttachments((prevState) => [...prevState, filePath]);
      setAttachmentPreviews((prevState) => [...prevState, URL.createObjectURL(file)]);
      setFileUploadInProgress(false);
      setAlert('success', 'File upload success');
    } catch (e) {
      setFileUploadInProgress(false);
      setAlert('error', 'File upload failed');
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    onChange('attachments', attachments);
    console.log('triggered attachment change');
  }, [attachments]);

  return (
    <div className='question-container'>
      <Card className='question-card'>
        <CardContent>
          <Grid container>
            <Grid item container>
              <Grid item md={8}>
                <FormControl variant='outlined' fullWidth size='small'>
                  {/* <InputLabel htmlFor='component-outlined'>Question</InputLabel> */}
                  <TextField
                    id='question'
                    name='question'
                    onChange={(e) => {
                      onChange('question', e.target.value);
                    }}
                    inputProps={{ maxLength: 20 }}
                    label='Question'
                    autoFocus
                    multiline
                    rows={4}
                    rowsMax={6}
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {question.errors?.question}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={4}>
                <div>
                  <input
                    className='file-upload-input'
                    type='file'
                    name='attachments'
                    onChange={(e) => {
                      handleFileUpload(e.target.files[0]);
                      // onChange('attachments', Array.from(e.target.files)[]);
                    }}
                    ref={fileUploadInput}
                  />
                  {fileUploadInProgress ? (
                    <div>
                      <CircularProgress
                        color='primary'
                        style={{ width: '25px', height: '25px', margin: '5px' }}
                      />
                    </div>
                  ) : (
                    <IconButton onClick={() => fileUploadInput.current.click()}>
                      <Badge badgeContent={attachmentPreviews.length} color='primary'>
                        <AttachFileIcon color='primary' />
                      </Badge>
                    </IconButton>
                  )}
                </div>
                <div>
                  {attachmentPreviews.map((url) => (
                    <img
                      src={url}
                      alt='preview'
                      style={{ width: '45px', margin: '5px' }}
                    />
                  ))}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <div className='question-ctrls-container'>
            <Box>
              <IconButton>
                <CloudUploadIcon color='primary' />
              </IconButton>

              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => {
                      setEnableAttachments(e.target.checked);
                      onChange('is_attachment_enable', e.target.checked);
                    }}
                    name='checkedA'
                    color='primary'
                  />
                }
                label='File Upload'
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    name='penTool'
                    onChange={(e) => {
                      onChange('penTool', e.target.checked);
                    }}
                    color='primary'
                  />
                }
                label='Pen tool Answer'
              />
            </Box>
          </div>
          {enableAttachments && (
            <Grid container spacing={2}>
              <Grid item>
                <Typography color='secondary' component='h4'>
                  Maximum number of files
                </Typography>
              </Grid>

              <Grid item>
                {/* <FormControl>
                  <InputLabel id='demo-customized-select-label'>
                    Max Attachments
                  </InputLabel> */}
                <Select
                  labelId='demo-customized-select-label'
                  id='demo-customized-select'
                  onChange={(e) => onChange('max_attachment', e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, index) => (
                    <MenuItem value={index + 1}>{index + 1}</MenuItem>
                  ))}
                </Select>
                {/* </FormControl> */}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      <div className='add-question-btn'>
        <IconButton
          onClick={() => {
            addNewQuestion(index + 1);
          }}
        >
          <AddCircleOutlineIcon color='primary' />
        </IconButton>
        {index > 0 && (
          <IconButton
            style={{ display: 'block' }}
            onClick={() => {
              removeQuestion(index);
            }}
          >
            <CancelIcon className='disabled-icon' />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
