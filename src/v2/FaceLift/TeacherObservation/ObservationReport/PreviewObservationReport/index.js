import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import { useHistory } from 'react-router-dom';
import EduvateLogo from 'v2/Assets/images/eduvate-logo.png';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { Paper, makeStyles, Box, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiPaper-rounded': {
      borderRadius: '0px',
    },
    fontFamily: '"Inter", sans-serif !important',
  },
  printButton: {
    position: 'sticky',
    left: '93%',
    bottom: '4%',
    marginTop: '1%',
    background: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
    '&:hover': {
      background: '#1b4ccb',
    },
  },
}));

export default function PreviewObservationReport({ reportCardDataNew }) {
  const history = useHistory();
  const classes = useStyles();
  const componentRef = useRef();
  const previewData = history.location.state?.selectedReport;
  const pricipalSignData = [];

  useEffect(() => {}, [reportCardDataNew]);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const data = [];
  let schoolData = JSON.parse(localStorage.getItem('schoolDetails'));
  let userData = data?.user_info;

  const previewReportData = JSON.parse(previewData?.report);
  return (
    <React.Fragment>
      <Layout>
        <div className='row bg-white py-2 px-2' ref={componentRef}>
          <table className='w-100 th-report-table mb-3'>
            <tbody>
              <tr>
                <td width='15%' className='text-center'>
                  <img className='text-center' src={EduvateLogo} width={'80px'} />
                </td>
                <td width='70%' className='text-center'>
                  {schoolData?.cbse_affiliation_code ? (
                    <div className='th-20'>
                      CBSE AFFILIATION NO: {schoolData?.cbse_affiliation_code}
                    </div>
                  ) : null}
                  <div className='th-14 th-fw-600'>{schoolData?.address}</div>
                  <div className='th-22 th-fw-600 pt-4'>CLASSROOM OBSERVATION FORM</div>
                  <div className='th-18 pb-3'>
                    ACADEMIC YEAR {selectedAcademicYear?.session_year}
                  </div>
                </td>
                <td width='15%' className='text-center'>
                  <img
                    src={`https://d3ka3pry54wyko.cloudfront.net/${schoolData?.school_logo}`}
                    width={'80px'}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table className='w-100 th-report-table '>
            {/* Student details */}
            <tbody className='th-table-border th-12'>
              <tr>
                <td className='th-fw-600 th-width-12 py-1'>
                  {!previewData?.is_student ? "TEACHER'S NAME" : 'STUDENT NAME'}
                </td>
                <td className='th-width-33 text-uppercase py-1'>
                  {previewData?.is_student
                    ? previewData?.student_name
                    : previewData?.teacher_name}
                </td>
                <td className='th-width-12 th-fw-600 py-1'>OBSERVATION DATE</td>
                <td className='th-width-33 text-uppercase py-1'>{previewData?.date}</td>
              </tr>
              <tr>
                <td colSpan={1} className='th-fw-600 py-1'>
                  ERP ID
                </td>
                <td className='text-uppercase py-1' colSpan={1}>
                  {previewData?.is_student
                    ? previewData?.student_erp
                    : previewData?.teacher_erp}
                </td>
                <td colSpan={1} className='th-fw-600 py-1'>
                  REPORT CREATION DATE
                </td>
                <td className='text-uppercase py-1' colSpan={1}>
                  {previewData?.date}
                </td>
              </tr>
              <tr>
                <td colSpan={1} className='th-fw-600 py-1'>
                  BRANCH
                </td>
                <td colSpan={1} className='text-uppercase py-1'>
                  {previewData?.branch?.branch_name}
                </td>
                <td colSpan={1} className='th-fw-600 py-1'>
                  GRADE
                </td>
                <td colSpan={1} className='py-1'>
                  {previewData?.grade?.grade_name}
                </td>
              </tr>
              <tr>
                <td colSpan={1} className='th-fw-600 py-1'>
                  SUBJECT
                </td>
                <td colSpan={1} className='text-uppercase py-1'>
                  {previewData?.subject?.subject_name}
                </td>
                <td colSpan={1} className='th-fw-600 py-1'>
                  SECTION
                </td>
                <td colSpan={1} className='py-1'>
                  {previewData?.section?.section_name}
                </td>
              </tr>
            </tbody>
          </table>

          <table className='w-100 mt-1 th-12 th-report-table '>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '65%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <tbody className='th-table-border'>
              <tr>
                <td
                  className='py-2 text-center th-fw-600 th-13 text-uppercase'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  Observation Area
                </td>
                <td
                  className='py-2 text-center th-fw-600 th-13 text-uppercase'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  Observations
                </td>
                <td
                  className='py-2 text-center th-fw-600 th-13 text-uppercase'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  Description
                </td>
                <td
                  className='py-2 text-center th-fw-600 th-13 text-uppercase'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  Score
                </td>
              </tr>
            </tbody>
            {previewReportData?.map((eachData, j) => {
              return (
                <tbody className='th-table-border'>
                  <tr>
                    <td
                      className='py-2 text-center th-fw-600'
                      rowSpan={eachData?.observation?.length + 2}
                    >
                      {eachData?.observation_area_name}
                    </td>
                  </tr>

                  {eachData?.observation?.map((eachParameter, i) => {
                    return (
                      <>
                        <tr>
                          <td className='py-2 ' style={{ background: '#ffffff' }}>
                            {i + 1}. {eachParameter?.observationarea}
                          </td>
                          <td className='py-2' style={{ background: '#ffffff' }}>
                            {eachParameter?.description}
                          </td>
                          <td
                            className='py-2 text-center'
                            style={{ background: '#ffffff' }}
                          >
                            {eachParameter?.score}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              );
            })}{' '}
            {/* Total Start */}
            <tbody className='th-table-border'>
              <tr>
                <td
                  className='th-14 th-fw-600 py-2 text-center'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  Observer’s Overall Feedback
                </td>
                <td
                  className='th-14 th-fw-600 py-2'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  {previewData?.remark}
                </td>
                <td
                  className='th-14 th-fw-600 text-right pr-2 py-2'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  {'Total'}
                </td>
                <td
                  className='th-14 th-fw-600 text-center py-2'
                  style={{ backgroundColor: '#fdbf8e' }}
                >
                  {previewData?.score}
                </td>
              </tr>
            </tbody>{' '}
            {/* Total End */}
          </table>
          <table className='w-100 mt-1 th-12 th-report-table '>
            <tbody className='th-table-border'>
              <tr>
                <td className='th-width-50 py-2 pl-3 th-fw-600'>
                  {' '}
                  Teacher’s Signature
                  {pricipalSignData?.length ? (
                    <span className='pl-2'>
                      <img
                        src={
                          `https://letseduvate.s3.amazonaws.com/prod/media/` +
                          pricipalSignData[0]?.principle_sign
                        }
                        width={'120px'}
                      />
                    </span>
                  ) : null}
                </td>

                <td className='th-width-50 py-2 pl-3 th-fw-600 text-right'>
                  Observer’s Signature{' '}
                  {pricipalSignData?.length ? (
                    <span className='pl-2'>
                      <img
                        src={
                          `https://letseduvate.s3.amazonaws.com/prod/media/` +
                          pricipalSignData[0]?.principle_sign
                        }
                        width={'120px'}
                      />
                    </span>
                  ) : null}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ReactToPrint
          trigger={() => (
            <IconButton
              className={classes.printButton}
              title='Print front side of the report card'
            >
              <PrintIcon />
            </IconButton>
          )}
          content={() => componentRef.current}
          documentTitle={`Observer’s Overall Feedback`}
        />
      </Layout>
    </React.Fragment>
  );
}
