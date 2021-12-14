import React from 'react';
import {
  Typography,
  Box,
  withStyles,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import { generateHeaderColspan } from './transform-report-card-data';
import ENVCONFIG from '../../../config/config';

const orchidsLogo =
  'https://www.orchidsinternationalschool.com/wp-content/uploads/2019/08/logo-01.png';
const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 11,
    border: 'none !important',
  },
  body: {
    fontSize: 11,
    border: 'none !important',
  },
}))(TableCell);

const ReportCardHeader = ({
  schoolData = {},
  scholastic = {},
  coScholastic = {},
  isOrchids = true,
}) => {
  const {
    school_name: schoolName,
    address,
    school_contact: schoolContact,
    school_email: schoolEmail,
    acad_session: acadSession = '2021-22',
    // affiliation_code: affiliationCode = '',
    cbse_affiliation_code: cbseAffiliationCode = '',
    branch_code: branchCode = '',
    branch_logo: branchLogo = '',
  } = schoolData || {};
  const {
    s3: { ERP_BUCKET = '' },
  } = ENVCONFIG;

  const [firstRowColspan = 2, secondRowColspan = 20, thirdRowColspan = 3] =
    generateHeaderColspan(scholastic, coScholastic, isOrchids);

  const getAffiliationNumber = () => {
    if (cbseAffiliationCode) {
      return `CBSE AFFILIATION NO: ${cbseAffiliationCode}`;
    } else if (branchCode) {
      return `SCHOOL CODE: ${branchCode}`;
    } else {
      return '';
    }
  };

  return (
    <>
      <TableHead />
      <TableBody>
        <TableRow>
          <StyledTableCell colspan={firstRowColspan} scope='center'>
            <Box>
              {cbseAffiliationCode && (
                <img
                  src={`https://d3ka3pry54wyko.cloudfront.net/homework/Revamp%20RRS/None/2021-11-16%2020:46:19.276422/cbse_logo.png?1637075782512`}
                  alt=''
                  style={{ width: '160px', height: '160px', borderRadius: '50px' }}
                />
              )}
            </Box>
          </StyledTableCell>
          <StyledTableCell colspan={secondRowColspan} scope='center'>
            <Box>
              <Typography
                variant='h4'
                Calibri
                component='div'
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                }}
              >
                {schoolName}
              </Typography>
              <Box style={{ textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                <Typography
                  variant='h6'
                  Calibri
                  component='div'
                  style={{ textAlign: 'center' }}
                >
                  {getAffiliationNumber()}
                </Typography>
                {ReactHtmlParser(address)}
                <br />
                {schoolContact && `Contact Number: ${schoolContact}`}
                <br />
                <Box style={{ textTransform: 'none' }}>
                  {schoolEmail && `Email ID : ${schoolEmail}`}
                </Box>
              </Box>
              <Box style={{ margin: '15px auto' }}>
                <Typography
                  variant='h5'
                  Calibri
                  component='div'
                  style={{ textAlign: 'center', fontWeight: '600' }}
                >
                  ANNUAL REPORT CARD
                </Typography>
                <Typography Calibri component='h4' style={{ textAlign: 'center' }}>
                  ACADEMIC YEAR {acadSession}
                </Typography>
              </Box>
            </Box>
          </StyledTableCell>
          <StyledTableCell colspan={thirdRowColspan} scope='center'>
            <Box>
              <img
                src={`${ERP_BUCKET}${branchLogo}`}
                onError={(e) => (e.target.src = orchidsLogo)}
                alt=''
                style={{ width: '100%' }}
                // style={{ width: '160px', height: '160px', borderRadius: '50px' }}
              />
            </Box>
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default ReportCardHeader;
