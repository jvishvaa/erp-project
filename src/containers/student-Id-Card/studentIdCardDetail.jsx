import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';

const StudentIdCardDetails = ({
  fullData,
  handleSelect,
  selectedItem,
  handleViewMore,
}) => {
  return (
    <>
      <Grid
        container
        spacing={1}
        className={
          (fullData && fullData.id) === (selectedItem && selectedItem.id)
            ? 'studentIdCardListCardsActive'
            : 'studentIdCardListCardsInActive'
        }
      >
        <Grid item md={12} xs={12} style={{ padding: 0 }}>
          <span className='studentIdcardLable'>
            Name:&nbsp;
            {(fullData && fullData.name) || ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: 0 }}>
          <span className='studentIdcardLable'>
            Father Name:&nbsp;&nbsp;
            {(fullData &&
              fullData.parent_details &&
              fullData.parent_details.father_name) ||
              ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: 0 }}>
          <span
            className='studentIdcardGradeLable'
            title={
              (fullData &&
                fullData.mapping_bgs &&
                fullData.mapping_bgs.length !== 0 &&
                fullData.mapping_bgs[0] &&
                fullData.mapping_bgs[0].grade &&
                fullData.mapping_bgs[0].grade.length !== 0 &&
                fullData.mapping_bgs[0].grade.map((item) =>
                  item.grade__grade_name ? item.grade__grade_name : ''
                )) ||
              ''
            }
          >
            Class:&nbsp;&nbsp;
            {(fullData &&
              fullData.mapping_bgs &&
              fullData.mapping_bgs.length !== 0 &&
              fullData.mapping_bgs[0] &&
              fullData.mapping_bgs[0].grade &&
              fullData.mapping_bgs[0].grade.length !== 0 &&
              fullData.mapping_bgs[0].grade.map((item) =>
                item.grade__grade_name ? (
                  <span key={item.grade__grade_name}>
                    {` ${item.grade__grade_name},`}
                  </span>
                ) : (
                  ''
                )
              )) ||
              ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: 0 }}>
          <span
            className='studentIdcardGradeLable'
            title={
              (fullData &&
                fullData.mapping_bgs &&
                fullData.mapping_bgs.length !== 0 &&
                fullData.mapping_bgs[0] &&
                fullData.mapping_bgs[0].section &&
                fullData.mapping_bgs[0].section.length !== 0 &&
                fullData.mapping_bgs[0].section.map((item) =>
                  item.section__section_name ? item.section__section_name : ''
                )) ||
              ''
            }
          >
            Division:&nbsp;&nbsp;
            {(fullData &&
              fullData.mapping_bgs &&
              fullData.mapping_bgs.length !== 0 &&
              fullData.mapping_bgs[0] &&
              fullData.mapping_bgs[0].section &&
              fullData.mapping_bgs[0].section.length !== 0 &&
              fullData.mapping_bgs[0].section.map((item) =>
                item.section__section_name ? (
                  <span key={item.section__section_name}>
                    {` ${item.section__section_name},`}
                  </span>
                ) : (
                  ''
                )
              )) ||
              ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ padding: 0 }}>
          <span className='studentIdcardLable'>
            Year:&nbsp;
            {(fullData &&
              fullData.academic_year &&
              fullData.academic_year.session_year) ||
              ''}
          </span>
        </Grid>
        <Grid item md={12} xs={12} style={{ textAlign: 'right', padding: 0 }}>
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={() => {
              handleSelect(fullData, 'selectedId');
              handleViewMore();
            }}
            className='studentIdcardViewMoreButton'
          >
            View More
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
StudentIdCardDetails.prototype = {
  selectedItem: PropTypes.instanceOf(Object).isRequired,
  fullData: PropTypes.instanceOf(Object).isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleViewMore: PropTypes.func.isRequired,
};

export default StudentIdCardDetails;
