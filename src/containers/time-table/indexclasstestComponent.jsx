import React, { useEffect, useState } from 'react';
import Layout from '../Layout/index';
import Loading from '../../components/loader/loader';
import FilterImage from '../../assets/images/Filter_Icon.svg';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import UpperGrade from './uppergrade/upper-grade.jsx';
import DateAndCalander from './date-and-calander/date-and-calander.jsx';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../config/axios';
import TimeTableMobile from './time-table-mobile-view/time-table-mobile';
import './timetable.scss';

// let al = useMediaQuery('(min-width:800px)');
class TimeTable extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      setMobileView : true,
      tableData : [],
      Filter : true,
      acadamicYearID : 1,
      gradeID : 1,
      sectionID : 1,
      branchID : 1,
    };
  }
  componentDidMount() {
    this.callGetAPI();
  }
  componentDidUpdate(prevProps,PrevState){
    // this.callGetAPI();
    
    console.warn('calling parrent component', PrevState);
  }

  callGetAPI = async () => {
    // console.log(acadamicYearID, gradeID, sectionID, branchID, 'API');
    await axiosInstance
      .get('/academic/time_table/', {
        params: {
          academic_year_id: this.state.acadamicYearID,
          branch_id: this.state.branchID,
          grade_id: this.state.gradeID,
          section_id: this.state.sectionID,
        },
      })
      .then((responce) => {
        if (responce.status === 200) {
          // setLoading(false);
          this.setState({
            ...this.state,
            tableData : responce.data.result,
          })
        }
        console.log(responce.data.result, 'table data');
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error);
      });
  };
  handlePassData = (acadamicYear_ID, grade_ID, section_ID, branch_ID) => {
    this.setState({
      acadamicYearID : acadamicYear_ID,
      gradeID : grade_ID,
      sectionID : section_ID,
      branchID : branch_ID,
    })
  };
  handleFilter = (value) => {
    // setFilter(value);
    this.setState({
      Filter : false,
    })

  };

  render() {
    return (
      <>
        <Layout>
          {this.state.setMobileView ? (
            <>
              <div className='time-table-container'>
                <div className='time-table-breadcrums-container'>
                  <CommonBreadcrumbs componentName='Time Table' />
                  <div
                    className={
                      this.state.Filter ? 'filter-container-hidden' : 'filter-container-show'
                    }
                    onClick={() => {
                      this.handleFilter(true);
                    }}
                  >
                    <div className='table-top-header'>
                      <div className='table-header-data'>2020-2021</div>
                      <span class='dot'></span>
                      <div className='table-header-data'>Jalahalli</div>
                      <span class='dot'></span>
                      <div className='table-header-data'>Grade</div>
                      <span class='dot'></span>
                    </div>
                    <div className='filter-show'>
                      <div className='filter'>SHOW FILTER</div>
                      <img className='filterImage' src={FilterImage} />
                    </div>
                  </div>
                </div>
                {this.state.Filter ? (
                  <>
                    <UpperGrade handlePassData={this.handlePassData} />
                    <div
                      className='filter-container'
                      onClick={() => {
                        this.handleFilter(false);
                      }}
                    >
                      <div className='filter'>HIDE FILTER</div>
                      <img src={FilterImage} />
                    </div>
                    <div className='devider-top'>
                      <Divider variant='middle' />
                    </div>
                    <div className='table-top-header'>
                      <div className='table-header-data'>2020-2021</div>
                      <span class='dot'></span>
                      <div className='table-header-data'>Jalahalli</div>
                      <span class='dot'></span>
                      <div className='table-header-data'>Grade</div>
                      <span class='dot'></span>
                    </div>
                  </>
                ) : (
                  <> </>
                )}

                <div className='date-container'>
                  <DateAndCalander callGetAPI={this.callGetAPI} tableData={this.state.tableData} />
                </div>
              </div>
            </>
          ) : (
            <div className='mobile-table-view'>
              <div className='time-table-breadcrums-container'>
                <CommonBreadcrumbs componentName='Time Table' />
                <div>
                  <img className='filter-button' src={FilterImage} />
                </div>
              </div>
              <TimeTableMobile callGetAPI={this.callGetAPI} tableData={this.state.tableData} />
            </div>
          )}
          {/* {loading && <Loader />} */}
        </Layout>
      </>
    );
  }
}

export default TimeTable;
