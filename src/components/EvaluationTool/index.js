import React,{ useState } from 'react';
import Card from '@material-ui/core/Card';
import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button'
// import DescriptiveTestCorrection from './descriptiveTestCorrection'
import { makeStyles } from '@material-ui/core/styles';
import DescriptvieTestEvaluvation from './descriptvieTestEvaluvation/components/descriptiveTestEvaluvation';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
  modal: {
    top: theme.mixins.toolbar.minHeight,
  },
}));

const DescriptiveTestCorrectionModule = ({
  index,
  fileUrl,
  savedFiles,
  desTestDetails,
  mediaContent,
  handleClose,
  alert,
  open,
  callBackOnPageChange,
  isLoaded,
  dataT,
  handleSaveFile,
  IconButton,
  setImage
}) => {
  // const [mediaContained, setMediaContained] = useState(mediaContent)
  // const [imageIndex, setimageIndex] = useState(index);
  const classes = useStyles();
  return (
    <Modal open onClose={handleClose} disablePortal className={classes.modal}>
      <Card
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          background: 'grey',
          margin:'auto',
          border:'solid red'
          // padding: '40px'
        }}
      >
        <React.Fragment>
          <DescriptvieTestEvaluvation
            desTestDetails={desTestDetails}
            mediaContent={mediaContent}
            alert={alert}
            handleClose={handleClose}
            callBackOnPageChange={callBackOnPageChange}
            isLoaded={isLoaded}
            dataT={dataT}
            handleSaveFile={handleSaveFile}
          />
        </React.Fragment>
        <div className='prev-btn' style={{position:'absolute',left:"95%",top:'50%'}}>
            <ArrowForwardIosIcon onClick={()=>setImage(index+1)}></ArrowForwardIosIcon>
        </div>
        <div className='prev-btn' style={{position:'absolute',left:"2%",top:'50%'}}>
            <ArrowBackIosIcon onClick={()=>setImage(index-1)}></ArrowBackIosIcon>
        </div>
      </Card>
    </Modal>
  );
};

export default DescriptiveTestCorrectionModule;
