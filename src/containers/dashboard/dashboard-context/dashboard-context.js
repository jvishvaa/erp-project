import React, { useEffect, useState } from 'react';
import { apiConfig, responseConverters } from '../dashboard-constants';
import ENVCONFIG from '../../../config/config';
import axios from 'axios';

export const DashboardContext = React.createContext();

export function DashboardContextProvider({ children }) {
  const [branchIds, setBranchIds] = useState([]);
  const [reports, setReports] = useState({
    attendanceReport: [],
    classworkReport: [],
    homeworkReport: [],
    blogReport: [],
    discussionReport: [],

    loginReport: [],
    roleReport: [],
    referralReport: [],
    refreshAll: false,
  });
  const [card, setCard] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    apiGateway: { msReportsUrl },
  } = ENVCONFIG || {};
  const {
    token: TOKEN = '',
    user_level = 0,
    is_superuser = false,
    first_name = 'Buddy',
    personal_info: { role = '' } = {},
  } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const time = new Date().getHours();
  const welcomeDetails = {
    userLevel: user_level ? user_level : is_superuser ? 1 : '',
    name: first_name.toLowerCase(),
    userRole: role ? role : is_superuser ? 'super-admin' : '',
    greeting: time < 12 ? 'Good Morning' : time < 18 ? 'Good Afternoon' : 'Good Evening',
  };
  const { userLevel } = welcomeDetails || {};

  const headers = {
    'X-DTS-HOST': window.location.host,
    // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
    // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
    // 'X-DTS-HOST': 'dev.mit.letseduvate.com',
    Authorization: `Bearer ${TOKEN}`,
  };

  const getReport = (decisionParam, param) => {
    const params = { ...param, level: userLevel };
    const config = { headers, params };
    const url = msReportsUrl + apiConfig[decisionParam]['report'];
    setLoading(true)
    return axios
      .get(url, config)
      .then((response) => {
        const { data: { status_code: status, result } = {} } = response || {};
        setLoading(false)
        setCard('');
        return result || [];
      })
      .catch(() => { 
        setLoading(false)
        setCard('');
      });
  };

  const downloadReport = (decisionParam, param) => {
    const params = { ...param, level: userLevel };
    const config = { headers, params, responseType: 'arraybuffer' };
    const url = msReportsUrl + apiConfig[decisionParam]['download'];
    return axios
      .get(url, config)
      .then((response) => {
        return response || {};
      })
      .catch(() => { });
  };

  return (
    <DashboardContext.Provider
      value={{
        branchIds,
        setBranchIds,
        getReport,
        downloadReport,
        welcomeDetails,
        reports,
        setReports,
        card,
        setCard,
        loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardContextProvider');
  }
  return context;
}
