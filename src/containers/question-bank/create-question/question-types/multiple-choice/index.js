import React, { useContext, useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  IconButton,
  Typography,
  makeStyles
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import infoicon from '../../../../../assets/images/infoicon.svg';
import clockicon from '../../../../../assets/images/clockicon.svg';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import SingleOption from './single-option';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './multiple-choice.css';
import MyTinyEditor from '../../tinymce-editor';

const useStyles = makeStyles((theme)=> ({
  questionTag:{
    color: theme.palette.secondary.main,
    fontSize: "16px",
    fontWeight: 600,
  },
  questionHeaderContainer:{
    display: "flex",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: "7px",
  borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
  answerTag:{
    color:theme.palette.secondary.main,
  fontSize: "16px",
  fontWeight: 600,
  width: "100%",
  paddingBottom: "7px",
  borderBottom: `1px solid ${theme.palette.secondary.main}`,
  marginBottom: "10px",
  },
  tooltiptext : theme.toolTipText
}))

const MultipleChoice = ({
  editData,
  setEditData,
  filterDataTop,
  filterDataBottom,
  showQuestionType,
  setShowQuestionType,
  setIsQuestionFilterOpen,
  setIsCreateManuallyOpen,
  comprehensionQuestions,
  setComprehensionQuestions,
  index,
  submitFlag,
  saveFlag,
  subQuestions,
  parentQuestionType,
  setLoading,
}) => {
  const themeContext = useTheme();
  const classes = useStyles()
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [question, setQuestion] = useState('');
  const [questionDisplay, setQuestionDisplay] = useState('');
  const [openEditor, setOpenEditor] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [descriptiveAnswer, setDescriptiveAnswer] = useState('');
  const [optionsList, setOptionsList] = useState(
    showQuestionType?.FillInTheBlanks
      ? [{ optionValue: '', images: [] }]
      : showQuestionType?.MatrixQuestion || showQuestionType?.MatchTheFollowing
      ? [
          { optionValue: '', images: [] },
          { optionValue: '', images: [] },
          { optionValue: '', images: [] },
        ]
      : showQuestionType?.MultipleChoiceMultipleSelect ||
        showQuestionType?.MultipleChoiceSingleSelect
      ? [
          { isChecked: false, optionValue: '', images: [] },
          { isChecked: false, optionValue: '', images: [] },
          { isChecked: false, optionValue: '', images: [] },
        ]
      : showQuestionType?.TrueFalse
      ? [{ isChecked: false }, { isChecked: false }]
      : []
  );

  const [matchingOptionsList, setMatchingOptionsList] = useState(
    showQuestionType?.MatchTheFollowing
      ? [
          { optionValue: '', images: [] },
          { optionValue: '', images: [] },
          { optionValue: '', images: [] },
        ]
      : showQuestionType?.MatrixQuestion
      ? [{ optionValue: '' }, { optionValue: '' }, { optionValue: '' }]
      : []
  );

  useEffect(() => {
    setToggle((prev) => !prev);
    if (editData?.id) {
      const {
        question_answer: [
          {
            answer = '',
            question: editQuestion = '',
            options = [],
            matchingOptions = [],
            matrixOptions = [],
          },
        ],
      } = editData || {};
      setQuestion(editQuestion);
      setAnswers(answer);
      if (showQuestionType?.Descriptive) {
        setDescriptiveAnswer(answer || '');
      }
      if (
        showQuestionType?.MultipleChoiceMultipleSelect ||
        showQuestionType?.MultipleChoiceSingleSelect ||
        showQuestionType?.TrueFalse ||
        showQuestionType?.FillInTheBlanks
      ) {
        setOptionsList(options?.map((obj, i) => obj[`option${i + 1}`]));
        setMatchingOptionsList(matchingOptions?.map((obj, i) => obj[`option${i + 1}`]));
      } else if (showQuestionType?.MatrixQuestion) {
        setOptionsList(options);
        setMatchingOptionsList(matrixOptions);
      } else if (showQuestionType?.MatchTheFollowing) {
        setOptionsList(options);
        setMatchingOptionsList(matchingOptions);
      }
    }
  }, []);

  const handleSetDefault = () => {
    const list = { ...showQuestionType };
    for (let key in list) {
      if (list[key]) {
        list[key] = false;
        break;
      }
    }
    setShowQuestionType(list);
    setIsQuestionFilterOpen(true);
    setIsCreateManuallyOpen(false);
  };

  const handleCancel = () => {
    handleSetDefault();
    if (editData?.id) {
      history.push('/question-bank');
    }
  };

  const handleFileUpload = (list, file, name, index) => {
    if (
      file &&
      file[0] &&
      (file[0].name.lastIndexOf('.jpg') > 0 ||
        file[0].name.lastIndexOf('.jpeg') > 0 ||
        file[0].name.lastIndexOf('.png') > 0)
    ) {
      setLoading(true);
      const formData = new FormData();
      const payload = {
        file: file[0],
        grade_id: filterDataTop?.grade?.grade_id,
        subject_name: filterDataTop?.subject?.subject_id,
        question_categories_id: filterDataBottom?.category?.id,
        question_type: filterDataBottom?.type?.id,
      };
      Object.entries(payload).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      axiosInstance
        .post(`${endpoints.assessmentErp.fileUpload}`, formData)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            list[index][name].push(result?.data?.result);
            setLoading(false);
            setAlert('success', result?.data?.message);
          } else {
            setLoading(false);
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setAlert('error', 'Only .jpg, .jpeg, .png format is acceptable');
    }
  };

  const handleOptionData = (e, index) => {
    let name = e.target?.name;
    let value;
    const list = [...optionsList];

    if (name === 'isChecked') {
      value = e.target?.checked;
      list[index][name] = value;
      if (showQuestionType?.MultipleChoiceSingleSelect || showQuestionType?.TrueFalse) {
        for (let i = 0; i < list?.length; i++) {
          if (i != index) {
            list[i][name] = false;
          }
        }
        let answerList = [];
        if (value) {
          answerList.push(`option${index + 1}`);
        } else {
          answerList.splice(answerList.indexOf(`option${index + 1}`), 1);
        }
        setAnswers(answerList);
      } else if (showQuestionType?.MultipleChoiceMultipleSelect) {
        let answerList = [...answers];
        if (value) {
          answerList.push(`option${index + 1}`);
        } else {
          answerList.splice(answerList.indexOf(`option${index + 1}`), 1);
        }
        setAnswers([...new Set(answerList)]);
      }
    } else if (name === 'optionValue') {
      value = e.target?.value;
      list[index][name] = value;
    } else if (name === 'images' && !showQuestionType?.TrueFalse) {
      if (list[index][name]?.length < 2) {
        const file = e.target?.files;
        handleFileUpload([...optionsList], file, name, index);
      } else {
        setAlert('error', "Can't upload more than 2 images for one option");
      }
    }
    setOptionsList(list);
  };

  const handleMatchingOptionData = (e, index) => {
    let name = e.target?.name;
    let value;
    let list = [...matchingOptionsList];
    if (name === 'optionValue') {
      value = e.target?.value;
      list[index][name] = value;
    } else if (name === 'images') {
      if (list[index][name]?.length < 1) {
        const file = e.target?.files;
        handleFileUpload([...matchingOptionsList], file, name, index);
      } else {
        setAlert('error', "Can't upload more than 1 image for matching option");
      }
    }
    setMatchingOptionsList(list);
  };

  const handleDeleteImage = (rowIndex, imageIndex, isMatching) => {
    setLoading(true);
    const list = isMatching ? [...matchingOptionsList] : [...optionsList];
    axiosInstance
      .post(`${endpoints.assessmentErp.fileRemove}`, {
        file_name: list[rowIndex]['images'][imageIndex],
      })
      .then((result) => {
        if (result?.data?.status_code === 204) {
          list[rowIndex]['images'].splice(imageIndex, 1);
          if (isMatching) {
            setMatchingOptionsList(list);
          } else {
            setOptionsList(list);
          }
          setAlert('success', result?.data?.message);
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const handleAddOption = () => {
    if (optionsList?.length < 6) {
      if (
        showQuestionType?.FillInTheBlanks ||
        showQuestionType?.MatrixQuestion ||
        showQuestionType?.MatchTheFollowing
      ) {
        setOptionsList([...optionsList, { optionValue: '', images: [] }]);
        if (showQuestionType?.MatchTheFollowing) {
          setMatchingOptionsList([
            ...matchingOptionsList,
            { optionValue: '', images: [] },
          ]);
        }
      } else {
        setOptionsList([
          ...optionsList,
          { isChecked: false, optionValue: '', images: [] },
        ]);
      }
    }
  };

  //only for match the following & matrix question options
  const handleAddMatchingOption = () => {
    if (matchingOptionsList?.length < 6) {
      if (showQuestionType?.MatchTheFollowing) {
        setMatchingOptionsList([...matchingOptionsList, { optionValue: '', images: [] }]);
        setOptionsList([...optionsList, { optionValue: '', images: [] }]);
      } else {
        setMatchingOptionsList([...matchingOptionsList, { optionValue: '' }]);
      }
    }
  };

  const handleDeleteOption = (index, isMatching) => {
    if (isMatching) {
      const matchingList = [...matchingOptionsList];
      matchingList.splice(index, 1);
      setMatchingOptionsList(matchingList);
      if (showQuestionType?.MatchTheFollowing) {
        const list = [...optionsList];
        list.splice(index, 1);
        setOptionsList(list);
      }
    } else {
      const list = [...optionsList];
      list.splice(index, 1);
      setOptionsList(list);
      if (showQuestionType?.MatchTheFollowing) {
        const matchingList = [...matchingOptionsList];
        matchingList.splice(index, 1);
        setMatchingOptionsList(matchingList);
      }
      const answerList = [...answers];
      if (answerList?.length > 0) {
        for (let k = 0; k < answerList?.length; k++) {
          if (answerList[k] === `option${index + 1}`) {
            answerList.splice(k, 1);
            break;
          }
        }
        setAnswers(answerList);
      }
    }
  };

  const handleCallApi = (requestBody = {}) => {
    const api = editData?.id
      ? `/assessment/${editData?.id}/retrieve_update_question/`
      : endpoints.assessmentErp.createQuestion;
    axiosInstance[editData?.id ? 'put' : 'post'](api, requestBody)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setEditData([]);
          // history.push('/question-bank'); create-question
          history.push('/create-question');
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };

  const createDescriptiveQuestionAnswer = () => {
    return [
      {
        answer: descriptiveAnswer,
        question: question,
      },
    ];
  };

  const createMatchQuestionAnswer = () => {
    let questionAnswer = [];
    let list = [...optionsList];
    let matchList = [...matchingOptionsList];
    for (let k = 0; k < list?.length; k++) {
      questionAnswer.push({
        question: list[k]['optionValue'],
        answer: matchList[k]['optionValue'],
      });
    }
    return [
      {
        question: question,
        questionAnswer: questionAnswer,
        options: optionsList,
        matchingOptions: matchingOptionsList,
      },
    ];
  };

  const createMatrixQuestionAnswer = () => {
    return [
      {
        question: question,
        options: optionsList,
        matrixOptions: matchingOptionsList,
      },
    ];
  };

  const createOtherQuestionAnswer = () => {
    let list = [...optionsList];
    //Converting optionsList in the requested format as expected by backend
    let optionsData = [];
    for (let i = 0; i < list?.length; i++) {
      let obj = {};
      obj[`option${i + 1}`] = list[i];
      optionsData.push(obj);
    }
    //answers for fill in the blanks are the optionValues
    let answerList = [];
    if (showQuestionType?.FillInTheBlanks) {
      for (let k = 0; k < list?.length; k++) {
        answerList.push(list[k]['optionValue'].trim().toLowerCase());
      }
    }
    return [
      {
        answer: showQuestionType?.FillInTheBlanks ? answerList : answers,
        options: optionsData,
        question: question,
      },
    ];
  };

  const createQuestionAnswer = () => {
    if (showQuestionType?.Descriptive) {
      return createDescriptiveQuestionAnswer();
    }
    if (showQuestionType?.MatchTheFollowing) {
      return createMatchQuestionAnswer();
    }
    if (showQuestionType?.MatrixQuestion) {
      return createMatrixQuestionAnswer();
    }
    if (
      showQuestionType?.FillInTheBlanks ||
      showQuestionType?.MultipleChoiceSingleSelect ||
      showQuestionType?.MultipleChoiceMultipleSelect ||
      showQuestionType?.TrueFalse
    ) {
      return createOtherQuestionAnswer();
    }
  };

  const generateCommonRequestBody = () => {
    return {
      question_level: filterDataBottom?.level?.id,
      question_categories: filterDataBottom?.category?.id,
      academic_session: filterDataTop?.branch?.id,
      is_central_chapter: filterDataTop?.chapter?.is_central,
      grade: filterDataTop?.grade?.grade_id,
      subject: filterDataTop?.subject?.subject_id,
      chapter: filterDataTop?.chapter?.id,
      topic: filterDataTop?.topic?.id,
    };
  };

  //Only for comprehension/video/ppt question
  const createSubQuestionRequest = (questionAndAnswer = [], isSubmit) => {
    let req = {
      question_answer: questionAndAnswer,
      question_status: isSubmit ? 3 : 1,
      question_type: showQuestionType?.id,
      ...generateCommonRequestBody(),
    };

    //On edit of comprehension question just question id is added for all sub questions
    if (editData?.id) req = { ...req, id: editData?.id };

    if (parentQuestionType?.ComprehensionQuestions) {
      subQuestions.push(req);
    }
    if (parentQuestionType?.VideoQuestion) {
      req = { ...req, time_or_slide: showQuestionType?.time };
      subQuestions.push(req);
    }
  };

  //Not for comprehension/video/ppt question
  const generateRequestForQuestion = (questionAndAnswer = [], isSubmit) => {
    //Only for edit
    let requestBody = {
      question_answer: questionAndAnswer,
      question_status: isSubmit ? 3 : 1,
    };
    //Only for creation
    if (!editData?.id)
      requestBody = {
        question_type: filterDataBottom?.type?.id,
        ...requestBody,
        ...generateCommonRequestBody(),
      };
    return requestBody;
  };

  //Call inside handleSave or handleSubmit
  const handleSendData = (isSubmit) => {
    let questionAndAnswer = createQuestionAnswer();
    if (submitFlag || saveFlag) {
      //Below req is for sub questions of comprehension/video question
      createSubQuestionRequest(questionAndAnswer, isSubmit);
    } else {
      let requestBody = generateRequestForQuestion(questionAndAnswer, isSubmit);
      //Following API call is for questions other than comprehension/video
      handleCallApi(requestBody);
    }
  };

  const handleSave = () => {
    if (!question) {
      setAlert('error', 'At least question is compulsory!');
      return;
    }
    handleSendData(false);
    handleSetDefault();
  };

  const handleErrorMessage = (i, isMatchingOption) => {
    return isMatchingOption
      ? showQuestionType?.MatrixQuestion
        ? `Value is required for Matrix Option ${String.fromCharCode(i + 65)}`
        : `Value or Image is required for Matching Option ${String.fromCharCode(i + 65)}`
      : `Value or Image is required for ${
          showQuestionType?.FillInTheBlanks ? 'Blank' : 'Option'
        } ${String.fromCharCode(i + 65)}`;
  };

  const handleValidateOptions = (list, isMatchingOption) => {
    for (let i = 0; i < list?.length; i++) {
      let validateOption =
        isMatchingOption && showQuestionType?.MatrixQuestion
          ? list[i]['optionValue'] === ''
          : list[i]['optionValue'] === '' && list[i]['images']?.length === 0;
      if (validateOption) {
        setAlert('error', handleErrorMessage(i, isMatchingOption));
        return false;
      }
    }
    return true;
  };

  const handleCheckAnswerFlag = () => {
    return showQuestionType?.MultipleChoiceMultipleSelect ||
      showQuestionType?.MultipleChoiceSingleSelect
      ? answers.length
      : true;
  };

  const handleSubmit = () => {
    if (!question) {
      setAlert('error', 'Question is compulsory!');
      return;
    }
    if (!showQuestionType.TrueFalse && !showQuestionType.Descriptive) {
      if (!handleValidateOptions([...optionsList], false)) return;
      if (showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion) {
        if (!handleValidateOptions([...matchingOptionsList], true)) return;
      }
      if (!handleCheckAnswerFlag()) {
        setAlert('error', `Answer is required!`);
        return;
      }
      handleSendData(true);
      handleSetDefault();
    }
    if (showQuestionType.Descriptive) {
      if (descriptiveAnswer.length > 0) {
        handleSendData(true);
        handleSetDefault();
      } else {
        setAlert('error', 'Answer is required!');
      }
    }
    if (showQuestionType.TrueFalse) {
      if (answers.length) {
        handleSendData(true);
        handleSetDefault();
      } else {
        setAlert('error', 'Select either True or False');
      }
    }
  };

  const handleEditorChange = (content, editor) => {
    if (showQuestionType?.Descriptive && editor?.id?.includes('answerEditor')) {
      setDescriptiveAnswer(content);
    } else if (editor?.id?.startsWith('questionEditor')) {
      setQuestion(content);
      setQuestionDisplay(editor?.getContent({ format: 'text' }));
    }
  };

  /*Here we are not actually deleting the question instead setting the 'is_delete' flag as true
  which is present in every object of comprehensionQuestions state */
  const handleDeleteComprehensionQuestion = (index) => {
    const list = [...comprehensionQuestions];
    list[index]['is_delete'] = true;
    /*This count is used for displaying question index and is being reduced by 1 for all the objects
    after the current index*/
    for (let i = index + 1; i < list?.length; i++) {
      list[i]['count'] -= 1;
    }
    setComprehensionQuestions(list);
    handleMenuClose();
  };

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuOpen = () => {
    setShowMenu(true);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    if (submitFlag) {
      handleSendData(true);
    }
    if (saveFlag) {
      handleSendData(false);
    }
  }, [saveFlag, submitFlag]);

  return (
    <div
      className={
        parentQuestionType?.ComprehensionQuestions || parentQuestionType?.VideoQuestion
          ? 'compMultipleChoiceContainer'
          : 'multipleChoiceContainer'
      }
    >
      <div className={classes.questionHeaderContainer}>
        <div className={classes.questionTag}>
          {parentQuestionType?.ComprehensionQuestions || parentQuestionType?.VideoQuestion
            ? `Question ${[...comprehensionQuestions][index]['count']}`
            : 'Question'}
        </div>
        {parentQuestionType?.VideoQuestion && ( //Flag used for comprehension, video, ppt
          <div className='questionCreationTime'>
            <div className='clockIconContainer'>
              <SvgIcon
                component={() => (
                  <img style={{ height: '24px', width: '24px' }} src={clockicon} />
                )}
              />
            </div>
            <div className='timeContainer'>
              {(() => {
                const { time } = showQuestionType || {};
                if (time) {
                  return new Date(showQuestionType?.time * 1000)
                    .toISOString()
                    .slice(11, 19);
                } else {
                  return '- -';
                }
              })()}
            </div>
          </div>
        )}
        {(parentQuestionType?.ComprehensionQuestions ||
          parentQuestionType?.VideoQuestion) && (
          <div
            className='questionHeaderIcon'
            onClick={handleMenuOpen}
            onMouseLeave={handleMenuClose}
          >
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            {showMenu ? (
              <div className='tooltipContainer'>
                <div className = {` ${classes.tooltiptext} tooltiptext `}>
                  <div onClick={() => handleDeleteComprehensionQuestion(index)}>
                    Delete
                  </div>
                  <div
                    onClick={() => {
                      setIsMinimized((prev) => !prev);
                    }}
                  >
                    {isMinimized ? 'Maximize' : 'Minimize'}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {toggle ? (
        <div className='questionContainer'>
          {openEditor && (
            <MyTinyEditor
              id={
                parentQuestionType?.ComprehensionQuestions ||
                parentQuestionType?.VideoQuestion
                  ? `questionEditor${index}`
                  : 'questionEditor'
              }
              content={question}
              handleEditorChange={handleEditorChange}
              setOpenEditor={setOpenEditor}
              placeholder='Question goes here...'
              filterDataTop={filterDataTop}
              filterDataBottom={filterDataBottom}
            />
          )}
          {!openEditor && (
            <TextField
              style={{ width: '100%' }}
              id={
                parentQuestionType?.ComprehensionQuestions ||
                parentQuestionType?.VideoQuestion
                  ? `questionDisplay${index}`
                  : 'questionDisplay'
              }
              variant='outlined'
              size='small'
              className='dropdownIcon questionDisplay'
              placeholder='Click on format text to create a question'
              value={questionDisplay}
              name={
                parentQuestionType?.ComprehensionQuestions ||
                parentQuestionType?.VideoQuestion
                  ? `questionDisplay${index}`
                  : 'questionDisplay'
              }
              inputProps={{
                readOnly: true,
                autoComplete: 'off',
              }}
              InputProps={{
                endAdornment: (
                  <>
                    <div className='dividerVertical'></div>
                    <Button
                      variant='contained'
                      style={{
                        color: 'white',
                        textTransform: 'none',
                        width: '12%',
                        margin: '0px 0px 0px 15px',
                      }}
                      color='primary'
                      size='small'
                      onClick={() => setOpenEditor(true)}
                    >
                      {isMobile ? 'Format' : 'Format Text'}
                    </Button>
                    {/* <IconButton>
                      <div>
                        <SvgIcon
                          component={() => (
                            <img
                              style={{ height: '24px', width: '25px' }}
                              src={infoicon}
                            />
                          )}
                        />
                      </div>
                    </IconButton> */}
                  </>
                ),
              }}
            />
          )}
        </div>
      ) : (
        'hidden editor'
      )}
      {!isMinimized && (
        <>
          <div className={classes.answerTag}>
            {showQuestionType?.Descriptive || showQuestionType?.TrueFalse
              ? 'Answer'
              : 'Answers'}
          </div>
          {showQuestionType?.Descriptive ? (
            toggle ? (
              <div className='descriptiveAnswerEditor'>
                <MyTinyEditor
                  id={
                    parentQuestionType?.ComprehensionQuestions ||
                    parentQuestionType?.VideoQuestion
                      ? `answerEditor${index}`
                      : 'answerEditor'
                  }
                  className='answerEditor'
                  content={descriptiveAnswer}
                  handleEditorChange={handleEditorChange}
                  setOpenEditor={setOpenEditor}
                  placeholder='Answer goes here...'
                  filterDataTop={filterDataTop}
                  filterDataBottom={filterDataBottom}
                />
              </div>
            ) : null
          ) : (
            <div>
              <div
                className={
                  showQuestionType?.TrueFalse
                    ? 'truefalseOptionsContainer'
                    : 'optionsContainer'
                }
              >
                {optionsList?.map((option, index) => (
                  <SingleOption
                    setLoading={setLoading}
                    isMatching={false}
                    option={option}
                    index={index}
                    showQuestionType={showQuestionType}
                    handleDeleteOption={handleDeleteOption}
                    handleOptionData={handleOptionData}
                    handleDeleteImage={handleDeleteImage}
                  />
                ))}
              </div>
              {!showQuestionType?.TrueFalse && optionsList?.length < 6 && (
                <div>
                  <Button
                    className='addAnotherButton'
                    title='Add Another Option'
                    variant='contained'
                    size='medium'
                    startIcon={
                      <AddOutlinedIcon color='primary' style={{ fontSize: '30px' }} />
                    }
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    disableTouchRipple
                    style={{ width: '100%' }}
                    onClick={handleAddOption}
                  >
                    <Typography color='primary'>Add another option</Typography>
                  </Button>
                </div>
              )}
            </div>
          )}
          {(showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion) && (
            <div className='matchingOptionsWrapper'>
              <div className={classes.answerTag}>
                {showQuestionType.MatrixQuestion ? 'Matrix Options' : 'Matching Options'}
              </div>
              <div className='matchingOptionsContainer'>
                {matchingOptionsList?.map((option, index) => (
                  <SingleOption
                    setLoading={setLoading}
                    isMatching={true}
                    option={option}
                    index={index}
                    showQuestionType={showQuestionType}
                    handleDeleteOption={handleDeleteOption}
                    handleOptionData={handleOptionData}
                    handleMatchingOptionData={handleMatchingOptionData}
                    handleDeleteImage={handleDeleteImage}
                  />
                ))}
                <div
                  className={
                    showQuestionType?.MatchTheFollowing
                      ? 'addAnotherMatchingButtonWrapper'
                      : 'addAnotherMatrixButtonWrapper'
                  }
                >
                  {matchingOptionsList?.length < 6 && (
                    <Button
                      className={
                        showQuestionType?.MatchTheFollowing
                          ? 'addAnotherMatchButton'
                          : 'addAnotherMatrixButton'
                      }
                      title='Add New'
                      variant='contained'
                      size='medium'
                      startIcon={
                        <AddOutlinedIcon color='primary' style={{ fontSize: '30px' }} />
                      }
                      disableRipple
                      disableElevation
                      disableFocusRipple
                      disableTouchRipple
                      style={{ width: '100%' }}
                      onClick={handleAddMatchingOption}
                    >
                      Add New
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!parentQuestionType?.ComprehensionQuestions &&
            !parentQuestionType?.VideoQuestion && (
              <div className='buttonsAtBottomMCQ'>
                <Grid container spacing={isMobile ? 3 : 5}>
                  {isMobile && <Grid item xs={3} sm={0} />}
                  <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                    <Button
                      variant='contained'
                      style={{ width: '100%' }}
                      className=' cancelButton labelColor'
                      size='medium'
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={0} sm={6} />
                  {isMobile && <Grid item xs={3} sm={0} />}
                  <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                    <Button
                      variant='contained'
                      color='primary'
                      size='medium'
                      style={{
                        width: '100%',
                        border: '1px solid #ff6b6b',
                        background: 'white',
                      }}
                      onClick={handleSave}
                    >
                      Save as Draft
                    </Button>
                  </Grid>
                  {isMobile && <Grid item xs={3} sm={0} />}
                  {isMobile && <Grid item xs={3} sm={0} />}
                  <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                    <Button
                      variant='contained'
                      style={{ color: 'white', width: '100%' }}
                      color='primary'
                      size='medium'
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                  {isMobile && <Grid item xs={3} sm={0} />}
                </Grid>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default MultipleChoice;
