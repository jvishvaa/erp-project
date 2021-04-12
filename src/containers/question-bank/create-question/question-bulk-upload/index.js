import React, { useState, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Button, Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';

import Loading from '../../../../components/loader/loader';

import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import DNDFileUpload from '../../../../components/dnd-file-upload';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: 'rgb(249, 250, 251)',
    // color: theme.palette.text.secondary,
    color: 'black',
    alignItems: 'center',
    alignContent: 'center',
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  },
  mpZero: {
    margin: 0,
    padding: 5,
  },
}));

const fileConf = {
  fileTypes:
    'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  types: 'xls, xlsx',
};

const singleChoiceQuesTypeId = 1;
const fillBlankQuesTypeId = 9;
const trueOrFQuesTypeId = 8;
const templateFiles = {
  [singleChoiceQuesTypeId]: {
    templateFile:
      'http://omrsheet.s3.ap-south-1.amazonaws.com/prod/assessment_config_files/assessment_single_choice.xlsx',
    url: endpoints.createQuestionBulk.BulkUploadSingleChoiceQuestion,
    label: 'Single choice questions',
    fileConf: {
      fileTypes:
        'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      types: 'xls, xlsx',
    },
    templateFileHeaders: [
      'Question',
      'Option1',
      'Option2',
      'Option3',
      'Option4',
      'Option5',
      'Correct_Answer',
    ],
  },
  [fillBlankQuesTypeId]: {
    templateFile:
      'http://omrsheet.s3.ap-south-1.amazonaws.com/prod/assessment_config_files/assessment_fill_in_the_blanks.xlsx',
    url: endpoints.createQuestionBulk.FillBlankUploadQuestion,
    label: 'Fill in the blank questions',
    fileConf: {
      fileTypes:
        'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      types: 'xls, xlsx',
    },
    templateFileHeaders: ['Question', 'Answer'],
  },
  [trueOrFQuesTypeId]: {
    templateFile:
      'http://omrsheet.s3.ap-south-1.amazonaws.com/prod/assessment_config_files/assessment_true_or_false.xlsx',
    url: endpoints.createQuestionBulk.BulkUploadTrueOrFalse,
    label: 'True or false questions',
    fileConf: {
      fileTypes:
        'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      types: 'xls, xlsx',
    },
    templateFileHeaders: ['Question', 'Option1', 'Option2', 'Correct_Answer'],
  },
};
function QuestionBulkCreation(props) {
  const { attributes = {} } = props || {};
  const {
    category: { id: questionCategoryId = 1, category: categoryLabel } = {},
    level: { id: questionLevelId = 1, level: levelLabel } = {},
    type: { id: questionTypeId = 9, question_type: questionTypeLabel } = {},
    subject: { id: gradeSubjectMappingId = 147 },
    topic: { id: topicId = 6 },
  } = attributes || {};
  const classes = useStyles();
  // const [questionTypeId] = useState(questionTypeIdFromProps);
  const [file, setFile] = useState(null);
  const [isUploading, setUploading] = useState(null);
  const { setAlert } = useContext(AlertNotificationContext);

  function uploadFiles(questionTypeId) {
    if (!templateFiles[questionTypeId]) return null;

    const { url: apiURL } = templateFiles[questionTypeId] || {};
    const payLoad = {
      file: {
        value: file,
        label: 'File',
        validationText: 'Please choose file to upload.',
      },
      grade_subject_mapping: {
        value: gradeSubjectMappingId,
        label: 'Grade subject mapping',
        validationText: 'Please choose subject.',
      },
      topic: {
        value: topicId,
        label: 'Topic',
        validationText: 'Please choose topic.',
      },
      question_level: {
        value: questionLevelId,
        label: 'Question level',
        validationText: 'Please choose qestion level.',
      },
      question_categories: {
        value: questionCategoryId,
        label: 'Question category',
        validationText: 'Please choose question category.',
      },
      question_type: {
        value: questionTypeId,
        label: 'Question type',
        validationText: 'Please choose question type.',
      },
    };
    const formData = new FormData();
    const isValid = Object.entries(payLoad).every(([key, valueObj]) => {
      formData.set(key, valueObj.value);
      if (!valueObj.value) {
        setAlert('error', valueObj.validationText);
        return false;
      }
      return true;
    });
    if (isValid) {
      setUploading(true);
      axiosInstance
        // .post(apiURL, formData, { responseType: 'blob' })
        .post(apiURL, formData)
        .then((response) => {
          setUploading(false);
          const {
            headers: { 'content-type': contentType },
            status,
          } = response;
          // if (['text/ms-excel', 'type/csv'].includes(contentType)) {
          if (['type/csv'].includes(contentType)) {
            // const blob = new Blob([response.data], {
            //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // });
            const blob = new Blob([response.data]);
            const href = window.URL.createObjectURL(blob);
            downloadSampleFile(href, 'question-creation-report.csv');
          } else {
            console.log('response is not file');
            const {
              data: { status_code: statusCode, message },
            } = response;
            // if (statusCode !== 200) {
            setAlert(statusCode === 200 ? 'success' : 'error', `${message}`);
            // }
          }
        })
        .catch((error) => {
          setUploading(false);
        });
    }
    return true;
  }
  function downloadSampleFile(url, fileNameStr) {
    const fileName = fileNameStr || url.split('/').splice(-1)[0];
    function anchorDwnld(href) {
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 150);
    }
    // axiosInstance.get(url, { responseType: 'arraybuffer' }).then((res) => {
    //   const blob = new Blob([res.data]);
    //   const href = window.URL.createObjectURL(blob);
    //   anchorDwnld(href);
    // });
    anchorDwnld(url);
  }
  function templateFileHeader(questionTypeId) {
    if (!templateFiles[questionTypeId]) return null;

    const { templateFileHeaders, templateFile } = templateFiles[questionTypeId];

    const columnsWithDividers = templateFileHeaders.join(',|,').split(',');
    const columns = columnsWithDividers.map((columnLabel) => {
      return columnLabel === '|' ? (
        <Divider orientation='vertical' flexItem />
      ) : (
        <Typography
          className={classes.mpZero}
          variant='caption'
          display='block'
          gutterBottom
        >
          {columnLabel}
        </Typography>
      );
    });
    return (
      <>
        <Typography
          className={classes.mpZero}
          variant='subtitle2'
          display='block'
          gutterBottom
        >
          File Headers:
        </Typography>
        <Grid
          container
          style={{ margin: 2 }}
          spacing={2}
          alignItems='center'
          alignContent='center'
        >
          <Grid item>
            <Grid container spacing={2} className={classes.root}>
              {columns}
            </Grid>
          </Grid>
          <Grid item>
            <Button
              size='small'
              style={{
                margin: 4,
                textTransform: 'none',
                fontSize: '0.8rem',
                display: 'inline-block',
              }}
              color='primary'
              variant='contained'
              className='modifyDesign'
              onClick={() => {
                downloadSampleFile(templateFile);
              }}
            >
              download template file
            </Button>
          </Grid>
        </Grid>
        {/* <div style={{ display: 'flex', justifyContent: 'start' }}>
          <div style={{ margin: 4 }} className={classes.root}>
            {columns}
          </div>
          <Button
            size='small'
            style={{
              margin: 4,
              textTransform: 'none',
              fontSize: '0.8rem',
              display: 'inline-block',
            }}
            color='primary'
            variant='contained'
            className='modifyDesign'
            onClick={() => {
              downloadSampleFile(templateFile);
            }}
          >
            download template file
          </Button>
        </div> */}
      </>
    );
  }

  return (
    <Paper style={{ margin: 32, padding: 10, position: 'relative' }}>
      <IconButton
        style={{ position: 'absolute', top: 0, right: 0 }}
        onClick={() => {
          props.onJobDone();
        }}
        color='primary'
        aria-label='cancel'
        component='span'
      >
        <CloseIcon />
      </IconButton>
      {isUploading ? <Loading message='uploading...' /> : null}

      {questionTypeId && !templateFiles[questionTypeId] ? (
        <>
          <h4>{`${questionTypeLabel} is not supported in bulk creation`}</h4>
        </>
      ) : null}
      {templateFileHeader(questionTypeId)}
      <br />

      <Grid container justify='space-evenly' alignContent='center' alignItems='center'>
        <Grid item sm={12} md={5}>
          <DNDFileUpload
            value={file}
            handleChange={(e) => {
              setFile(e);
            }}
            fileType={fileConf.fileTypes}
            typeNames={fileConf.types}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            className='modifyDesign'
            size='small'
            disabled={!file}
            style={{
              margin: 4,
              textTransform: 'none',
              fontSize: '1rem',
              display: 'inline-block',
            }}
            onClick={() => {
              uploadFiles(questionTypeId);
            }}
          >
            Upload
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default QuestionBulkCreation;

// var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
//         var link = document.createElement('a')
//         // eslint-disable-next-line no-debugger
//         // debugger
//         link.href = window.URL.createObjectURL(blob)
//         link.download = 'monthly_Summary_attendence_report.xls'
//         link.click()
