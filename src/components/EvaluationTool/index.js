import React,{ useState } from 'react';
import Card from '@material-ui/core/Card';
import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button'
// import DescriptiveTestCorrection from './descriptiveTestCorrection'
import { makeStyles } from '@material-ui/core/styles';
import DescriptvieTestEvaluvation from './descriptvieTestEvaluvation/components/descriptiveTestEvaluvation';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import './descriptvieTestEvaluvation/editor/correction_styles.css';

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
          // height: '100%',
          overflow: 'auto',
          background: 'grey',
          margin:'auto',
          // border:'solid red',
          height:'115vh',
          marginTop:'7%'
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
        <div className='fwd-btn' >
            <ArrowDropDownIcon className='arrow-middle' style={{fontSize:"2.5rem"}} onClick={()=>setImage(index+1)}></ArrowDropDownIcon>
        </div>
        <div className='previous-btn' >
            <ArrowDropUpIcon className='arrow-middle' style={{fontSize:"2.5rem"}} onClick={()=>setImage(index-1)}></ArrowDropUpIcon>
        </div>
      </Card>
    </Modal>
  );
};

export default DescriptiveTestCorrectionModule;
