import React, { useState, useEffect } from 'react';
import styles from './questionView.style';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../../config/endpoints';
import { getArrayValues } from '../../../../utility-functions';
const QuestionView = ({ classes, question, showAns }) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));
  useEffect(() => {
    console.log({ question, showAns }, 'alllog QuestionView');
  });
  return (
    <>
      {Object.keys(question).length && question && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: question?.question_answer?.length
                ? question?.question_answer[0]?.question
                : null,
            }}
            style={{ marginLeft: '0%', fontSize: '13px' }}
            className={classes.generatedQuestionDiv}
          />
          {question?.question_answer[0]?.options?.length ? (
            <Typography
              className='font-size-12 font-weight-600'
              style={{ marginTop: '15px' }}
            >
              Options:
            </Typography>
          ) : null}
          {question?.question_answer[0]?.options?.length ? (
            <>
              {question?.question_answer?.length ? (
                <>
                  <Grid container spacing={1}>
                    {question?.question_answer[0]?.options?.map((eachOption, index) => {
                      return (
                        <>
                          <Grid container item md={6} sm={12} alignItems='center'>
                            <Grid item>
                              <Typography
                                className='font-size-12'
                                style={{
                                  marginRight: '5px',
                                }}
                              >
                                {' '}
                                {String.fromCharCode(65 + index)}.
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className='font-size-12 pr-6 text-align-justify'>
                                {eachOption[`option${index + 1}`]?.title
                                  ? eachOption[`option${index + 1}`]?.title
                                  : ![undefined, null]?.includes(
                                      eachOption[`option${index + 1}`]?.optionValue
                                    )
                                  ? typeof eachOption[`option${index + 1}`]
                                      ?.optionValue === 'string'
                                    ? eachOption[`option${index + 1}`]?.optionValue
                                    : eachOption[
                                        `option${index + 1}`
                                      ]?.optionValue.toString()
                                  : null}
                              </Typography>
                              {eachOption[`option${index + 1}`]?.images?.length
                                ? eachOption[`option${index + 1}`]?.images?.map(
                                    (eachImage, indexImage) => {
                                      return (
                                        <>
                                          <img
                                            src={endpoints.s3 + eachImage}
                                            alt='option image'
                                            height={150}
                                          />
                                        </>
                                      );
                                    }
                                  )
                                : null}
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </>
              ) : null}
            </>
          ) : null}
          {showAns && (
            <>
              <Typography
                className='font-size-12 font-weight-600'
                style={{ marginTop: '15px' }}
              >
                Answer:
              </Typography>
              {typeof question?.question_answer[0]?.answer === 'string' ? (
                <>
                  <div
                    style={{ fontSize: '13px' }}
                    dangerouslySetInnerHTML={{
                      __html: question?.question_answer?.length
                        ? question?.question_answer[0]?.answer
                        : null,
                    }}
                    className={classes.generatedQuestionDiv}
                  />
                </>
              ) : (
                <>
                  {question?.question_answer[0]?.answer?.map((eachAns, ansIndex) => {
                    return (
                      <>
                        {question?.question_answer[0]?.options?.map(
                          (eachOption, optionIndex) => {
                            return (
                              <>
                                {eachOption.hasOwnProperty(eachAns) ? (
                                  <Grid
                                    container
                                    item
                                    // xs={6}
                                    alignItems='center'
                                  >
                                    <Grid item>
                                      <Typography
                                        className='font-size-12'
                                        style={{
                                          marginRight: '5px',
                                        }}
                                      >
                                        {' '}
                                        {String.fromCharCode(65 + optionIndex)}.
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography className='font-size-12 pr-6 text-align-justify'>
                                        {eachOption[`option${optionIndex + 1}`]?.title
                                          ? eachOption[`option${optionIndex + 1}`]?.title
                                          : eachOption[`option${optionIndex + 1}`]
                                              ?.optionValue
                                          ? eachOption[`option${optionIndex + 1}`]
                                              ?.optionValue
                                          : null}
                                      </Typography>
                                      {eachOption[`option${optionIndex + 1}`]?.images
                                        ?.length
                                        ? eachOption[
                                            `option${optionIndex + 1}`
                                          ]?.images?.map((eachImage, indexImage) => {
                                            return (
                                              <>
                                                <img
                                                  src={endpoints.s3 + eachImage}
                                                  alt='option image'
                                                  height={150}
                                                />
                                              </>
                                            );
                                          })
                                        : null}
                                    </Grid>
                                  </Grid>
                                ) : null}
                              </>
                            );
                          }
                        )}
                      </>
                    );
                  })}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default withStyles(styles)(QuestionView);
