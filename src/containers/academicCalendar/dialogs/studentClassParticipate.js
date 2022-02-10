import React, { useState, useEffect, useContext } from 'react';
import { Button, Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from '../../../../src/context-api/alert-context/alert-state';
import CloseIcon from '@material-ui/icons/Close';
import Loader from '../../../components/loader/loader';


const StudentClassParticipate = ({
  periodId,
  userId,
  openParticipate,
  setOpenParticipate,
  date,
  periodName
}) => {
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const handleClose = () => {
    setOpenParticipate(false);
  };
  const studentRemarks = () => {
    setLoading(true);
    axiosInstance
      .get(`/period/${periodId}/attendance-list/?user_id=${userId}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setStudentData(result?.data?.result?.results[0]);
          setAlert('success', result?.data?.message);
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);

        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);

      });
  };
  useEffect(() => {
    studentRemarks();
  }, []);
  return (
    <div>
      {loading && <Loader />}
      <Dialog
        fullScreen={fullScreen}
        open={openParticipate}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
        fullWidth={true}
        maxWidth='md'
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 10px 10px 30px',
            background: '#E5E7FB',
            alignItems: 'center',
          }}
        >
          <h4 style={{ color: 'rgb(111 115 138)' }}>Subject : {periodName}</h4>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h4>{date}</h4>
            <CloseIcon
              onClick={handleClose}
              style={{ cursor: 'pointer', paddingLeft: 15, fontSize: '50px' }}
            />
          </div>
        </div>
        <div style={{ background: 'rgb(245 247 251)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '15px 40px',
              padding: '8px 0px',
              color: '#747981',
            }}
          >
            <div style={{ textAlign: 'center', flex: 3 }}>Score</div>
            <div style={{ textAlign: 'center', flex: 3 }}>
              <b>Class Average Score</b>
            </div>
            <div style={{ textAlign: 'center', flex: 5 }}>
              <b>Remarks</b>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '15px 40px 100px 40px',
              textAlign: 'center',
              border: '1px solid #DBD6D6',
              background: 'white',
              borderRadius: 4,
              padding: '15px 0px',
            }}
          >
            <div style={{ textAlign: 'center', flex: 3 }}>
              <b>{studentData?.participant?.cp_marks}</b>
            </div>
            <div style={{ textAlign: 'center', flex: 3 }}>
              <b>{studentData?.avg_marks}</b>
            </div>
            <div style={{ textAlign: 'center', flex: 5, color: 'rgb(111 115 138)' }}>
              <b>{studentData?.participant?.cp_remarks}</b>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default StudentClassParticipate;
