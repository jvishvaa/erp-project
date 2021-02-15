import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Grid } from '@material-ui/core';
import image from '../../assets/images/Male.svg';
import Logo from '../../assets/images/orchids.png';
import signatue from '../../assets/images/signature.png';
import endpoints from '../../config/endpoints';

const StudentIdCardTemplate = ({ fullData, signatureDetails }) => {
  return (
    <>
      <Grid container spacing={2} className='studentIdCardTemplete'>
        <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: 0 }}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item md={2} xs={1} />
            <Grid item md={8} xs={10} className='idCardTempleteMainLogo'>
              <img
                // src={Logo}
                src={(fullData && fullData.branch_id && fullData.branch_id.logo) || Logo}
                width='100%'
                height='50px'
                alt='crash'
              />
            </Grid>
            <Grid item md={2} xs={1} />
            {/* <Grid item md={7} xs={7} style={{ textAlign: 'left', padding: '0px' }}>
              <span className='idCardLogoName'>
                {(fullData && fullData.branch_id && fullData.branch_id.branch_name) || ''}
              </span>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} className='studentIdCardAddress'>
          <span className='studentMainIdCardAddresslable'>
            {(fullData && fullData.address && fullData.address) || ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: 0, textAlign: 'center' }}>
          <span className='studentMainIdCardLable'>
            Academic Year:&nbsp;
            {(fullData &&
              fullData.academic_year &&
              fullData.academic_year.session_year) ||
              ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: 0, textAlign: 'center' }}>
          <img
            src={(fullData && fullData.profile && fullData.profile) || image}
            width='40%'
            className='idCardStudentLogo'
            height='100px'
            alt='crash'
          />
        </Grid>
        <Grid item md={12} xs={12} className='studentIdCardName'>
          <Grid container spacing={0} style={{ padding: 0 }}>
            <Grid item md={5} xs={5} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>Student Name</span>
            </Grid>
            <Grid item md={7} xs={7} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData && fullData.name) || ''}
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} xs={5} className='studentIdCardCell'>
          <Grid container spacing={0} style={{ padding: 0 }}>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>Father Name</span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>Enrollment Code</span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>Grade</span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>Section</span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>Contact</span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>DOB</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={7} xs={7} className='studentIdCardCell'>
          <Grid container spacing={0} style={{ padding: 0 }}>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData &&
                  fullData.parent_details &&
                  fullData.parent_details.father_name) ||
                  ''}
              </span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData && fullData.erp_id && fullData.erp_id) || ''}
              </span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData &&
                  fullData.mapping_bgs &&
                  fullData.mapping_bgs.length !== 0 &&
                  fullData.mapping_bgs[0] &&
                  fullData.mapping_bgs[0].grade &&
                  fullData.mapping_bgs[0].grade.length !== 0 &&
                  fullData.mapping_bgs[0].grade.map((item) =>
                    item.grade__grade_name ? (
                      <span key={item.grade__grade_name}>
                        {`${item.grade__grade_name}`}
                      </span>
                    ) : (
                      ''
                    )
                  )) ||
                  ''}
              </span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData &&
                  fullData.mapping_bgs &&
                  fullData.mapping_bgs.length !== 0 &&
                  fullData.mapping_bgs[0] &&
                  fullData.mapping_bgs[0].section &&
                  fullData.mapping_bgs[0].section.length !== 0 &&
                  fullData.mapping_bgs[0].section.map((item) =>
                    item.section__section_name ? (
                      <span key={item.section__section_name}>
                        {`${item.section__section_name}`}
                      </span>
                    ) : (
                      ''
                    )
                  )) ||
                  ''}
              </span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData && fullData.contact && fullData.contact) || ''}
              </span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: 0 }}>
              <span className='studentMainIdCardLable'>
                :&nbsp;
                {(fullData && fullData.date_of_birth && fullData.date_of_birth) || ''}
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} className='studentIdCardAddress'>
          <span className='studentMainIdCardAddresslable'>
            Address:&nbsp;
            {(fullData && fullData.parent_details && fullData.parent_details.address) ||
              ''}
          </span>
        </Grid>
        <Grid item md={8} xs={8} />
        <Grid item md={4} xs={4} style={{ padding: 0, textAlign: 'center' }}>
          <img
            src={
              `${endpoints.signature.s3}${
                signatureDetails && signatureDetails.signature
              }` || signatue
            }
            alt='crash'
            className='signatureViewinIdCardTemplate'
          />
          <br />
          <span className='studentMainIdCardLable'>Principal</span>
        </Grid>
      </Grid>
    </>
  );
};
StudentIdCardTemplate.propTypes = {
  fullData: PropTypes.instanceOf(Object).isRequired,
  signatureDetails: PropTypes.instanceOf(Object).isRequired,
};
export default StudentIdCardTemplate;
