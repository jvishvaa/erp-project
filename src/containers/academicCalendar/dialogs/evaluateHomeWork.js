import React, { useState, useEffect } from 'react';
import { Button, TextField, IconButton, Grid, Typography } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Avatar from '@material-ui/core/Avatar';
import orchids from '../../../assets/images/orchids.png';
import CreateIcon from '@material-ui/icons/Create';
import AddScoreDialog from './addScoreDialog';
import DescriptiveTestcorrectionModule from '../../../components/EvaluationTool';
import { uploadFile } from '../../../redux/actions';

const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];

const EvaluateHomeWork = (props) => {
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState();
  const [remark, setRemark] = useState('');

  const [penToolOpen, setPenToolOpen] = useState(false);
  const [penToolUrl, setPenToolUrl] = useState('');
  const [penToolIndex, setPenToolIndex] = useState('');

  const mediaContent = {
    file_content: props?.studentData?.uploaded_file[0],
    id: 1,
    splitted_media: null,
  };

  useEffect(() => {
      if (penToolUrl) {
        setPenToolOpen(true);
      } else {
        setPenToolOpen(false);
      }
    }, [penToolUrl])

  const openInPenTool = (url, index) => {
    setPenToolUrl(url);
    setPenToolIndex(index);
  };

  const handleCloseCorrectionModal = () => {
    setPenToolUrl('');
    setPenToolIndex('');
  };

 const handleSaveEvaluatedFile = async (file) => {
    

    const fd = new FormData();
    fd.append('file', file);
    const filePath = await uploadFile(fd);

    // const list = bulkDataDisplay.slice();
    // list.push(filePath);
    // setBulkDataDisplay(list);
    // bulkData.push(filePath);
    setPenToolUrl('');
  };

  const addScore = () => {
    setShowScore(true);
  };
  const handleClose = () => {
    setShowScore(false);
  };

  const setStudentScore = (val) => {
    setScore(val);
  };

  const setStudentRemark = (val) => {
    setRemark(val);
  };

  return (
    <>
      <Grid
        item
        md={12}
        xs={12}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* <Grid item md={2} xs={2}>
          <Button
            variant='contained'
            color='primary'
            //   onClick={addInput}
          >
            Prev Student
          </Button>
        </Grid> */}
        <Grid
          item
          md={10}
          xs={10}
          style={{
            height: '65px',
            border: '1px solid #bfc8e4',
            background: '#bfc8e4',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '7%',
          }}
        >
          {/* <Avatar></Avatar> */}
          <div style={{ marginLeft: '2%' }}>
            {/* <Avatar></Avatar> */}
            <p>{props?.studentData?.student_name}</p>
            <p>Roll No : 21</p>
          </div>

          {/* <Typography style={{margin:'auto'}}> </Typography> */}
          <IconButton
            size='small'
            style={{ marginLeft: '70%', background: 'black' }}
              onClick={() => openInPenTool(props?.studentData?.uploaded_file)}
          >
            <CreateIcon style={{ color: '#ffffff' }} />
          </IconButton>
          <Button
            variant='contained'
            color='primary'
            style={{ marginLeft: '4%' }}
            onClick={addScore}
          >
            Add Score
          </Button>
        </Grid>
        {/* <Grid item md={2} xs={2}>
          <Button
            variant='contained'
            color='primary'
            style={{ float: 'right' }}

            //   onClick={addInput}
          >
            Next Student
          </Button>
        </Grid> */}
        <Grid item md={1} xs={1}>
          <IconButton
            // onClick={handleCancel}
            aria-label='close'
            size='large'
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => props.redirect(null)}
          >
            <HighlightOffIcon
              // style={{ color: 'white', backgroundColor: 'black' }}
              fontSize='inherit'
            />
          </IconButton>
        </Grid>
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
        style={{ marginTop: '1%', background: '#cfd3d5', border: '30px solid #eeeeee' }}
      >
        <div className='attachment-viewer-frame-preview attachment-viewer-frame-preview-image-wrapper'>
          <img
            alt='sd'
            className='attachment-viewer-frame-preview-image'
            src={props?.studentData?.uploaded_file[0]}
          />
        </div>
      </Grid>
      {showScore && (
        <AddScoreDialog
          // periodId={id}
          open={showScore}
          onClose={handleClose}
          studentScore={score}
          updateScore={setStudentScore}
          // flagprop={updateFlag}
          studentRemark={remark}
          handlestudentRemark={setStudentRemark}
          homeWorkId={props?.homeWorkId}
          // studentId={currentId}
          // nameStudent={studentName}
        />
      )}

      {penToolOpen && (
        <DescriptiveTestcorrectionModule
          desTestDetails={desTestDetails}
          mediaContent={mediaContent}
          handleClose={handleCloseCorrectionModal}
          alert={undefined}
          open={penToolOpen}
          callBackOnPageChange={() => {}}
          handleSaveFile={handleSaveEvaluatedFile}
        />
      )}
    </>
  );
};

export default EvaluateHomeWork;
