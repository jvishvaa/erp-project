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
import { generateHeaderColspan } from './transform-report-card-data';

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

const ReportCardHeader = ({ schoolData = {}, scholastic = {}, coScholastic = {} }) => {
  const {
    school_name: schoolName,
    address,
    school_contact: schoolContact,
    school_email: schoolEmail,
    acad_session: acadSession = '2021-22',
    branch_cbse_affiliation_number: affiliationCode = '0000001211213',
  } = schoolData || {};
  const [firstRowColspan = 2, secondRowColspan = 20, thirdRowColspan = 3] =
    generateHeaderColspan(scholastic, coScholastic);

  return (
    <>
      <TableHead />
      <TableBody>
        <TableRow>
          <StyledTableCell colspan={firstRowColspan} scope='center'>
            <Box>
              <img
                src={`https://d3ka3pry54wyko.cloudfront.net/homework/Revamp%20RRS/None/2021-11-16%2020:46:19.276422/cbse_logo.png?1637075782512`}
                alt=''
                style={{ width: '160px', height: '160px', borderRadius: '50px' }}
              />
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
                  {affiliationCode && `CBSE AFFILIATION NO: ${affiliationCode}`}
                </Typography>
                {address}
                <br />
                {schoolContact && `Contact Number: ${schoolContact}`}
                <br />
                {schoolEmail && `EmailID: ${schoolEmail}`}
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
                src={
                  'https://www.orchidsinternationalschool.com/wp-content/uploads/2019/08/logo-01.png'
                }
                alt=''
                style={{ width: '160px', height: '160px', borderRadius: '50px' }}
              />
            </Box>
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default ReportCardHeader;
