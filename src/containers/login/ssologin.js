import React, { useState, useEffect, useContext } from 'react';
import { useStyles } from './useStyles';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { connect } from 'react-redux';
import { login, aolLogin, isMsAPI, loginSSo } from 'redux/actions';
import axiosInstance from 'config/axios';
import axios from 'axios';
import endpoints from 'config/endpoints';
import endpointsV2 from 'v2/config/endpoints';
import { Spin, message } from 'antd';
import EduvateLogo from 'assets/images/logo.png';
import { logout } from 'redux/actions';

function LoginFormSSO(props) {
    const { onLogin, isMsAPI, aolOnLogin, setLoading, history } = props;
    const classes = useStyles();
    const [uname, pass, checked] =
        JSON.parse(localStorage.getItem('rememberDetails')) || [];
  const dispatch = useDispatch();

    const [username, setUsername] = useState('' || uname);
    const [password, setPassword] = useState('' || pass);
    const [check, setCheck] = useState(false || checked);
    const [passwordFlag, setPasswordFlag] = useState(true);
    const { setAlert } = useContext(AlertNotificationContext);
    const urlParams = new URLSearchParams(window.location.search);
    const erpSearch = urlParams.get('erp');
    const [disableLogin, setDisableLogin] = useState(false);
    const [authToken, setAuthToken] = useState(null)
    let path = window.location.pathname
    let slipttedpath = path.split('/')
    let erpID = window.atob(decodeURIComponent(slipttedpath[2])) || null
    let hmac_token = slipttedpath[3] || null
    useEffect(() => {
        if (erpID != null && hmac_token != null) {
            fetchLoginToken()
            // handleLogin()
        }
    }, [hmac_token])

    console.log(erpID, 'erp');
    // const token =
    //     window.atob(decodeURIComponent(erpID))
    // console.log(token, 'decodetok');

    useEffect(() => {
        if (authToken != null) {
            handleLogin()
        }
    }, [authToken])

    useEffect(() => {
        handleLogout()
    },[])

    const handleLogout = () => {
        dispatch(logout());
        const list = ['rememberDetails'];
        Object.keys(localStorage).forEach((key) => {
          if (!list.includes(key)) localStorage.removeItem(key);
        });
      };

    const fetchERPSystemConfig = async (status) => {
        let data = (await JSON.parse(localStorage.getItem('userDetails'))) || {};
        const branch = data?.role_details?.branch;
        let payload = [];
        const result = axiosInstance
            .get(endpoints.checkAcademicView.isAcademicView)
            .then((res) => {
                if (res?.data?.status_code === 200) {
                    if (res?.data?.result[0] == 'True') {
                        return true;
                    } else if (res?.data?.result[0] == 'False') {
                        return false;
                    } else if (res?.data?.result[0]) {
                        let resData = res?.data?.result[0];
                        const selectedId = branch?.map((el) => el?.id);
                        let checkData = resData?.some((item) => selectedId.includes(Number(item)));
                        console.log(checkData, 'check');
                        return checkData;
                    }
                }
            });
        return result;
    };
    const fetchVersion = () => {
        axios
            .get(`${endpointsV2.appVersion}`, {
                headers: {
                    'x-api-key': 'vikash@12345#1231',
                },
            })
            .then((result) => {
                if (result?.data?.status_code === 200) {
                    sessionStorage.setItem('app_version', JSON.stringify(result?.data?.result));
                }
            })
            .catch((error) => {
                console.error(error?.message);
            });
    };
    const handleLogin = () => {

        setDisableLogin(true);
        onLogin(authToken).then((response) => {
            if (response?.isLogin) {
                isMsAPI();
                fetchVersion();
                fetchERPSystemConfig(response?.isLogin).then((res) => {
                    let erpConfig;
                    let userData = JSON.parse(localStorage.getItem('userDetails'));
                    if (res === true || res.length > 0) {
                        erpConfig = res;
                        let refURL = localStorage.getItem('refURL');
                        if (refURL) {
                            localStorage.removeItem('refURL');

                            window.location.href = refURL;
                        } else if (userData?.user_level !== 4) {
                            history.push('/acad-calendar');
                        } else {
                            history.push('/dashboard');
                        }
                    } else if (res === false) {
                        erpConfig = res;
                        history.push('/dashboard');
                    } else {
                        erpConfig = res;
                        history.push('/dashboard');
                    }
                    userData['erp_config'] = erpConfig;
                    localStorage.setItem('userDetails', JSON.stringify(userData));
                    window.location.reload();
                });
            } else {
                setAlert('error', response?.message);
                setDisableLogin(false);
            }
        });
        if (check) {
            localStorage.setItem(
                'rememberDetails',
                JSON.stringify([username, password, check])
            );
        } else {
            localStorage.removeItem('rememberDetails');
        }
    };

    const handleForgot = () => {
        history.push('/forgot');
    };

    useEffect(() => {
        if (erpSearch !== null) {
            setLoading(true);
            handleLogin();
        }
    }, [erpSearch]);

    const fetchLoginToken = () => {
        let body = {
            'hmac': hmac_token,
            'erp_id': erpID
        }
        axiosInstance
            .post(`${endpoints.auth.generateLoginToken}`, body)
            .then((result) => {
                console.log(result, 'res');
                setAuthToken(result?.data?.data?.token)
            })
            .catch((error) => {
                console.error(error.response , 'err');
                if(error?.response?.status == 401){
                    message.error(error?.response?.data?.message)
                    history.push('/')
                }
            });
    };

    return (
        <div>
            <div className='th-bg-white mb-3'>
                <div className='p-2'>
                    <img src={EduvateLogo} style={{ width: '200px', height: '40px' }} />
                </div>
            </div>
            <div className='d-flex justify-content-center' >
                <div className='th-bg-white w-25 p-4 th-br-10' >
                    <div className='p-4' >
                        <div className='d-flex justify-content-center py-2' >
                            <Spin size='large' />
                        </div>
                        <div className='d-flex justify-content-center py-3'>
                            <div className='th-15 th-fw-700' >Please wait while we log you in</div>
                        </div>
                        <div className='d-flex justify-content-center py-3' >
                            <div className='th-13'>Something went wrong ? <a href='/'>Sign In here</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    loginInProgress: state.auth.loginInProgress,
});

const mapDisptachToProps = (dispatch) => ({
    onLogin: (params, isOtpLogin) => {
        return dispatch(loginSSo(params, isOtpLogin));
    },
    aolOnLogin: (params) => {
        return dispatch(aolLogin(params));
    },
    isMsAPI: () => {
        return dispatch(isMsAPI());
    },
});

export default connect(mapStateToProps, mapDisptachToProps)(LoginFormSSO);
