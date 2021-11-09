import React from 'react';
import { Typography, Box } from '@material-ui/core';
import OrchidsLogo from '../../../assets/images/orchidsPlaceholderLogo2x.png';

const ReportCardHeader = ({ schoolData }) => {
  const {
    school_name: schoolName,
    address,
    school_contact: schoolContact,
    school_email: schoolEmail,
    acad_session: acadSession = '2021-22',
  } = schoolData || {};

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        overflowX: 'auto',
        flexWrap: 'wrap',
        textTransform: 'capitalize',
      }}
    >
      <Box>
        <img
          src={`https://seeklogo.com/images/C/cbse-logo-46D5A6B556-seeklogo.com.png`}
          alt=''
          style={{ width: '160px', height: '160px', borderRadius: '50px' }}
        />
      </Box>
      <Box>
        <Typography
          variant='h4'
          Calibri
          component='div'
          style={{
            textAlign: 'center',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          {schoolName}
        </Typography>
        <Box style={{ textAlign: 'center' }} mt={2}>
          <Typography
            variant='h6'
            Calibri
            component='div'
            style={{ textAlign: 'center' }}
          >
            CBSE AFFILIATION NO: 0000001211213
          </Typography>
          {address}
          <br />
          Contact Number: {schoolContact}
          <br />
          EmailID: {schoolEmail}
        </Box>
        <Box mt={2} mb={2}>
          <Typography
            variant='h5'
            Calibri
            component='div'
            style={{ textAlign: 'center', fontWeight: '600' }}
          >
            ANNUAL REPORT CARD
          </Typography>
          <Typography Calibri component='div' style={{ textAlign: 'center' }}>
            ACADEMIC YEAR {acadSession}
          </Typography>
        </Box>
      </Box>
      <Box>
        <img
          src={
            'https://www.orchidsinternationalschool.com/wp-content/uploads/2019/08/logo-01.png'
          }
          alt=''
          style={{ width: '160px', height: '160px', borderRadius: '50px' }}
        />
      </Box>
    </Box>
  );
};

export default ReportCardHeader;
