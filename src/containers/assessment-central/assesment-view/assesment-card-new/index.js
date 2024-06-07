import React, { useState, useContext, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon, Menu, MenuItem } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FlagIcon from '@material-ui/icons/Flag';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { connect } from 'react-redux';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import { addQuestionPaperToTest } from '../../../../redux/actions';
import Divider from '@material-ui/core/Divider';
import ConfirmPopOver from '../../../../../src/containers/time-table/ConfirmPopOver';
import { message } from 'antd';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import diamond from '../../../../../src/assets/images/diamond.png';
import ReactToPrint from 'react-to-print';
import QuestionPreview from '../QuestionPreview';
import QuestionPreview_V2 from '../QuestionPreview_v2/questionPreviewV2';

const AssessmentCard = ({
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  setLoading,
  index,
  periodColor,
  setSelectedIndex,
  initAddQuestionPaperToTest,
  setPublishFlag,
  tabIsErpCentral,
  tabvalue,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  let printRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState();
  // const [loading, setLoading] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const open = Boolean(anchorEl);
  const displayStyle = {
    '@media screen': {
      printContent: {
        display: 'none',
      },
    },
  };
  const schoolData = JSON.parse(localStorage.getItem('schoolDetails')) || {};

  const history = useHistory();
  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpenIndex(null);
  };

  const handleAssign = () => {
    initAddQuestionPaperToTest(period);
    history.push('/create-assesment');
  };

  const handlePrint = async (withID, eachQuestionPaper) => {
    await new Promise((resolve) => {
      setLoading(true);
      setPrintData(eachQuestionPaper);
      setTimeout(resolve, 200);
      setTimeout(() => handleMenuClose(), 400);
    });
    // setPrintWithID(withID);
  };

  const handlePublish = () => {
    setPublishFlag(false);
    const url = endpoints.assessmentErp?.publishQuestionPaper.replace(
      '<question-paper-id>',
      period?.id
    );
    axiosInstance
      .put(url, {
        is_verified: true,
        is_draft: false,
        is_review: false,
      })
      .then((result) => {
        if (result.data.status_code > 199 && result.data.status_code < 300) {
          setAlert('success', result.data.message);
          setPublishFlag(true);
          setSelectedIndex(-1);
        } else {
          message.error(result.data.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleDelete = () => {
    setPublishFlag(false);
    const url = endpoints.assessmentErp?.publishQuestionPaper.replace(
      '<question-paper-id>',
      period?.id
    );
    axiosInstance
      .put(url, {
        is_delete: true,
      })
      .then((result) => {
        if (result?.data?.status_code > 199 && result?.data?.status_code < 300) {
          // setAlert('success', result?.data?.message);
          message.success('Question Paper deleted successfully');
          setPublishFlag(true);
          setSelectedIndex(-1);
        } else {
          message.error(result?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };

  const handleRestore = () => {
    setPublishFlag(false);
    const url = endpoints.assessmentErp?.publishQuestionPaper.replace(
      '<question-paper-id>',
      period?.id
    );
    axiosInstance
      .put(url, {
        is_delete: false,
      })
      .then((result) => {
        if (result.data.status_code > 199 && result.data.status_code < 300) {
          setAlert('success', result.data.message);
          setPublishFlag(true);
          setSelectedIndex(-1);
        } else {
          message.error(result.data.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleViewMore = () => {
    setLoading(true);
    setPeriodDataForView({});
    if (!tabIsErpCentral) {
      const url = endpoints.assessmentErp?.questionPaperViewMore.replace(
        '<question-paper-id>',
        period?.id
      );
      axiosInstance
        .get(url)
        .then((result) => {
          if (result.data.status_code === 200) {
            const { sections, questions } = result.data.result;
            const parsedResponse = [];
            sections.forEach((sec) => {
              const sectionObject = { name: '', questions: [] };
              const sectionName = Object.keys(sec)[0];
              sectionObject.name = sectionName;
              sec[sectionName].forEach((qId) => {
                const questionFound = questions.find((q) => q?.identifier === qId);
                if (questionFound) {
                  sectionObject.questions.push(questionFound);
                }
              });
              parsedResponse.push(sectionObject);
            });

            setLoading(false);
            setViewMore(true);
            // setViewMoreData(result.data.result);
            setViewMoreData(parsedResponse);
            setPeriodDataForView(period);
            setSelectedIndex(index);
          } else {
            setLoading(false);
            setViewMore(false);
            setViewMoreData([]);
            setPeriodDataForView();
            message.error(result.data.message);
            setSelectedIndex(-1);
          }
        })
        .catch((error) => {
          setLoading(false);
          setViewMore(false);
          setViewMoreData([]);
          setPeriodDataForView();
          message.error(error.message);
          setSelectedIndex(-1);
        });
    } else if (tabIsErpCentral && period?.hasOwnProperty('template_id')) {
      axios
        .get(endpoints?.assessmentErp?.autoQuestionPaper, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
          params: { id: period?.id },
        })
        .then((result) => {
          if (result.data.status_code === 200) {
            let temp_response = result?.data?.result?.results[0];
            let temp_response1 = {
              ...temp_response,
              grade: temp_response.grade.id,
              subjects: temp_response.subjects.map((each) => {
                return each.id;
              }),
              grade_subject_mapping: temp_response.subjects.map((each) => {
                return each.grade_subject_mapping;
              }),
              questions: [].concat(
                ...temp_response.section
                  .filter(
                    (eachSecection, index) => index < temp_response.section.length - 1
                  )
                  .map((each) => {
                    return each.question;
                  })
              ),
              sections: temp_response.section
                .filter(
                  (eachSecection, index) => index < temp_response.section.length - 1
                )
                .map((eachSec) => {
                  return {
                    [eachSec.header[0]]: eachSec.question.map((each) => {
                      return each.id;
                    }),
                    description: eachSec.description[0],
                  };
                }),
            };
            const { sections, questions } = temp_response1;
            const parsedResponse = [];
            sections.forEach((sec) => {
              const sectionObject = { name: '', questions: [] };
              const sectionName = Object.keys(sec)[0];
              sectionObject.name = sectionName;
              sec[sectionName].forEach((qId) => {
                const questionFound = questions.find((q) => q?.id === qId);
                if (questionFound) {
                  sectionObject.questions.push(questionFound);
                }
              });
              parsedResponse.push(sectionObject);
            });
            setLoading(false);
            setViewMore(true);
            setViewMoreData(parsedResponse);
            setPeriodDataForView(period);
            setSelectedIndex(index);
          } else {
            setLoading(false);
            setViewMore(false);
            setViewMoreData([]);
            setPeriodDataForView();
            message.error(result.data.message);
            setSelectedIndex(-1);
          }
        })
        .catch((error) => {
          // setLoading(false);
          // setViewMore(false);
          // setViewMoreData([]);
          // setPeriodDataForView();
          // message.error(error.message);
          // setSelectedIndex(-1);
        });
    } else if (tabIsErpCentral && !period?.hasOwnProperty('template_id')) {
      const url = endpoints.assessmentErp?.questionPaperViewMoreCentral.replace(
        '<question-paper-id>',
        period?.id
      );
      axios
        .get(url, { headers: { 'x-api-key': 'vikash@12345#1231' } })
        .then((result) => {
          if (result.data.status_code === 200) {
            const { sections, questions } = result.data.result;
            const parsedResponse = [];
            sections.forEach((sec) => {
              const sectionObject = { name: '', questions: [] };
              const sectionName = Object.keys(sec)[0];
              sectionObject.name = sectionName;
              sec[sectionName].forEach((qId) => {
                const questionFound = questions.find((q) => q?.id === qId);
                if (questionFound) {
                  sectionObject.questions.push(questionFound);
                }
              });
              parsedResponse.push(sectionObject);
            });
            setLoading(false);
            setViewMore(true);
            setViewMoreData(parsedResponse);
            setPeriodDataForView(period);
            setSelectedIndex(index);
          } else {
            setLoading(false);
            setViewMore(false);
            setViewMoreData([]);
            setPeriodDataForView();
            message.error(result.data.message);
            setSelectedIndex(-1);
          }
        })
        .catch((error) => {
          setLoading(false);
          setViewMore(false);
          setViewMoreData([]);
          setPeriodDataForView();
          message.error(error.message);
          setSelectedIndex(-1);
        });
    }
  };

  const handlePrintData = async (period) => {
    await new Promise((resolve) => {
      setLoading(true);
      axios
        .get(endpoints?.assessmentErp?.autoQuestionPaper, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
          params: { id: period?.id },
        })
        .then((res) => {
          let tempAllTemplate = res.data.result.results.map((each) => {
            let tempEachAllTemplate = {
              ...each,
              title: each?.paper_name,
              subject:
                each?.subjects?.length > 0
                  ? {
                      id: each?.subjects[0]?.grade_subject_mapping,
                      subject: each?.subjects[0],
                    }
                  : null,

              section: each?.section
                .filter((eachSec, index) => index < each.section.length - 1)
                .map((eachSection, index) => {
                  return {
                    ...eachSection,
                    header: eachSection?.header[0],
                    description: eachSection?.description[0],
                    totalQuestion: eachSection?.totalQuestion[0],
                    question: eachSection?.question.map((eachQuestion, qIndex) => {
                      return {
                        // ...eachQuestion,
                        bloom: {
                          id: eachQuestion?.question_categories,
                          category_name: eachQuestion?.question_categories_display,
                        },
                        difficult: {
                          id: eachQuestion?.question_level,
                          level_name: eachQuestion?.question_level_display,
                        },
                        type: {
                          id: eachQuestion?.question_type_sub_type_id,
                          type_name: eachQuestion?.question_type_sub_type_name,
                        },
                        subType: {
                          id: eachQuestion?.question_type,
                          type_name: eachQuestion?.question_type_name,
                          sub_type_id: eachQuestion?.question_type_sub_type_id,
                        },
                        marks: eachQuestion?.question_mark[0],
                        question: eachQuestion,
                      };
                    }),
                  };
                }),
              volume: each?.volume ? each?.volume : [], //need
              chapter: each?.chapter ? each?.chapter : [], //need
              total_marks: each.total_mark,
              duration: each.duration ? each?.duration : null, //need
              instruction: each?.instructions ? each?.instructions : '', //need
              questionGenerate: true,
              currentPaper: 1,
              exportType: 'Publish',
              // // subject: each?.subjects[0],
              // duration: each?.total_duration,
              // instruction: each?.instructions,
            };
            return { ...tempEachAllTemplate };
          });
          console.log({ tempAllTemplate: tempAllTemplate[0] }, 'alllog printdata');
          setPrintData(tempAllTemplate[0]);
          setTimeout(resolve, 200);
          setTimeout(() => handleMenuClose(), 400);
        });
    }).catch((err) => {});
    // axios
    //   .get(endpoints.assessmentErp.listQuestionPaperV2, { headers: { 'x-api-key': 'vikash@12345#1231' }, params: { id: period.id,autoQp:true } })
  };

  return (
    <>
      <Paper
        className={`${periodColor ? classes.selectedRoot : classes.root} ${
          period.is_verified ? classes.verifiedColor : classes.notverified
        }`}
        style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}
      >
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Box>
              <Typography
                className={classes.title}
                variant='p'
                component='p'
                color='primary'
                noWrap
              >
                {period.paper_name}
              </Typography>
            </Box>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                noWrap
              >
                {period.is_draft ? 'Draft' : null}
                {period.is_review ? 'Review' : null}
                {period.is_verified ? 'Published' : null}
              </Typography>
            </Box>
          </Grid>
          {/* {period.is_verified && ( */}
          <Grid item xs={3} className={classes.textRight}>
            <Box>
              {period.hasOwnProperty('template_id') && (
                <>
                  {' '}
                  <img src={diamond} className={classes.identifier_icon} />
                </>
              )}
              <IconButton
                aria-label='more'
                aria-controls='long-menu'
                aria-haspopup='true'
                size='small'
                style={{ padding: '0' }}
                onClick={(e) => {
                  handleMenuClick(e, index);
                }}
              >
                <MoreHorizIcon style={{ height: 25, width: 25 }} />
              </IconButton>
              {menuOpenIndex === index ? (
                <Menu
                  id='long-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    style: {
                      // maxHeight: ITEM_HEIGHT * 4.5,
                      // width: '20ch',
                    },
                  }}
                >
                  {period.is_verified && !period?.is_delete && (
                    <>
                      {period.is_central && period.hasOwnProperty('template_id') && (
                        // <ReactToPrint
                        //   onBeforeGetContent={() => handlePrintData(period)}
                        //   onAfterPrint={() => {
                        //     setLoading(false);
                        //     setPrintData(null);
                        //     // handleMenuClose();
                        //   }}
                        //   trigger={() => <MenuItem>Print</MenuItem>}
                        //   content={() => printRef}
                        //   documentTitle={`Print`}
                        // />
                        <ReactToPrint
                          onBeforeGetContent={() => handlePrintData(period)}
                          onAfterPrint={() => {
                            // handleSubmitEnquiryModal();
                            setLoading(false);
                            setPrintData(null);
                          }}
                          trigger={() => <MenuItem>Print</MenuItem>}
                          content={() => printRef}
                          documentTitle={`Print`}
                          copyStyles={true}
                          pageStyle={`
                          @page {
                            margin: 10mm 10mm 25mm 10mm;
                            size: A4;
                          }

                          @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                            }

                            html, body {
                              width: 100%;
                              height: 100%;
                              margin: 0;
                              padding: 0;
                            }
                              .print:last-child {
                                page-break-after: avoid;
                              }
                          }
                        `}
                        />
                      )}
                      {!period.hasOwnProperty('template_id') && (
                        <MenuItem
                          onClick={() => {
                            handleAssign();
                            handleMenuClose();
                          }}
                        >
                          Assign Test
                        </MenuItem>
                      )}
                      {!period.is_central && (
                        <MenuItem
                          onClick={() => {
                            setConfirmMessage('delete');
                            setOpenModal(true);
                            handleMenuClose();
                          }}
                        >
                          Delete
                        </MenuItem>
                      )}
                    </>
                  )}
                  {period?.is_delete && (
                    <>
                      {period.is_central && period.hasOwnProperty('template_id') && (
                        // <ReactToPrint
                        //   onBeforeGetContent={() => handlePrintData(period)}
                        //   onAfterPrint={() => {
                        //     setLoading(false);
                        //     setPrintData(null);
                        //     // handleMenuClose();
                        //   }}
                        //   trigger={() => <MenuItem>Print</MenuItem>}
                        //   content={() => printRef}
                        //   documentTitle={`Print`}
                        // />
                        <ReactToPrint
                          onBeforeGetContent={() => handlePrintData(period)}
                          onAfterPrint={() => {
                            // handleSubmitEnquiryModal();
                            setLoading(false);
                            setPrintData(null);
                          }}
                          trigger={() => <MenuItem>Print</MenuItem>}
                          content={() => printRef}
                          documentTitle={`Print`}
                          copyStyles={true}
                          pageStyle={`
                          @page {
                            margin: 10mm 10mm 25mm 10mm;
                            size: A4;
                          }

                          @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                            }

                            html, body {
                              width: 100%;
                              height: 100%;
                              margin: 0;
                              padding: 0;
                            }
                              .print:last-child {
                                page-break-after: avoid;
                              }
                          }
                        `}
                        />
                      )}
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleRestore();
                        }}
                      >
                        Restore
                      </MenuItem>
                    </>
                  )}
                  {!period.is_verified && !period?.is_delete && (
                    <>
                      {period.is_central && period.hasOwnProperty('template_id') && (
                        // <ReactToPrint
                        //   onBeforeGetContent={() => handlePrintData(period)}
                        //   onAfterPrint={() => {
                        //     setLoading(false);
                        //     setPrintData(null);
                        //     // handleMenuClose();
                        //   }}
                        //   trigger={() => <MenuItem>Print</MenuItem>}
                        //   content={() => printRef}
                        //   documentTitle={`Print`}
                        // />
                        <ReactToPrint
                          onBeforeGetContent={() => handlePrintData(period)}
                          onAfterPrint={() => {
                            // handleSubmitEnquiryModal();
                            setLoading(false);
                            setPrintData(null);
                          }}
                          trigger={() => <MenuItem>Print</MenuItem>}
                          content={() => printRef}
                          documentTitle={`Print`}
                          copyStyles={true}
                          pageStyle={`
                          @page {
                            margin: 10mm 10mm 25mm 10mm;
                            size: A4;
                          }

                          @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                            }

                            html, body {
                              width: 100%;
                              height: 99%;
                              margin: 0;
                              padding: 0;
                            }
                              .print:last-child {
                                page-break-after: avoid;
                              }
                          }
                        `}
                        />
                      )}
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handlePublish();
                        }}
                      >
                        Publish Paper
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          setConfirmMessage('delete');
                          setOpenModal(true);
                        }}
                      >
                        Delete
                      </MenuItem>
                    </>
                  )}
                </Menu>
              ) : null}
              {openModal && (
                <ConfirmPopOver
                  submit={() => handleDelete()}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  operation={confirmMessage}
                  opendelete={true}
                />
              )}
              {/* <span
                className='period_card_menu'
                onClick={() => handlePeriodMenuOpen(index)}
                // onMouseLeave={handlePeriodMenuClose}
              >
                <IconButton className='moreHorizIcon' color='primary'>
                  <MoreHorizIcon />
                </IconButton>
                {showPeriodIndex === index && showMenu ? (
                  <div className='tooltipContainer'>
                    {period.is_verified && !period?.is_delete && (
                      <span
                        className={` ${classes.tooltiptext} tooltiptext`}
                        style={{ width: '140px', marginLeft: '-100px' }}
                      >
                        {period.is_central && period.hasOwnProperty('template_id') && (
                          <>
                            <ReactToPrint
                              onBeforeGetContent={() => handlePrintData(period)}
                              onAfterPrint={() => {
                                setLoading(false);
                                setPrintData(null);
                              }}
                              trigger={() => (
                                <span style={{ marginBottom: 10 }}>Print</span>
                              )}
                              content={() => printRef}
                              documentTitle={`Print`}
                            />
                            <Divider />
                          </>
                        )}
                        {!period.hasOwnProperty('template_id') && (
                          <>
                            <span onClick={handleAssign} style={{ marginBottom: 10 }}>
                              Assign Test
                            </span>
                            <Divider />
                          </>
                        )}
                        {!period.is_central && (
                          <span
                            onClick={() => {
                              setConfirmMessage('delete');
                              setOpenModal(true);
                            }}
                            style={{ marginTop: 10 }}
                          >
                            Delete
                          </span>
                        )}
                      </span>
                    )}
                    {period?.is_delete && (
                      <span
                        className={` ${classes.tooltiptext} tooltiptext`}
                        style={{ width: '140px', marginLeft: '-100px' }}
                      >
                        {period.is_central && period.hasOwnProperty('template_id') && (
                          <>
                            <ReactToPrint
                              onBeforeGetContent={() => handlePrintData(period)}
                              onAfterPrint={() => {
                                setLoading(false);
                                setPrintData(null);
                              }}
                              trigger={() => (
                                <span style={{ marginBottom: 10 }}>Print</span>
                              )}
                              content={() => printRef}
                              documentTitle={`Print`}
                            />
                            <Divider />
                          </>
                        )}
                        <span onClick={handleRestore}>Restore</span>
                      </span>
                    )}
                    {!period.is_verified && !period?.is_delete && (
                      <span
                        className='tooltiptext'
                        style={{ width: '160px', marginLeft: '-120px' }}
                      >
                        {period.is_central && period.hasOwnProperty('template_id') && (
                          <>
                            <ReactToPrint
                              onBeforeGetContent={() => handlePrintData(period)}
                              onAfterPrint={() => {
                                setLoading(false);
                                setPrintData(null);
                              }}
                              trigger={() => (
                                <span style={{ marginBottom: 10 }}>Print</span>
                              )}
                              content={() => printRef}
                              documentTitle={`Print`}
                            />
                            <Divider />
                          </>
                        )}
                        <span onClick={handlePublish} style={{ marginBottom: 10 }}>
                          Publish Paper
                        </span>
                        <Divider />
                        <span
                          onClick={() => {
                            setConfirmMessage('delete');
                            setOpenModal(true);
                          }}
                          style={{ marginTop: 10 }}
                        >
                          Delete
                        </span>
                      </span>
                    )}
                    {openModal && (
                      <ConfirmPopOver
                        submit={() => handleDelete()}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        operation={confirmMessage}
                        opendelete={true}
                      />
                    )}
                  </div>h
                ) : null}
              </span> */}
            </Box>
          </Grid>
          {/* <Grid item xs={12} sm={12} /> */}
          <Grid item xs={8}>
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
              >
                {tabIsErpCentral.id == 1 ? (
                  <FlagIcon className={classes.checkCentral} />
                ) : (
                  <FlagIcon className={classes.checkCentralNot} />
                )}
                Created On :{period.created_at.substring(0, 10)}
              </Typography>
            </Box>
            {/* <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
            >
              {period.created_at.substring(0, 10)}
            </Typography>
          </Box> */}
          </Grid>
          <Grid item xs={2} className={classes.textRight} style={{ marginLeft: '16%' }}>
            {!periodColor && (
              <Button
                variant='contained'
                style={{
                  color: 'white',
                  width: '100%',
                  borderRadius: '6px',
                  height: '32px',
                }}
                color='primary'
                size='small'
                onClick={handleViewMore}
              >
                VIEW MORE
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      {printData && (
        <div>
          {/* <div ref={(el) => (printRef = el)} className={classes.printContent} > */}
          <div ref={(el) => (printRef = el)} className='printContent'>
            {/* <QuestionPreview templateFrom={printData} currentStep={4} isPrint={true} /> */}
            <QuestionPreview_V2
              templateFrom={printData}
              currentStep={4}
              isPrint={true}
              schoolData={schoolData}
            />
          </div>
        </div>
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  initAddQuestionPaperToTest: (data) => dispatch(addQuestionPaperToTest(data)),
});

export default connect(null, mapDispatchToProps)(AssessmentCard);
