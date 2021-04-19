import React, { useState, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, SvgIcon, IconButton } from '@material-ui/core';
import closeicon from '../../../../../../assets/images/Cancel-icon.svg';
import cuid from 'cuid';
import './comprehension-question-select.css';
import { AlertNotificationContext } from '../../../../../../context-api/alert-context/alert-state';

const ComprehensionModal = ({
  questionType,
  getCurrentVideoTime,
  showQuestionType,
  openModal,
  handleCloseModal,
  comprehensionQuestions,
  setComprehensionQuestions,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const handleAddQuestion = (index) => {
    const len = [...comprehensionQuestions]?.filter((obj) => !obj.is_delete)?.length;
    if (len < 10) {
      let key = Object.keys(questionType[index])[2];
      const obj = {};
      obj[key] = questionType[index][key];
      obj['id'] = questionType[index]['id'];
      obj['keyId'] = cuid();
      obj['is_delete'] = false;
      if (showQuestionType?.VideoQuestion) {
        obj['time'] = getCurrentVideoTime();
      }
      obj['count'] = len + 1;
      const list = [...comprehensionQuestions];
      list.push(obj);
      setComprehensionQuestions(list);
      handleCloseModal();
    } else {
      setAlert('error', "Can't add more than 10 question for one comprehension!");
    }
  };

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby='draggable-dialog-title'
      className='modalForComprehension'
    >
      <div className='closeIconInModal'>
        <IconButton onClick={handleCloseModal}>
          <div>
            <SvgIcon
              component={() => (
                <img style={{ height: '20px', width: '20px' }} src={closeicon} />
              )}
            />
          </div>
        </IconButton>
      </div>
      <DialogContent className='comprehensionModalContent'>
        <div className='modalButtonContainer'>
          {questionType.map((qtype, index) => (
            <div className='questionTypeBox'>
              <Button
                onClick={() => handleAddQuestion(index)}
                className='comprehensionModalButton'
              >
                {qtype.name}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensionModal;
