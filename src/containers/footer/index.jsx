import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CallIcon from '@material-ui/icons/Call';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import { IsV2Checker } from 'v2/isV2Checker';
import { useHistory } from 'react-router-dom';
const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
const isStudent = user_level == 13 ? true : false;
const isFromOrchids = window.location.host.slice(0, 7) === 'orchids' ? true : false;

function TermsAndCondition(props) {
  const history = useHistory();
  useEffect(() => {
    const forceUpdate = localStorage?.getItem('userDetails')
      ? JSON.parse(localStorage?.getItem('userDetails'))?.force_update
      : null;
    console.log(window.location.pathname, forceUpdate, 'path name');

    if (forceUpdate == 'true' || forceUpdate == 'True' || forceUpdate == true) {
      console.log(window.location.pathname == '/change-password', 'redirect');
      if (window.location.pathname != '/change-password') {
        // window.location.href = '/change-password';
        history.push('/change-password');
      }
    }
  }, []);

  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {props?.version && (
        <>
          <span style={{ textDecoration: 'none' }}>{props?.version}&nbsp;</span>|
        </>
      )}
      <Link
        style={{ cursor: 'pointer', textDecoration: 'none' }}
        onClick={() => (window.location.pathname = '/terms-condition')}
      >
        &nbsp;Terms and Conditions&nbsp;
      </Link>
      |
      <Link
        style={{ cursor: 'pointer', textDecoration: 'none' }}
        onClick={() => (window.location.pathname = '/privacy-policy')}
      >
        &nbsp;Privacy Policy
      </Link>
      .
    </Typography>
  );
}
function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright  '}
      &copy; {new Date().getFullYear()}, K12 Techno Services Pvt. Ltd.
    </Typography>
  );
}
function ContactNumber() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CallIcon />
        <Link href='tel:8888888999' style={{ marginTop: 5, textDecoration: 'none' }}>
          8888888999
        </Link>{' '}
        &nbsp; &nbsp;
      </div>
    </Typography>
  );
}

const Footer = () => {
  const isV2 = IsV2Checker();
  const appVersion = JSON.parse(sessionStorage.getItem('app_version'));
  const version = isV2 ? appVersion?.v2 : appVersion?.v1;
  const fetchVersion = () => {
    axios
      .get(`${endpoints.appVersion}`, {
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
  useEffect(() => {
    if (!appVersion) fetchVersion();
  }, [appVersion]);
  return (
    <Box p={2} width='auto'>
      <Copyright />
      <TermsAndCondition version={version} />
      {isStudent && isFromOrchids && <ContactNumber />}
    </Box>
  );
};

export default Footer;
