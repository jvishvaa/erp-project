import React, { useContext, useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  Typography,
  IconButton,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import '../create-course/style.css';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import deleteIcon from '../../../../assets/images/delete.svg';
import attachmenticon from '../../../../assets/images/attachmenticon.svg';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import Divider from '@material-ui/core/Divider';

const CourseCard = ({ index, cData, setData, setNoPeriods, gradeKey }) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [filePath, setFilePath] = useState([]);

  const handleCardSubmit = (e) => {
    const list = [...cData];
    list[index][e.target.name] = e.target.value;
    setData(list);
  };

  const handleImageChange = (event) => {
    const dataList = [...cData];
    // const fileList = [...filePath];
    if (dataList[index]['files'].length < 10) {
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      axiosInstance
        .post(`${endpoints.onlineCourses.fileUpload}`, fd)
        .then((result) => {
          if (result.data.status_code === 200) {
            dataList[index]['files'].push(result.data?.result?.get_file_path);
            // fileList.push(result.data?.result?.get_file_path);
            setAlert('success', result.data.message);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) =>
          setAlert('error', error.response?.data?.msg || error.response?.data?.message)
        );
      setData(dataList);
      // setFilePath(fileList);
    } else {
      setAlert('warning', 'Attachment limit exceeded!');
    }
  };

  const handleDownload = (periodData) => {
    for (let i = 0; i < periodData?.files?.length; i++) {
      // let a = document.createElement('a');
      // a.href = `https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/aol_file/course/${periodData?.files[i]}`;
      // a.download = true;
      // const isConfirm = window.confirm('Download ?');
      // if (isConfirm) {
      //   a.click();
      //   a.remove();
      // }
      window.open(
        // `https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/aol_file/course/${periodData?.files[i]}`
        `https://d3ka3pry54wyko.cloudfront.net/dev/aol_file/course/${periodData?.files[i]}`
      );
    }
    // anchors.forEach((anchor) => anchor.click());
    // anchors.forEach((anchor) => anchor.remove());
  };

  const removeFileHandler = (i) => {
    const list = [...cData];
    list[index]['files'].splice(i, 1);
    setData(list);

    // const fileList = [...filePath];
    // fileList.splice(i, 1);
    // setFilePath(fileList);
  };

  const handleRemovePeriod = () => {
    setData([...cData].filter((_, i) => index !== i));
    setNoPeriods((prev) => prev - 1);
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image_course1'>
        <div className='file_name_container_course1'>File {index + 1}</div>
        <Divider orientation='vertical' className='divider_color_course' flexItem />
        <div className='file_close'>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={{
                    width: '15px',
                    height: '20px',
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
    );
  };

  return (
    <>
      <Paper
        className='courseCardContainer'
        style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}
      >
        <Grid container spacing={2}>
          <div className='periodCrossWrapper'>
            <div className='periodTag'>Period {`${index + 1}`}</div>
            {!gradeKey && (
              <div className='removePeriodIcon'>
                <IconButton onClick={handleRemovePeriod}>
                  <CloseIcon color='secondary' />
                </IconButton>
              </div>
            )}
          </div>
          <Grid item xs={12}>
            <Box>
              <TextField
                id={`title${index}`}
                placeholder='Period Title'
                multiline
                rows='1'
                className='periodDescBox'
                color='secondary'
                style={{ width: '100%' }}
                name='title'
                value={cData[index]?.title}
                variant='outlined'
                inputProps={{
                  readOnly: Boolean(gradeKey),
                }}
                onChange={handleCardSubmit}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <TextField
                id={`desc${index}`}
                placeholder='Period Description'
                multiline
                rows='3'
                className='periodDescBox'
                color='secondary'
                style={{ width: '100%' }}
                name='description'
                value={cData[index]?.description}
                variant='outlined'
                inputProps={{
                  readOnly: Boolean(gradeKey),
                }}
                onChange={handleCardSubmit}
              />
            </Box>
          </Grid>
          <div className='attachmentContainer1'>
            {!gradeKey && (
              <div className='scrollableContent1'>
                {cData[index]?.files?.length > 0
                  ? cData[index]?.files?.map((file, i) => (
                      <FileRow
                        key={`homework_student_question_attachment_${i}`}
                        file={file}
                        index={i}
                        onClose={() => removeFileHandler(i)}
                      />
                    ))
                  : null}
              </div>
            )}
            {!gradeKey ? (
              <div className='attachment_button'>
                <Button
                  startIcon={
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ height: '15px', width: '15px' }}
                          src={attachmenticon}
                        />
                      )}
                    />
                  }
                  title='Attach Supporting File'
                  variant='contained'
                  size='medium'
                  disableRipple
                  disableElevation
                  disableFocusRipple
                  disableTouchRipple
                  component='label'
                  style={{ textTransform: 'none' }}
                >
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    id='raised-button-file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  Add Document
                </Button>
              </div>
            ) : (
              <div className='downloadAllContainer'>
                <div className='noOfFilesTag'>
                  No. of files : {cData[index].files.length}{' '}
                </div>
                <div className='downloadAllIconContainer'>
                  {cData[index]?.files?.length > 0 && (
                    <IconButton onClick={() => handleDownload(cData[index])}>
                      <SvgIcon
                        component={() => (
                          <img
                            target='blank'
                            style={{ height: '21px', width: '21px' }}
                            src={downloadAll}
                            alt='downloadAll'
                          />
                        )}
                      />
                    </IconButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Paper>
    </>
  );
};

export default CourseCard;
