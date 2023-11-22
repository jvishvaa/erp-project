import React, { useEffect } from 'react';
import {
  Divider,
  Grid,
  Radio,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import styles from './style';
import OrchidsLogo from '../../../../assets/images/orchidsLogo1.png';
import moment from 'moment';
// import { getArrayValues } from '../../../../utility-functions';
import endpoints from '../../../../config/endpoints';
const QuestionPreview = ({
  classes,
  templateFrom,
  currentStep,
  isPrint,
  isQuestionPaper,
}) => {
  useEffect(() => {
    console.log(
      {
        templateFrom,
        currentStep,
        isPrint,
        isQuestionPaper,
      },
      'alllog question Perview'
    );
  });
  return (
    <div style={{ padding: isPrint === true ? '40px' : '' }}>
      <TableContainer style={{ backgroundColor: '#fff' }}>
        <Table size='small'>
          <TableRow className={classes.teblerow}>
            <TableCell
              colspan='2'
              rowspan='3'
              align='center'
              className={[classes.tablecell, classes.tablecellimage]}
            >
              <img src={OrchidsLogo} alt='OrchidsLogo' className={classes.tablelogo} />
            </TableCell>
            <TableCell colspan='2' className={classes.tablecell}>
              <b>Name</b>
            </TableCell>
            <TableCell colspan='2' className={classes.tablecell}></TableCell>
          </TableRow>
          <TableRow className={classes.teblerow}>
            <TableCell colspan='2' className={classes.tablecell}>
              <b>Erp</b>
            </TableCell>
            <TableCell colspan='2' className={classes.tablecell}></TableCell>
          </TableRow>
          <TableRow className={classes.teblerow}>
            <TableCell colspan='2' className={classes.tablecell}>
              <b>Section</b>
            </TableCell>
            <TableCell colspan='2' className={classes.tablecell}></TableCell>
          </TableRow>
          {/* <TableRow className={[classes.teblerow, classes.backgroundlightgray]}>
            <TableCell colspan='6' align='center' className={classes.tablecell}>
              <b>
                {typeof templateFrom?.volume === 'object'
                  ? templateFrom?.volume?.map((vol) => vol.volume_name)?.join(', ')
                  : ''}
                {' - '}
                {typeof templateFrom?.chapter === 'object'
                  ? templateFrom?.chapter?.map((each) => each?.chapter_name)?.join(',')
                  : ''}
              </b>
            </TableCell>
          </TableRow> */}
          {/* <TableRow className={classes.teblerow}>
                        <TableCell colspan='6' align='center' className={classes.tablecell}>
                            <b>weekly test {templateFrom?.academic_year?.session_year}</b>
                        </TableCell>
                    </TableRow> */}
          <TableRow className={[classes.teblerow, classes.backgroundlightgray]}>
            <TableCell className={classes.tablecell}>
              <b>Grade - {templateFrom?.grade?.grade_name}</b>
            </TableCell>
            <TableCell colspan='2' className={classes.tablecell}>
              <b>Subject - {templateFrom?.subject?.subject?.subject_name}</b>
            </TableCell>
            <TableCell className={classes.tablecell}>
              <b>Marks: {templateFrom?.total_marks}</b>
            </TableCell>
            <TableCell colspan='2' className={classes.tablecell}>
              {!isPrint && !isQuestionPaper ? (
                <b>Duration: {templateFrom?.duration}minutes</b>
              ) : null}
            </TableCell>
          </TableRow>
          {!isPrint && !isQuestionPaper ? (
            <TableRow className={[classes.teblerow, classes.backgroundlightgray]}>
              <TableCell colspan='4' className={classes.tablecell}>
                <b>Test ID: 34565</b>
              </TableCell>
              <TableCell colspan='2' className={classes.tablecell}>
                <b>Date: {moment(new Date()).format('DD.MM.YYYY')}</b>
              </TableCell>
            </TableRow>
          ) : null}
          {!isPrint && !isQuestionPaper ? (
            <TableRow className={classes.teblerow}>
              <TableCell colspan='6' className={[classes.tablecell, classes.noBorder]}>
                <strong>General Instruction</strong>
                <Divider />
                <pre className={classes.instruction}>{templateFrom?.instruction}</pre>
                <br />
              </TableCell>
            </TableRow>
          ) : null}
          {currentStep > 1 &&
            templateFrom.section
              ?.filter((eachSec, index) => index < templateFrom.section.length - 1)
              .map((eachSection) => {
                return (
                  <>
                    <TableRow className={classes.teblerow}>
                      <TableCell
                        colspan='6'
                        className={[classes.tablecell, classes.noBorder]}
                      >
                        <Typography
                          align='center'
                          className={classes.previewSectionHeader}
                        >
                          {eachSection?.header}
                        </Typography>
                        <Typography
                          align='center'
                          className={classes.previewSectionDescription}
                        >
                          {eachSection?.description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {eachSection?.question?.map((eachQuestion, index) => {
                      return (
                        <>
                          <TableRow className={classes.teblerow}>
                            <TableCell
                              colspan='6'
                              className={[classes.tablecell, classes.noBorder]}
                              style={{
                                ...(isPrint
                                  ? { padding: '15px 0px' }
                                  : { padding: '10px 0px' }),
                              }}
                            >
                              <Grid container spacing={1} alignItems='flex-start'>
                                <Grid item style={{ minWidth: '20px' }}>
                                  <Typography className='font-size-14 font-weight-600'>
                                    {index + 1}.
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      marginTop: 1,
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: eachQuestion?.question?.question_answer
                                        ?.length
                                        ? eachQuestion?.question?.question_answer[0]
                                            ?.question
                                        : null,
                                    }}
                                    className={classes.generatedQuestionDiv}
                                  />
                                </Grid>
                              </Grid>
                              {eachQuestion?.question?.question_answer?.length &&
                              eachQuestion?.question?.question_answer[0]?.options &&
                              eachQuestion?.question?.question_answer[0]?.options
                                ?.length ? (
                                <>
                                  {eachQuestion?.question?.question_answer?.length ? (
                                    <>
                                      <Grid container spacing={1}>
                                        {eachQuestion?.question?.question_answer[0]?.options?.map(
                                          (eachOption, index) => {
                                            return (
                                              <>
                                                <Grid
                                                  container
                                                  item
                                                  xs={6}
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
                                                      {String.fromCharCode(65 + index)}.
                                                    </Typography>
                                                  </Grid>
                                                  <Grid item>
                                                    <Typography className='font-size-12'>
                                                      {eachOption[`option${index + 1}`]
                                                        ?.title
                                                        ? eachOption[`option${index + 1}`]
                                                            ?.title
                                                        : eachOption[`option${index + 1}`]
                                                            ?.optionValue
                                                        ? eachOption[`option${index + 1}`]
                                                            ?.optionValue
                                                        : null}
                                                    </Typography>
                                                    {eachOption[`option${index + 1}`]
                                                      ?.images?.length
                                                      ? eachOption[
                                                          `option${index + 1}`
                                                        ]?.images?.map(
                                                          (eachImage, indexImage) => {
                                                            return (
                                                              <>
                                                                <img
                                                                  src={
                                                                    endpoints.erpBucket +
                                                                    eachImage
                                                                  }
                                                                  alt='option image'
                                                                  height={150}
                                                                  style={{
                                                                    padding: '10px',
                                                                  }}
                                                                  // width=""
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
                                          }
                                        )}
                                      </Grid>
                                    </>
                                  ) : null}
                                </>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </>
                );
              })}
        </Table>
      </TableContainer>
    </div>
  );
};

export default withStyles(styles)(QuestionPreview);
