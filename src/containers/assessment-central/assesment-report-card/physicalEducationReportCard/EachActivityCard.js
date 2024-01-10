import React, { useRef } from 'react';
import { makeStyles, Paper, IconButton, Box } from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
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

const EachActivityCard = React.forwardRef(
  ({ activityReportData, username, branchLogo }, ref) => {
    const classes = useStyles();
    const componentRef = useRef();
    function IsJsonString(str) {
      try {
        var json = JSON.parse(str);
        return typeof json === 'object';
      } catch (e) {
        return false;
      }
    }
    return (
      <Box style={{ position: 'relative' }}>
        <Paper component={'div'} elevation={2} className={classes.root} ref={ref}>
          <div
            className='row py-2 px-2 pe-report-font'
            id='pdf-content'
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
            <div className='w-80' style={{ padding: '2% 0%' }}>
              <table className='w-100 mt-3 th-12 th-report-table '>
                <tbody className='th-pe-table'>
                  <tr className=''>
                    <td
                      className='th-width-100 py-0 text-right th-fw-600'
                      style={{ background: '#FDBF8E' }}
                    >
                      <img
                        src={branchLogo}
                        style={{
                          objectFit: 'contain',
                          width: 200,
                          height: 80,
                          marginRight: -40,
                          marginTop: -15,
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      className='th-width-75 py-0 text-center th-fw-600 th-28'
                      style={{ background: '#FDBF8E', color: '#000000' }}
                    >
                      {activityReportData?.activity_logo && (
                        <img
                          src={activityReportData?.activity_logo}
                          style={{
                            objectFit: 'contain',
                            width: 80,
                            height: 75,
                            marginTop: '-5px',
                          }}
                        />
                      )}{' '}
                      {activityReportData?.activity_name}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className='w-100 mt-3 th-12 th-report-table '>
                <tbody className='th-pe-table'>
                  {activityReportData?.criteria_title?.map((each) => {
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
                          const checkedYes =
                            item?.user_review_remarks !== null &&
                            IsJsonString(item?.user_review_remarks)
                              ? JSON.parse(item?.user_review_remarks)
                                  ?.find((el) => el?.status)
                                  ?.name.trim() == 'Yes' ||
                                JSON.parse(item?.user_review_remarks)
                                  ?.find((el) => el?.status)
                                  ?.name.trim() == 'yes' ||
                                JSON.parse(item?.user_review_remarks)
                                  ?.find((el) => el?.status)
                                  ?.name.trim() == 'YES'
                              : false;
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
                                      style={{ height: 25, width: 20 }}
                                    />
                                  )}
                                </div>
                              </td>
                              <td className='th-width-10 text-center'>
                                <div className='th-pe-checkbox'>
                                  {!checkedYes && (
                                    <img
                                      src={CheckMark}
                                      style={{ height: 25, width: 20 }}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        <p className='mb-1'></p>
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
              style={{ position: 'absolute', left: '5%', bottom: '2%' }}
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
                      Principal's Signature <span className='th-pe-sign'>&nbsp;</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Paper>
        {/* <ReactToPrint
        trigger={() => (
          <IconButton
            className={classes.printButton}
            title={`Print ${activityReportData?.activity_name} report card`}
          >
            <PrintIcon />
          </IconButton>
        )}
        content={() => componentRef.current}
        documentTitle={`Eduvate Physical Education - ${activityReportData?.activity_name} - ${username}`}
      /> */}
      </Box>
    );
  }
);

export default EachActivityCard;
