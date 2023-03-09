import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  makeStyles,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Checkbox, Drawer, Input, message, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import QuestionCard from './questionCard';
import QuestionBankDrawer from './questionBankDrawer';
import { addInstructionToSection, addOptionalQuestion } from 'redux/actions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 20,
  },
  dailog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogPaper: {
    minHeight: '45vh',
    maxHeight: '45vh',
  },
  dgsize: {
    width: '100%',
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
const resolveQuestionTypeName = (type) => {
  switch (type) {
    case 1:
      return 'MCQ SINGLE CHOICE';
    case 2:
      return 'MCQ_MULTIPLE_CHOICE';
    case 3:
      return 'Match the Following';
    case 4:
      return 'Video Question';
    case 5:
      return 'PPT Question';
    case 6:
      return 'Matrix Questions';
    case 7:
      return 'Comprehension Questions';
    case 8:
      return 'True False';
    case 9:
      return 'Fill In The Blanks';
    case 10:
      return 'Descriptive';
    default:
      return '--';
  }
};

const ITEM_HEIGHT = 48;

const menuOptions = ['Remove'];

const { Option } = Select;

const Sections = ({
  question,
  section,
  questionId,
  onDelete,
  onDeleteQuestion,
  grade,
  erpCategory,
  questionPaperWise,
  deleteOneSection,
  isEdit
}) => {
  let history = useHistory();

  const themeContext = useTheme();
  const [Diaopen, setdiaOpen] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const [isOptionalQues, setisOptionalQues] = useState(false);
  const [deleteSection , setDeleteSection] = useState(false)
  const [sectionId , setSectionId] = useState()
  const [quesId , setQuestionId] = useState()


  const handleDeleteSectionclose = () => {
    setQuestionId(null);
    setSectionId(null);
    setDeleteSection(false);
  };

  const handledeleteSectionpopup = (qid , secid) => {
    setQuestionId(qid);
    setSectionId(secid);
    setDeleteSection(true);
  };

  const DeleteSection = () => {
    deleteOneSection(quesId, sectionId)
    setQuestionId(null);
    setSectionId(null);
    setDeleteSection(false);
  }
  // const sectionMarks = section?.test_marks?.forEach((item) => {
  //       marks += parseInt(item?.question_mark[0])
  // } )

  const getMarks = () => {
    let marks = 0;
    for (let i = 0; i < section?.mandatory_questions; i++) {
      marks += parseFloat(section?.test_marks[i]?.question_mark[0]);
    }
    if(section?.questions?.length > 0){
      return marks;
    }else return 0;
  };
  useEffect(() => {
    if(!isEdit && section){
      handleOptionalQuestion(section?.questions?.length, '');
    }else if(isEdit && section){
        if(section?.questions?.length < section?.mandatory_questions){
          handleOptionalQuestion(section?.questions?.length, '');
        }
    }
  }, [section?.questions?.length]);

  const handleAddQuestion = () => {
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const handleOptionalQuestion = (e, value) => {
    dispatch(addOptionalQuestion(e, questionId, section?.name));
  };

  const mandtorydropdown = () => {
    let arr = [];
    for (let i = 1; i <= section?.questions?.length; i++) {
      arr.push(i);
    }
    return arr;
  };
  const Mandetary_question = mandtorydropdown();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const DiaClickOpen = () => {
    setdiaOpen(true);
  };

  const DiaClose = () => {
    setdiaOpen(false);
  };

  const handleDelete = () => {
    setDeleteAlert(true);
  };
  const handleDeleteConfirm = () => {
    setDeleteAlert(false);
    onDelete(questionId, section.id);
  };
  const handleDeleteQuestion = (q, v) => {
    handleMenuClose();
    onDeleteQuestion(q?.id, section);
    message.success('Question Deleted')
  };
  const handleDeleteCancel = () => {
    setDeleteAlert(false);
  };

  function extractContent(s) {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  console.log(section, '@@');

  const isoptionalQues = (e) => {
    setisOptionalQues(e.target.checked);
  };

  return (
    <>
      <div className='row col-md-12 mt-3'>
        <div className='th-fw-900 col-md-7'>Section {section?.name}</div>
        <div className='d-flex align-items-center col-md-5'>
          <div className='d-flex col-md-7'>
            <div>Total Questions Added</div>
            <div className='col-md-4'>
              {/* <Input style={{ width: '3rem', height: '1.5rem' }} /> */}
              {section?.questions?.length}
            </div>
          </div>
          {!questionPaperWise && (
            <div className='d-flex col-md-5'>
              Total Marks Added
              <div className='col-md-4'>
                {/* <Input style={{ width: '3rem', height: '1.5rem' }} /> */}
                {getMarks()}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className='row mx-5 mt-4'
        style={{ border: '4px solid #e8e8e9', borderRadius: '6px' }}
      >
        <div className='row mx-4 mt-2'>
          <span className='th-fw-600'>Instructions</span>
          <TextArea
            placeholder='Enter Instruction'
            rows={4}
            maxLength={250}
            className='mt-2'
            value={section?.instruction}
            style={{ height: '60px', background: '#f0f4fb' }}
            onChange={(e) =>
              dispatch(addInstructionToSection(questionId, section?.name, e.target.value))
            }
          />
        </div>
        <hr />
        {/* {section?.questions.map((ques) => ( */}
        {section?.questions?.map((ques, i) => (
          <QuestionCard
            ques={ques}
            index={i}
            handleDeleteQuestion={handleDeleteQuestion}
            testMark={section?.test_marks}
            questionPaperWise={questionPaperWise}
          />
        ))}
        <div>
          <hr />
        </div>
        <div className='row justify-content-end my-3'>
          <div className='col-md-2 pl-0 mr-2'>
            <Button className='w-100 th-button' onClick={handleAddQuestion}>
              Add Question
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div className=' row justify-content-end'>
        <div
          className='mr-3 d-flex my-2 align-items-center p-1'
          style={{ border: '1px solid #e8e8e9' }}
        >
          <Checkbox
            className='ml-2'
            style={{ color: '#2ecf87' }}
            onChange={isoptionalQues}
          >
            Set for Mandatory Questions
          </Checkbox>
          <div className='d-flex mr-1'>{section?.questions?.length}/</div>
          <Select
            allowClear
            placeholder='Topic'
            showSearch
            disabled={!isOptionalQues}
            value={section?.mandatory_questions}
            // disabled={user_level == 13}
            filterOption={(input, options) => {
              return options.children;
            }}
            optionFilterProp='children'
            getPopupContainer={(trigger) => trigger.parentNode}
            onChange={(e, value) => {
              handleOptionalQuestion(e, value);
            }}
          >
            {Mandetary_question?.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', marginRight: '1%', alignItems: 'center' }}>
          <DeleteFilled
            style={{ color: 'blue', fontSize: 'large' }}
            // onClick={() => deleteOneSection(questionId, section?.id)}
            onClick={() => handledeleteSectionpopup(questionId, section?.id)}
          />
        </div>
      </div>

      {drawerOpen && (
        <QuestionBankDrawer
          grade={grade}
          erpCategory={erpCategory}
          onClose={onClose}
          drawerOpen={drawerOpen}
          section={section}
          questionId={questionId}
          questionPaperWise={questionPaperWise}
        />
      )}

      <Dialog open={deleteSection} onClose={handleDeleteSectionclose}>
        <DialogTitle id='draggable-dialog-title'>Delete Section</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSectionclose} className='labelColor cancelButton'>
            Cancel
          </Button>
          <Button
            type='primary'
            variant='contained'
            onClick={DeleteSection}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sections;
