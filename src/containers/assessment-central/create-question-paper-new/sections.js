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
import { PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Checkbox, Drawer, Input, Select } from 'antd';
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


const Sections = ({ question, section, questionId, onDelete, onDeleteQuestion,grade,erpCategory,questionPaperWise }) => {
  let history = useHistory();

  const themeContext = useTheme();
  const [Diaopen, setdiaOpen] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  let marks = 0 
  const [ isOptionalQues , setisOptionalQues] = useState(false)
  const sectionMarks = section?.test_Marks.forEach((item) => {
        marks += parseInt(item?.question_mark[0])
  } )

  useEffect(() => {
    handleOptionalQuestion(section?.questions?.length,'')
  },[section?.questions?.length])

  const handleAddQuestion = () => {
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const handleOptionalQuestion = (e,value) => {
dispatch(addOptionalQuestion(e,questionId,section?.name))
  }


const mandtorydropdown = ()=> {
    let arr= []
    for(let i=1;i<=section?.questions?.length ; i++){
        arr.push(i)
    }
    return arr
}
const Mandetary_question = mandtorydropdown()


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
  };
  const handleDeleteCancel = () => {
    setDeleteAlert(false);
  };

  function extractContent(s) {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  console.log(section,'@@')

  const isoptionalQues = (e) => {
setisOptionalQues(e.target.checked)
  }

  return (
    // <div className='section-container'>
    //   <div className='section-header'>
    //     <div className='left'>
    //       <div className='checkbox'>
    //         <Checkbox
    //           checked={true}
    //           onChange={() => { }}
    //           inputProps={{ 'aria-label': 'primary checkbox' }}
    //           color='primary'
    //         />
    //       </div>
    //       <div className='section-name'>{section.name}</div>
    //     </div>
    //     <div className='right'>
    //       <Button
    //         style={{ color: 'white' }}
    //         color='primary'
    //         size='medium'
    //         variant='contained'
    //         onClick={() => {
    //           history.push(
    //             `/question-chapter-wise?question=${questionId}&section=${section.name
    //             }&isedit=${Number(location.pathname.slice(23))}`
    //           );
    //         }}
    //       >
    //         Add Question
    //       </Button>
    //       <IconButton onClick={handleMenuOpen}>
    //         <MoreVertIcon color='primary' />
    //       </IconButton>
    //       <Popover
    //         id=''
    //         open={menuOpen}
    //         anchorEl={anchorEl}
    //         onClose={handleMenuClose}
    //         anchorOrigin={{
    //           vertical: 'bottom',
    //           horizontal: 'center',
    //         }}
    //         transformOrigin={{
    //           vertical: 'top',
    //           horizontal: 'center',
    //         }}
    //         className='assesment-card-popup-menu'
    //         PaperProps={{
    //           style: {
    //             maxHeight: ITEM_HEIGHT * 4.5,
    //             width: '20ch',
    //             border: `1px solid ${themeContext.palette.primary.main}`,
    //             boxShadow: 0,
    //             '&::before': {
    //               content: '',
    //               position: 'absolute',
    //               right: '50%',
    //               top: '-6px',
    //               backgroundColor: '#ffffff',
    //               width: '10px',
    //               height: '10px',
    //               transform: 'rotate(45deg)',
    //               border: '1px solid #ff6b6b',
    //               borderBottom: 0,
    //               borderRight: 0,
    //               zIndex: 10,
    //             },
    //           },
    //         }}
    //       >
    //         {menuOptions.map((option) => (
    //           <MenuItem
    //             className='assesment-card-popup-menu-item'
    //             key={option}
    //             selected={option === 'Pyxis'}
    //             onClick={handleDelete}
    //             // onClick={DiaClickOpen}
    //             style={{
    //               color: themeContext.palette.primary.main,
    //             }}
    //           >
    //             {option}
    //           </MenuItem>
    //         ))}
    //         <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
    //           <DialogTitle id='draggable-dialog-title'>Delete Question</DialogTitle>
    //           <DialogContent>
    //             <DialogContentText>
    //               Are you sure you want to remove this section ?
    //             </DialogContentText>
    //           </DialogContent>
    //           <DialogActions>
    //             <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
    //               Cancel
    //             </Button>
    //             <Button
    //               color='primary'
    //               variant='contained'
    //               style={{ color: 'white' }}
    //               onClick={handleDeleteConfirm}
    //             >
    //               Confirm
    //             </Button>
    //           </DialogActions>
    //         </Dialog>
    //       </Popover>
    //     </div>
    //   </div>
    //   <div className='section-content'>
    //     <div>Total Questions: {section?.questions?.length}</div>
    //     {section?.questions.map((q, index) => (
    //       <div className='selected-question-card' key={index} style={{ width: '100%' }}>
    //         <div className='selected-question-card-header'>
    //           <div className='header-name'>
    //             {resolveQuestionTypeName(q.question_type)}
    //           </div>
    //           <div className='icon'>
    //             <IconButton onClick={handleMenuOpen}>
    //               <MoreHorizIcon color='primary' />
    //             </IconButton>
    //             <Popover
    //               id=''
    //               open={menuOpen}
    //               anchorEl={anchorEl}
    //               onClose={handleMenuClose}
    //               anchorOrigin={{
    //                 vertical: 'bottom',
    //                 horizontal: 'center',
    //               }}
    //               transformOrigin={{
    //                 vertical: 'top',
    //                 horizontal: 'center',
    //               }}
    //               className='assesment-card-popup-menu'
    //               PaperProps={{
    //                 style: {
    //                   maxHeight: ITEM_HEIGHT * 4.5,
    //                   width: '20ch',
    //                   border: `1px solid ${themeContext.palette.primary.main}`,
    //                   boxShadow: 0,
    //                   '&::before': {
    //                     content: '',
    //                     position: 'absolute',
    //                     right: '50%',
    //                     top: '-6px',
    //                     backgroundColor: '#ffffff',
    //                     width: '10px',
    //                     height: '10px',
    //                     transform: 'rotate(45deg)',
    //                     border: '1px solid #ff6b6b',
    //                     borderBottom: 0,
    //                     borderRight: 0,
    //                     zIndex: 10,
    //                   },
    //                 },
    //               }}
    //             >
    //               {menuOptions.map((option) => (
    //                 <MenuItem
    //                   className='assesment-card-popup-menu-item'
    //                   key={option}
    //                   selected={option === 'Pyxis'}
    //                   onClick={(e) => handleDeleteQuestion(q, index)}
    //                   style={{
    //                     color: themeContext.palette.primary.main,
    //                   }}
    //                 >
    //                   {option}
    //                 </MenuItem>
    //               ))}
    //             </Popover>
    //           </div>
    //         </div>
    //         {/* <div>Question : {ReactHtmlParser(q?.question_answer[0]?.question)}</div> */}
    //         <div style={{ display: 'flex' }}> Question : {extractContent(q?.question_answer[0]?.question)}
    //           <span style={{ marginLeft: '5px' }}>
    //             {q?.question_answer[0]?.question
    //               ?.split('"')
    //               .filter((str) => str.startsWith('https'))?.length > 0 && (
    //                 <a
    //                   onClick={() => {
    //                     openPreview({
    //                       currentAttachmentIndex: 0,
    //                       attachmentsArray: (() => {
    //                         let newArray = q?.question_answer[0]?.question?.split('"');
    //                         let filtered = newArray.filter((str) => str.startsWith('https'));
    //                         const images = filtered || {};
    //                         const attachmentsArray = [];
    //                         images.forEach((image) => {
    //                           const attachmentObj = {
    //                             src: image,
    //                             name: `${image}`.split('.').slice(0, -1).join('.'),
    //                             extension: `.${`${image}`.split('.').slice(-1)[0]}`,
    //                           };
    //                           attachmentsArray.push(attachmentObj);
    //                         });
    //                         return attachmentsArray;
    //                       })(),
    //                     });
    //                   }}
    //                 >
    //                   <SvgIcon
    //                     component={() => <VisibilityIcon style={{ cursor: 'pointer' }} />}
    //                   />
    //                 </a>
    //               )}
    //           </span>
    //         </div>
    //         <div className='content'>
    //           <div className='left'>
    //             <div style={{ fontWeight: 550, fontSize: '1rem' }}>Online</div>
    //             <div> {q.is_published ? 'Draft' : 'Published'}</div>
    //           </div>
    //           <div className='right'>
    //             <div className='created'>
    //               <div>Created on</div>
    //               <div style={{ fontWeight: 550, fontSize: '1rem' }}>
    //                 {`${moment(q.test_date).format('DD-MM-YYYY')}`}
    //               </div>
    //             </div>
    //             {/* <div>
    //               <Button variant='contained' color='primary'>
    //                 VIEW MORE
    //               </Button>
    //             </div> */}
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
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
          <div className='d-flex col-md-5'>
            Total Marks Added
            <div className='col-md-4'>
              {/* <Input style={{ width: '3rem', height: '1.5rem' }} /> */}
              {marks}
            </div>
          </div>
        </div>
      </div>
      <div className='row mx-5 mt-4' style={{ border: '4px solid #e8e8e9' ,borderRadius:'6px'}}>

        <div className='row mx-4 mt-2'>
          <span className='th-fw-600'>Instructions</span>
          <TextArea
            placeholder='Enter Instruction'
            rows={4}
            maxLength={250}
            className='mt-2'
            value={section?.instruction}
            style={{ height: '60px', background: '#f0f4fb' }}
            onChange = {(e) => dispatch(addInstructionToSection(questionId,section?.name ,e.target.value))} 
          />
        </div>
        <hr />
        {/* {section?.questions.map((ques) => ( */}
        {section?.questions?.map((ques, i) =>(
          <QuestionCard ques={ques} index={i} handleDeleteQuestion = {handleDeleteQuestion} testMark = {section?.test_Marks} questionPaperWise = {questionPaperWise}/>
        ))}
        <div>
          <hr />
        </div>
        <div className='row col-md-12 justify-content-end my-3'>
          <div className='col-md-3' style={{marginRight:'3%'}}>
            <Button className='w-100 th-button' onClick={handleAddQuestion}>
              Add Question from 'Question Bank'
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div className='mr-5 row justify-content-end'>
        <div className='d-flex my-2' style={{ border: '1px solid #e8e8e9' }}>
          <Checkbox className='ml-2' style={{ color: '#2ecf87' }} onChange={isoptionalQues}>
            Set for Optional Questions
          </Checkbox>
          <div className='d-flex'>
          {section?.questions?.length}/
          </div>
         <Select
         allowClear
         placeholder= 'Topic'
         showSearch
         disabled = {!isOptionalQues}
         value={section?.mandatory_questions}
         // disabled={user_level == 13}
         filterOption={(input, options) => {
            return (
              options.children
            );
          }}
         optionFilterProp='children'
         getPopupContainer={(trigger) => trigger.parentNode}
         onChange={(e,value) => {
            handleOptionalQuestion(e,value);
          }}
         >
            {Mandetary_question?.map((item) => (
                <Option key={item} value={item}>{item}</Option>
            ))}
        
         </Select>
        </div>
      </div>

      {drawerOpen && (
        <QuestionBankDrawer
          grade = {grade}
          erpCategory = {erpCategory}
          onClose={onClose}
          drawerOpen={drawerOpen}
          section={section}
          questionId={questionId}
          questionPaperWise={questionPaperWise}
        />
      )}
    </>
  );
};

export default Sections;
