/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import 'jspdf-autotable';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import EypReportCardPdf from './eypPdf';

const EypReportCard = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

  const getEypReprtData = (params = {}) => {
    let obj = {};
    obj.acad_session_id = props.acadSessionId;
    obj.grade_id = props.gradeId;
    obj.erp_id = props.erpId;
    setLoading(true);
    axiosInstance
      .get(`${endpoints.assessmentReportTypes.eypReportCard}`, { params: { ...obj } })
      .then((response) => {
        if (response?.data) {
          EypReportCardPdf(response?.data?.result, props.branchName);
        }
        setLoading(false);
      })
      .catch((err) => {
        setAlert('error', err?.response?.data?.message);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <Button variant='contained' color='primary'>
          Please Wait... <CircularProgress color='#ffffff' size={20} />
        </Button>
      ) : (
        <Button variant='contained' color='primary' onClick={() => getEypReprtData()}>
          View EYP Report
        </Button>
      )}
    </>
  );
};

export default EypReportCard;
