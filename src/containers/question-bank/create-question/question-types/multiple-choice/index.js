import React, { useContext, useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  IconButton,
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
import axios from 'axios';

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
          { answer, question: editQuestion, options, matchingOptions, matrixOptions },
        ],
      } = editData;
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

  const handleCancel = () => {
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
    if (editData?.id) {
      history.push('/question-bank');
    }
  };

  const handleOptionData = (e, index) => {
    let name = e.target.name;
    let value;
    const list = [...optionsList];

    if (name === 'isChecked') {
      value = e.target.checked;
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
      value = e.target.value;
      list[index][name] = value;
    } else if (name === 'images' && !showQuestionType?.TrueFalse) {
      if (list[index][name]?.length < 2) {
        const file = e.target.files;
        if (
          file &&
          file[0] &&
          (file[0]?.name.lastIndexOf('.jpg') > 0 ||
            file[0]?.name.lastIndexOf('.jpeg') > 0 ||
            file[0]?.name.lastIndexOf('.png') > 0)
        ) {
          setLoading(true);
          const formData = new FormData();
          formData.append('file', file[0]);
          formData.append('grade_id', filterDataTop?.grade?.grade_id);
          formData.append('subject_name', filterDataTop?.subject?.subject_id);
          formData.append('question_categories_id', filterDataBottom.category?.id);
          formData.append('question_type', filterDataBottom.type?.id);
          axiosInstance
            .post(`${endpoints.assessmentErp.fileUpload}`, formData)
            .then((result) => {
              if (result.data.status_code === 200) {
                list[index][name].push(result.data.result);
                setLoading(false);
                setAlert('success', result.data.message);
              } else {
                setLoading(false);
                setAlert('error', result.data.message);
              }
            })
            .catch((error) => {
              setLoading(false);
            });
        } else {
          setAlert('error', 'Only .jpg, .jpeg, .png format is acceptable');
        }
      } else {
        setAlert('error', "Can't upload more than 2 images for one option");
      }
    }
    setOptionsList(list);
  };

  const handleMatchingOptionData = (e, index) => {
    let name = e.target.name;
    let value;
    let list = [...matchingOptionsList];
    if (name === 'optionValue') {
      value = e.target.value;
      list[index][name] = value;
    } else if (name === 'images') {
      if (list[index][name]?.length < 1) {
        const file = e.target.files;
        if (
          file &&
          file[0] &&
          (file[0].name.lastIndexOf('.jpg') > 0 ||
            file[0].name.lastIndexOf('.jpeg') > 0 ||
            file[0].name.lastIndexOf('.png') > 0)
        ) {
          setLoading(true);
          const formData = new FormData();
          formData.append('file', file[0]);
          formData.append('grade_name', filterDataTop.grade?.grade_name);
          formData.append('subject_name', filterDataTop.subject?.subject?.subject_name);
          formData.append('question_categories', filterDataBottom.category.category);
          formData.append('question_type', filterDataBottom.type?.question_type);
          axios
            .post(`${endpoints.questionBank.uploadFile}`, formData, {
              headers: { 'x-api-key': 'vikash@12345#1231' },
            })
            .then((result) => {
              if (result.data.status_code === 200) {
                list[index][name].push(result.data.result);
                setLoading(false);
                setAlert('success', result.data.message);
              } else {
                setLoading(false);
                setAlert('error', result.data.message);
              }
            })
            .catch((error) => {
              setLoading(false);
            });
        } else {
          setAlert('error', 'Only .jpg, .jpeg, .png format is acceptable');
        }
      } else {
        setAlert('error', "Can't upload more than 1 image for matching option");
      }
    }
    setMatchingOptionsList(list);
  };

  const handleDeleteImage = (rowIndex, imageIndex, isMatching) => {
    setLoading(true);
    const list = isMatching ? [...matchingOptionsList] : [...optionsList];
    axios
      .post(
        `${endpoints.questionBank.removeFile}`,
        {
          file_name: list[rowIndex]['images'][imageIndex],
        },
        {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        }
      )
      .then((result) => {
        if (result.data.status_code === 204) {
          if (isMatching) {
            list[rowIndex]['images'].splice(imageIndex, 1);
            setMatchingOptionsList(list);
          } else {
            list[rowIndex]['images'].splice(imageIndex, 1);
            setOptionsList(list);
          }
          setAlert('success', result.data.message);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
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

  //Call inside handleSave or handleSubmit
  const handleSendData = (isSubmit) => {
    let list = [...optionsList];
    let matchList = [];
    if (showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion)
      matchList = [...matchingOptionsList];

    //answers for fill in the blanks are the optionValues
    let answerList = [];
    if (showQuestionType?.FillInTheBlanks) {
      for (let k = 0; k < list?.length; k++) {
        answerList.push(list[k]['optionValue']);
      }
    }
    //Converting optionsList in the requested format
    let optionsData = [];
    for (let i = 0; i < list?.length; i++) {
      let obj = {};
      obj[`option${i + 1}`] = list[i];
      optionsData.push(obj);
    }
    let questionAndAnswer = [];
    if (showQuestionType?.Descriptive) {
      questionAndAnswer.push({
        answer: descriptiveAnswer,
        question: question,
      });
    } else if (showQuestionType?.MatchTheFollowing) {
      let questionAnswer = [];
      for (let k = 0; k < list?.length; k++) {
        questionAnswer.push({
          question: list[k]['optionValue'],
          answer: matchList[k]['optionValue'],
        });
      }
      questionAndAnswer.push({
        question: question,
        questionAnswer: questionAnswer,
        options: optionsList,
        matchingOptions: matchingOptionsList,
      });
    } else if (showQuestionType?.MatrixQuestion) {
      questionAndAnswer.push({
        question: question,
        options: optionsList,
        matrixOptions: matchingOptionsList,
      });
    } else {
      questionAndAnswer.push({
        answer: showQuestionType?.FillInTheBlanks ? answerList : answers,
        options: optionsData,
        question: question,
      });
    }

    let requestBody = {
      question_answer: questionAndAnswer,
      question_level: filterDataBottom.level?.id,
      question_categories: filterDataBottom.category.id,
      question_type: filterDataBottom.type.id,
      chapter: filterDataTop.chapter?.id,
      topic: filterDataTop.topic?.id,
      question_status: isSubmit ? 3 : 1,
    };

    if (!editData?.id)
      requestBody = {
        ...requestBody,
        academic_session: filterDataTop.academic?.id,
        is_central_chapter: filterDataTop.chapter?.is_central,
        grade: filterDataTop.grade?.grade_id,
        subject: filterDataTop.subject?.subject_id,
      };

    if (submitFlag || saveFlag) {
      let req = {
        question_answer: questionAndAnswer,
        question_type: showQuestionType?.id,
        question_level: filterDataBottom.level.id,
        question_categories: filterDataBottom.category.id,
        academic_session: filterDataTop.academic?.id,
        is_central_chapter: filterDataTop.chapter?.is_central,
        grade: filterDataTop.grade?.grade_id,
        subject: filterDataTop.subject?.subject_id,
        chapter: filterDataTop.chapter?.id,
        topic: filterDataTop.topic?.id,
        question_status: isSubmit ? 3 : 1,
      };

      if (editData?.id) req = { ...req, id: editData?.id };

      if (parentQuestionType?.ComprehensionQuestions) {
        subQuestions.push(req);
      } else if (parentQuestionType?.VideoQuestion) {
        req = { ...req, time_or_slide: showQuestionType?.time };
        subQuestions.push(req);
      }
    } else {
      if (editData?.id) {
        // const apiEndPoint = editData?'dasd':'post ur'
        // axiosInstance[editData?'put':'post'](apiEndPoint, requestBody).then((e)=>{
        // })
        axios
          .put(
            `${endpoints.baseURLCentral}/assessment/${editData?.id}/retrieve_update_question/`,
            requestBody,
            {
              headers: { 'x-api-key': 'vikash@12345#1231' },
            }
          )
          .then((result) => {
            if (result.data?.status_code === 200) {
              setAlert('success', result.data?.message);
              setEditData([]);
              history.push('/question-bank');
            } else {
              setAlert('error', result.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        axiosInstance
          .post(`${endpoints.assessmentErp.createQuestion}`, requestBody)
          .then((result) => {
            if (result.data.status_code === 200) {
              setAlert('success', result.data?.message);
              history.push('/question-bank');
            } else {
              setAlert('error', result.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      }
      // } else {
      //   setAlert('error', 'Please choose the correct answer.');
      // }
    }
  };

  const handleSave = () => {
    if (question?.length > 0) {
      handleSendData(false);
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
    } else {
      setAlert('error', 'At least question is compulsory!');
    }
  };

  const handleSubmit = () => {
    if (question?.length > 0) {
      if (!showQuestionType.TrueFalse && !showQuestionType.Descriptive) {
        let j = 0;
        if (showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion) {
          for (j = 0; j < matchingOptionsList?.length; j++) {
            if (matchingOptionsList[j]['optionValue']?.length === 0) {
              setAlert(
                'error',
                `Value is required for ${
                  showQuestionType?.MatchTheFollowing ? 'Matching' : 'Matrix'
                } Option ${String.fromCharCode(j + 65)}`
              );
              break;
            }
          }
        }

        let i = 0;
        for (i = 0; i < optionsList?.length; i++) {
          if (optionsList[i]['optionValue']?.length === 0) {
            setAlert(
              'error',
              `Value is required for ${
                showQuestionType?.FillInTheBlanks ? 'Blank' : 'Option'
              } ${String.fromCharCode(i + 65)}`
            );
            break;
          }
        }

        const checkFlag =
          showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion
            ? i === optionsList?.length && j === matchingOptionsList?.length
            : i === optionsList?.length;

        if (checkFlag) {
          const answerCheckFlag =
            showQuestionType?.MultipleChoiceMultipleSelect ||
            showQuestionType?.MultipleChoiceSingleSelect
              ? // showQuestionType?.TrueFalse
                answers.length
              : true;
          if (answerCheckFlag) {
            handleSendData(true);
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
          } else {
            setAlert('error', `Answer is required!`);
          }
        } else {
          if (showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion) {
            for (let j = 0; j < matchingOptionsList?.length; j++) {
              if (matchingOptionsList[j]['optionValue']?.length === 0) {
                setAlert(
                  'error',
                  `Value is required for ${
                    showQuestionType?.MatchTheFollowing ? 'Matching' : 'Matrix'
                  } Option ${String.fromCharCode(j + 65)}`
                );
                break;
              }
            }
          }
          for (let i = 0; i < optionsList?.length; i++) {
            if (optionsList[i]['optionValue']?.length === 0) {
              setAlert(
                'error',
                `Value is required for ${
                  showQuestionType?.FillInTheBlanks ? 'Blank' : 'Option'
                } ${String.fromCharCode(i + 65)}`
              );
              break;
            }
          }
        }
      } else if (showQuestionType.Descriptive) {
        if (descriptiveAnswer.length > 0) {
          handleSendData(true);
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
        } else {
          setAlert('error', 'Answer is required!');
        }
      } else if (showQuestionType.TrueFalse) {
        if (answers.length) {
          handleSendData(true);
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
        } else {
          setAlert('error', 'Select either True or False');
        }
      }
    } else {
      setAlert('error', 'Question is compulsory!');
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
      <div className='questionHeaderContainer'>
        <div className='questionTag'>
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
                <div className='tooltiptext'>
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
                      className='modifyDesign'
                      size='small'
                      onClick={() => setOpenEditor(true)}
                    >
                      {isMobile ? 'Format' : 'Format Text'}
                    </Button>
                    <IconButton>
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
                    </IconButton>
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
          <div className='answerTag'>
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
                    className='modifyDesign addAnotherButton'
                    title='Add another option'
                    variant='contained'
                    size='medium'
                    startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    disableTouchRipple
                    style={{ textTransform: 'none' }}
                    onClick={handleAddOption}
                  >
                    Add another option
                  </Button>
                </div>
              )}
            </div>
          )}
          {(showQuestionType?.MatchTheFollowing || showQuestionType?.MatrixQuestion) && (
            <div className='matchingOptionsWrapper'>
              <div className='matchingAnswerTag'>
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
                          ? 'modifyDesign addAnotherMatchButton'
                          : 'modifyDesign addAnotherMatrixButton'
                      }
                      title='Add New'
                      variant='contained'
                      size='medium'
                      startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                      disableRipple
                      disableElevation
                      disableFocusRipple
                      disableTouchRipple
                      style={{ textTransform: 'none' }}
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
                      style={{ textTransform: 'none' }}
                      className='custom_button_master modifyDesign cancelButtonLabel'
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
                      className='custom_button_master modifyDesign saveAsDraftButton'
                      size='medium'
                      style={{ textTransform: 'none' }}
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
                      style={{ color: 'white', textTransform: 'none' }}
                      color='primary'
                      className='custom_button_master modifyDesign'
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
