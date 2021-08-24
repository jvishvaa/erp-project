import React from 'react';
import { TextField, Button, SvgIcon, IconButton, Checkbox } from '@material-ui/core';
import endpoints from '../../../../../../config/endpoints';
import CancelIcon from '@material-ui/icons/Cancel';
import checkedicon from '../../../../../../assets/images/checkedicon.svg';
import uncheckedicon from '../../../../../../assets/images/uncheckedicon.svg';
import deleteicon from '../../../../../../assets/images/deleteicon.svg';
import attachmentIcon from '../../../../../../assets/images/attachmenticon.svg';
import deletematch from '../../../../../../assets/images/deletematch.svg';
import './single-option.css';
import axios from 'axios';
import placeholder from '../../../../../../assets/images/placeholder_small.jpg';

const SingleOption = ({
  option,
  index,
  handleDeleteOption,
  handleOptionData,
  showQuestionType,
  isMatching,
  handleMatchingOptionData,
  handleDeleteImage,
}) => {
  return (
    <>
      <div
        className={
          showQuestionType?.TrueFalse
            ? 'trueFalseOptionBox'
            : isMatching
            ? showQuestionType?.MatrixQuestion
              ? 'matrixOptionBox'
              : 'matchingOptionBox'
            : 'optionBox'
        }
      >
        {!isMatching && (
          <div className='checkboxContainer'>
            {!(
              showQuestionType?.FillInTheBlanks ||
              showQuestionType?.MatrixQuestion ||
              showQuestionType?.MatchTheFollowing
            ) && (
              <Checkbox
                id={`is_checked${index}`}
                checked={option?.isChecked}
                icon={
                  <SvgIcon
                    component={() => (
                      <img
                        style={{ height: '22px', width: '22px' }}
                        src={uncheckedicon}
                      />
                    )}
                  />
                }
                checkedIcon={
                  <SvgIcon
                    component={() => (
                      <img style={{ height: '22px', width: '22px' }} src={checkedicon} />
                    )}
                  />
                }
                onChange={(e) => {
                  handleOptionData(e, index);
                }}
                name='isChecked'
              />
            )}
          </div>
        )}
        {isMatching ? (
          <div className='matchTheFollowingIndex'>{String.fromCharCode(index + 65)}</div>
        ) : (
          <div
            className={showQuestionType?.TrueFalse ? 'trueFalseOptionTag' : 'optionTag'}
          >
            {showQuestionType?.TrueFalse ? (
              <div>{index === 0 ? 'True' : 'False'}</div>
            ) : (
              <div>
                {showQuestionType?.FillInTheBlanks ? 'Blank' : 'Option'}{' '}
                {String.fromCharCode(index + 65)}
              </div>
            )}
            {option?.isChecked && <div className='correctOptionTag'>Correct Option</div>}
          </div>
        )}

        {!showQuestionType?.TrueFalse && (
          <>
            <div
              className={
                isMatching
                  ? showQuestionType.MatchTheFollowing
                    ? 'matchingOptionInput'
                    : 'matrixOptionInput'
                  : 'optionInput'
              }
            >
              <TextField
                style={{ width: '100%' }}
                id={`option_value${index}`}
                variant='outlined'
                size='small'
                placeholder={
                  isMatching
                    ? showQuestionType?.MatchTheFollowing
                      ? 'Type the matching option here'
                      : 'Type here'
                    : 'Type the option here'
                }
                className={
                  isMatching
                    ? showQuestionType?.MatchTheFollowing
                      ? 'dropdownIcon matchingAnswerBox'
                      : 'dropdownIcon matrixAnswerBox'
                    : 'dropdownIcon answerBox'
                }
                onChange={(e) => {
                  isMatching
                    ? handleMatchingOptionData(e, index)
                    : handleOptionData(e, index);
                }}
                value={option?.optionValue}
                name='optionValue'
                inputProps={{
                  autoComplete: 'off',
                }}
              />
            </div>
            {(!isMatching || (isMatching && showQuestionType?.MatchTheFollowing)) && (
              <div className='optionImageContainer'>
                {option?.images?.map((image, i) => (
                  <div className='optionImageThumbnailContainer'>
                    <div className='optionImageThumbnail'>
                      <img
                        src={`${endpoints.assessmentErp.s3}/${image}`}
                        alt='Not found'
                        className='optionImageAttachment'
                        onError={(e) => {
                          e.target.src = placeholder;
                        }}
                      />
                    </div>
                    <div className='optionImageRemoveIcon'>
                      <IconButton onClick={() => handleDeleteImage(index, i, isMatching)}>
                        <CancelIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div
              className={
                isMatching ? 'attachmentIconContainer' : 'addImageButtonContainer'
              }
            >
              {isMatching && showQuestionType?.MatchTheFollowing ? (
                <IconButton component='label' className='attachmentIconMatching'>
                  <SvgIcon
                    component={() => (
                      <img
                        style={{ height: '22px', width: '22px' }}
                        src={attachmentIcon}
                      />
                    )}
                  />
                  <input
                    type='file'
                    name='images'
                    style={{ display: 'none' }}
                    id='raised-button-file1'
                    accept='image/*'
                    onChange={(e) => handleMatchingOptionData(e, index)}
                  />
                </IconButton>
              ) : (
                <>
                  {!isMatching && (
                    <Button
                      className='attachmentButton'
                      variant='contained'
                      style={{
                        color: 'white',
                      }}
                      color='primary'
                      title='Attach Image'
                      component='label'
                    >
                      <input
                        type='file'
                        name='images'
                        style={{ display: 'none' }}
                        id='raised-button-file2'
                        accept='image/*'
                        onChange={(e) => {
                          handleOptionData(e, index);
                        }}
                      />
                      Attach Image
                    </Button>
                  )}
                </>
              )}
              {!showQuestionType?.TrueFalse && (
                <IconButton
                  style={{
                    visibility:
                      (showQuestionType?.FillInTheBlanks ? index < 1 : index < 3) &&
                      'hidden',
                  }}
                  onClick={() => handleDeleteOption(index, isMatching)}
                  className={
                    isMatching
                      ? showQuestionType.MatrixQuestion
                        ? 'deleteMatrixIconContainer'
                        : 'deleteMatchingIconContainer'
                      : null
                  }
                >
                  <div>
                    <SvgIcon
                      component={() => (
                        <img
                          style={
                            isMatching
                              ? showQuestionType.MatrixQuestion
                                ? { height: '15px', width: '15px' }
                                : { height: '20px', width: '20px' }
                              : { height: '20px', width: '15px' }
                          }
                          src={isMatching ? deletematch : deleteicon}
                        />
                      )}
                    />
                  </div>
                </IconButton>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SingleOption;
