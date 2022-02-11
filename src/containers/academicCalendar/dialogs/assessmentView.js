import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, Button } from '@material-ui/core';
import './assessmentStyles.scss';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from 'config/axios';
import { useHistory } from 'react-router-dom';
import endpoints from 'config/endpoints';
import GetAppIcon from '@material-ui/icons/GetApp';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import Loader from '../../../components/loader/loader';


const Assessmentview = ({ periodId, assessmentSubmitted, periodData, isStudent, isAssessment, assessmentId, questionPaperId }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [assesmentData, setAssessmentData] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedPaper, setSelectedPaper] = useState(null);
  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    if (periodId) {
      setLoading(true);

      axiosInstance
        .get(`/period/test-list/?period_id=${periodId}`)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setAlert('success', result?.data?.message);
            setAssessmentData(result?.data?.result);
          }
          else {
            setAlert('error', result?.data?.message)
          }
          setLoading(false);
        })
        .catch((err) => {
          setAlert('error', err?.message)
          setLoading(false);
        })
    }
  };

  const assignQuestion = () => {
    if (!selectedPaper?.test_name) {
      setAlert('error', "Please Select Question Paper Name")
      return;
    }
    setLoading(true);
    axiosInstance
      .put(`/period/${periodId}/create-period/`, {
        test_ids: [selectedPaper?.id],
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', 'success assigned the Question paper');
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlert('error', err?.message)
        setLoading(false);
      })
  };
  const handleTest = () => {
    history.push(`/assessment/${periodData?.test_details[0]?.question_paper_id}/${periodData?.test_details[0]?.id}/attempt/`)
  }
  const viewQuestion = () => {
    axiosInstance
      .get(`${endpoints.assessmentErp.downloadAssessmentPdf}?test_id=${selectedPaper?.id}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          // handle download part
        }
      });
  };

  return (
    <>
      {isStudent ? (
        <div className='assignedQuestionPaper' style={{ position: 'absolute', left: '25vw' }}>
          {loading && <Loader />}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '188%' }}>
              <Autocomplete
                id='assess'
                onChange={(event, value) => {
                  setSelectedPaper(value);
                }}
                value={selectedPaper?.test_name}
                options={assesmentData || []}
                // value={}
                getOptionLabel={(option) => option?.test_name || ''}
                style={{
                  width: '74%',
                  padding: '10px 15px',
                  // position: 'absolute',
                  // left: '-41%',
                  marginTop: '30px',
                }}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Assign Question Paper'
                    variant='outlined'
                  />
                )}
              />
            </div>
            <div style={{ width: '73%' }}>
              <Button
                style={{
                  color: 'grey',
                  // width: '159%',
                  background: '#fff',
                  borderRadius: '5px',
                  border: '1px solid #f5f0f0',
                  fontWeight: '700',
                  width: '175%',
                  margin: '5px',
                }}
                onClick={assignQuestion}
              >
                {' '}
                Assign Question{' '}
              </Button>
            </div>
            <div>
              <Button
                variant='contained'
                style={{
                  color: 'grey',
                  width: '100%',
                  background: '#fff',
                  borderRadius: '5px',
                  border: '1px solid #f5f0f0',
                  fontWeight: '700',
                  width: '129%',
                  margin: '5px',
                }}
                onClick={viewQuestion}
              >
                Download Question Paper
                <GetAppIcon style={{marginLeft: 20, color: "blue"}} />
              </Button>
            </div>
          </div>
          <div className='submission'>
            <div>
              <Paper
                style={{
                  width: '160%',
                  padding: '10px 15px',
                  position: 'absolute',
                  left: '-44%',
                  marginTop: '30px',
                }}
              >
                <div>
                  <div className='att1'>
                    <div style={{ fontWeight: '600', marginTop: '16px' }}>
                      Submissions
                    </div>
                    {/* <div className='total'>
                  <div className='totalTitle'>total</div>
                  <div className='totalNum'></div>
                </div> */}
                    <div className='submited'>
                      <div className='submitedTitle' style={{ color: 'green' }}>
                        Submited
                      </div>
                      <div
                        className='submitedNum'
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          background: '#cbf9cb',
                          padding: '10% 0px',
                          borderRadius: '14px',
                          width: '104%',
                          fontSize: '14px',
                        }}
                      >
                        {assessmentSubmitted?.submitted}
                      </div>
                    </div>

                    <div className='notsubmited'>
                      <div className='notsubmitedtitle' style={{ color: 'red' }}>
                        Pending
                      </div>
                      <div
                        className='notsubmitedNum'
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          background: '#f9d4d4',
                          padding: '10% 0px',
                          borderRadius: '14px',
                          width: '104%',
                          fontSize: '14px',
                        }}
                      >
                        {assessmentSubmitted?.pending}
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      ) : (
        <div className='assignedTest'>
          <div>
            <Button
              variant='contained'
              style={{
                color: 'grey',
                width: '100%',
                background: '#fff',
                borderRadius: '5px',
                border: '1px solid #f5f0f0',
                fontWeight: '700',
                width: '250%',
                margin: '5px',
              }}
              onClick={handleTest}
            >
              Take Test
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default Assessmentview;
