import React, { useRef } from 'react';
import { makeStyles, Paper, IconButton, Box } from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import PhysicalEducationPDF from './PhysicalEducationPDF';
import { Button } from 'antd';
import ReportBg from './img/report_bg.jpg';
import CheckMark from './img/check.png';
import './styles/index.css';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 11,
    display: 'flex',
    padding: '2% 0%',
    marginBottom: '15px',
    justifyContent: 'center',
    '&.MuiPaper-rounded': {
      borderRadius: '0px',
    },
  },
  printButton: {
    position: 'absolute',
    right: '5%',
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

const PhysicalEducationReportCard = ({ peReportCardData }) => {
  const classes = useStyles();
  const componentRef = useRef();

  return (
    <Box>
      {peReportCardData?.data.length > 0 ? (
        peReportCardData?.data.slice(0, 1)?.map((eachActivity) => {
          return (
            <>
              <Paper
                component={'div'}
                elevation={2}
                className={classes.root}
                style={{ position: 'relative' }}
              >
                <div
                  className='row py-2 px-2 pe-report-font'
                  id='pdf-content'
                  ref={componentRef}
                  style={{
                    height: '297mm',
                    width: '210mm',
                    backgroundImage: `url(${ReportBg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    position: 'relative',
                  }}
                >
                  <div className='w-80' style={{ padding: '5% 0%' }}>
                    <table className='w-100 mt-3 th-12 th-report-table '>
                      <tbody className='th-pe-table'>
                        <tr className=''>
                          <td
                            className='th-width-100 py-2 text-right th-fw-600'
                            style={{ background: '#FDBF8E' }}
                          >
                            <img
                              src={peReportCardData?.user_data[0]?.branch_logo}
                              style={{
                                objectFit: 'cover',
                                width: 80,
                                marginTop: '-20px',
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            className='th-width-75 py-2 text-center th-fw-600 th-20'
                            style={{ background: '#FDBF8E', color: 'grey' }}
                          >
                            {eachActivity?.activity_name}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table className='w-100 mt-3 th-12 th-report-table '>
                      <tbody className='th-pe-table'>
                        {eachActivity?.criteria_title?.map((each) => {
                          return (
                            <>
                              <tr className='th-pe-row'>
                                <td className='th-width-80 py-2 text-center th-fw-600 th-16'>
                                  {each?.title}
                                </td>
                                <td className='th-width-10 py-2 th-fw-600 th-16 text-center '>
                                  Yes
                                </td>
                                <td className='th-width-10 py-2 th-fw-600 th-16 text-center'>
                                  No
                                </td>
                              </tr>
                              {each?.levels?.map((item) => {
                                let checkedYes =
                                  JSON.parse(item?.user_review_remarks).find(
                                    (el) => el?.status
                                  )?.name == 'Yes';
                                return (
                                  <tr className='th-pe-row'>
                                    <td className='th-width-80 th-14 text-left pl-3 th-fw-500'>
                                      {item?.level_name}
                                    </td>
                                    <td className='th-width-10  text-center'>
                                      <div className='th-pe-checkbox'>
                                        {checkedYes && (
                                          <img
                                            src={CheckMark}
                                            style={{ height: 30, width: 20 }}
                                          />
                                        )}
                                      </div>
                                    </td>
                                    <td className='th-width-10 text-center'>
                                      <div className='th-pe-checkbox'>
                                        {!checkedYes && (
                                          <img
                                            src={CheckMark}
                                            style={{ height: 30, width: 20 }}
                                          />
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr className=''></tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* <table className='w-100 mt-3 th-12 th-report-table '>
              <tbody className='th-pe-table'>
                <tr className='th-bg-white th-br-8'>
                  <td className='th-width-100 text-left th-fw-500 p-3'>
                    <span className='th-fw-600 pr-2 th-14'>Remarks :</span>
                    <span
                      style={{
                        wordBreak: 'break-all',
                        paddingBottom: 2,
                        lineHeight: '1.8rem',
                        borderBottom: '2px solid black',
                      }}
                    >
                      Finance00000 Pending00000 Approve / Reject00000 Immediately claims
                      are not getting moved to Approved / Reject tab Finance00000
                      Pending00000 Approve / Reject00000 Immediately claims are not
                      getting moved to Approved / Reject tab Finance00000 Pending00000
                      Approve / Reject00000 Immediately claims are not getting moved to
                      Approved / Reject tab
                    </span>
                  </td>
                </tr>
              </tbody>
            </table> */}
                  </div>
                  <div
                    className='w-90 th-16'
                    style={{ position: 'absolute', left: '5%', bottom: '10%' }}
                  >
                    <table className='th-width-100 th-report-table '>
                      <tbody className='th-pe-table'>
                        <tr>
                          <td
                            className='py-2 text-left th-fw-600'
                            style={{ background: '#FDBF8E' }}
                          >
                            Teacher's Signature <span className='th-pe-sign'>&nbsp;</span>
                          </td>
                          <td
                            className='py-2 text-right th-fw-600'
                            style={{ background: '#FDBF8E' }}
                          >
                            Principal's Signature{' '}
                            <span className='th-pe-sign'>&nbsp;</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <ReactToPrint
                  trigger={() => (
                    <IconButton
                      className={classes.printButton}
                      title={`Print ${eachActivity?.activity_name} report card`}
                    >
                      <PrintIcon />
                    </IconButton>
                  )}
                  content={() => componentRef.current}
                  documentTitle={`Eduvate Physical Education - ${eachActivity?.activity_name} - ${peReportCardData?.user_data[0]?.name}`}
                />
              </Paper>
            </>
          );
        })
      ) : (
        <Paper component={'div'} elevation={2} className={classes.root}>
          <div className='row'>
            <div className='col-12 text-center'>
              <span className='th-22 th-fw-600 th-grey'>
                &#9432; Kindly reach out to the school management to obtain the report
                card.
              </span>
            </div>
          </div>
        </Paper>
      )}
    </Box>
  );
};

export default PhysicalEducationReportCard;
