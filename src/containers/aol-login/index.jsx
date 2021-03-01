/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { login } from '../../redux/actions';
import Loader from '../../components/loader/loader';

function AolLogin({ onLogin, history }) {
  const { setAlert } = useContext(AlertNotificationContext);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const erpSearch = +urlParams.get('erp');
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    if (erpSearch === 2000000002) {
      setLoading(true);
      onLogin({
        username: '2000000002',
        password: 'erp_1992',
      }).then((response) => {
        setLoading(false);
        if (response.isLogin) {
          history.push('/online-class/attend-class');
        } else {
          setLoading(false);
          setAlert('error', response.message);
        }
      });
    }
  };

  useEffect(() => {
    if (erpSearch === 2000000002) {
      handleLogin();
    }
  }, [erpSearch]);

  return <>{loading && <Loader />}</>;
}

const mapStateToProps = (state) => ({
  loginInProgress: state.auth.loginInProgress,
});

const mapDisptachToProps = (dispatch) => ({
  onLogin: (params) => {
    return dispatch(login(params));
  },
});

export default connect(mapStateToProps, mapDisptachToProps)(AolLogin);
