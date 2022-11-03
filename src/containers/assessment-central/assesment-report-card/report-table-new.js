import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import './index.css';

export default function AssesmentReportNew({ reportCardDataNew }) {
  const [pricipalSignData, setPricipalSignData] = useState([]);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchPrincipalSignature({
      branch_id: selectedBranch?.branch?.id,
    });
  }, [reportCardDataNew]);

  const fetchPrincipalSignature = (params = {}) => {
    axios
      .get(`${endpoints.principalSign}`, {
        params: { ...params },
      })
      .then((response) => {
        if (response.status === 200) {
          setPricipalSignData(response?.data);
        }
      })
      .catch((error) => {});
  };

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  let data = reportCardDataNew;

  let reportData = data?.report;
  let schoolData = data?.school_info;
  let userData = data?.user_info;
  let ptsd_data = [data?.ptsd_data];
  let teacherRemarks = data?.teacher_remarks;
  console.log(reportData, 'reportData');

  let scholasticData = _.filter(reportData, { component_type: 'SCHOLASTIC' });
  let coScholasticData = _.filter(reportData, { component_type: 'CO-SCHOLASTIC' });

  let subjectList = [];
  let scholasticHeader = [];
  var examTypeHeader = [];

  let coschSubjectList = [];
  let coschScholasticHeader = [];
  var coschSxamTypeHeader = [];

  for (let i = 0; i < scholasticData?.length; i++) {
    scholasticHeader.push([scholasticData[i]?.component_name]);
    subjectList.push(scholasticData[i]?.subject_lists);
    let tempExamType = [];

    for (let j = 0; j < scholasticData[i].sub_component?.length; j++) {
      scholasticHeader[i].push(scholasticData[i].sub_component[j]?.sub_component_name);

      tempExamType.push(
        _.map(scholasticData[i].sub_component[j]?.marks_with_subject, 'column_text')
      );

      for (let x = 0; x < subjectList?.length; x++) {
        let arr1 = [];
        for (
          let k = 0;
          k < scholasticData[i].sub_component[j]?.marks_with_subject?.length;
          k++
        ) {
          arr1.push(scholasticData[i].sub_component[j]?.marks_with_subject[k]?.marks[x]);
        }
      }
    }

    examTypeHeader.push(tempExamType);
  }

  for (let i = 0; i < coScholasticData?.length; i++) {
    coschScholasticHeader.push([coScholasticData[i]?.component_name]);
    coschSubjectList.push(coScholasticData[i]?.subject_lists);
    let tempExamType = [];

    for (let j = 0; j < coScholasticData[i].sub_component?.length; j++) {
      coschScholasticHeader[i].push(
        coScholasticData[i].sub_component[j]?.sub_component_name
      );

      tempExamType.push(
        _.map(coScholasticData[i].sub_component[j]?.marks_with_subject, 'column_text')
      );

      for (let x = 0; x < subjectList?.length; x++) {
        let arr1 = [];
        for (
          let k = 0;
          k < coScholasticData[i].sub_component[j]?.marks_with_subject?.length;
          k++
        ) {
          arr1.push(
            coScholasticData[i].sub_component[j]?.marks_with_subject[k]?.marks[x]
          );
        }
      }
    }

    coschSxamTypeHeader.push(tempExamType);
  }

  let x = ptsd_data[0]?.data?.map((item) => {
    return item.question_data;
  });
  let questionData = ptsd_data[0]?.data[0]?.question_data;
  let n = x[0]?.length - x?.length;
  let finalPtsdData = [];

  for (let i = 0; i < questionData?.length; i++) {
    let subset = [];
    for (let j = 0; j < questionData?.length - n; j++) {
      subset.push(x[j][i]);
    }
    finalPtsdData.push(subset);
  }

  return (
    <React.Fragment>
      <div className='row bg-white py-2 px-2'>
        <table className='w-100 th-report-table mb-2'>
          <tbody>
            <tr>
              <td width='15%' className='text-center'>
                <img
                  className='text-center'
                  src={
                    'https://d3ka3pry54wyko.cloudfront.net/homework/Revamp%20RRS/None/2021-11-16%2020:46:19.276422/cbse_logo.png?1637075782512'
                  }
                  width={'120px'}
                />
              </td>
              <td width='70%' className='text-center'>
                {schoolData?.cbse_affiliation_code ? (
                  <div className='th-24'>
                    CBSE AFFILIATION NO: {schoolData?.cbse_affiliation_code}
                  </div>
                ) : null}
                <div className='th-14 th-fw-600'>{schoolData?.address}</div>
                <div className='th-30 th-fw-600 pt-4'>ANNUAL REPORT CARD</div>
                <div className='th-20 pb-3'>
                  ACADEMIC YEAR {selectedAcademicYear?.session_year}
                </div>
              </td>
              <td width='15%' className='text-center'>
                <img
                  src={`https://d3ka3pry54wyko.cloudfront.net/${schoolData?.branch_logo}`}
                  width={'120px'}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table className='w-100 th-report-table '>
          {/* Student details */}
          <tbody className='th-table-border th-12'>
            <tr>
              <td className='th-fw-600 th-width-12'>STUDENT'S NAME</td>
              <td className='th-width-33 text-uppercase'>{userData?.name}</td>
              <td className='th-width-12 th-fw-600'>ERP CODE</td>
              <td className='th-width-33 text-uppercase'>{userData?.erp_id}</td>
              <td rowSpan={4} className='th-width-10 text-center'>
                <img src={userData?.profile_img} width={'90px'} />
              </td>
            </tr>
            <tr>
              <td colSpan={1} className='th-fw-600'>
                MOTHER'S NAME
              </td>
              <td className='text-uppercase' colSpan={1}>
                {userData?.mother_name}
              </td>
              <td colSpan={1} className='th-fw-600'>
                GRADE / DIV.
              </td>
              <td className='text-uppercase' colSpan={1}>
                {userData?.grade}
              </td>
            </tr>
            <tr>
              <td colSpan={1} className='th-fw-600'>
                FATHER'S NAME
              </td>
              <td colSpan={1} className='text-uppercase'>
                {userData?.father_name}
              </td>
              <td colSpan={1} className='th-fw-600'>
                DATE OF BIRTH
              </td>
              <td colSpan={1}>{userData?.dob}</td>
            </tr>
            <tr>
              <td colSpan={1} className='th-fw-600'>
                ATTENDANCE
              </td>
              <td colSpan={1} className='text-uppercase'>
                {userData?.attendance_fraction}
              </td>
              <td colSpan={1} className='th-fw-600'>
                % ATTENDANCE
              </td>
              <td colSpan={1}>{userData?.attendance_percentage}</td>
            </tr>
          </tbody>
        </table>

        {/* Scholastic exam */}

        <table className='w-100 mt-1 th-12 th-report-table '>
          <tbody className='th-table-border'>
            {scholasticData?.map((eachScholastic, i) => {
              return (
                <>
                  {/* Scholastic Semester Header Start */}
                  <tr className='text-center'>
                    <td
                      className='th-width-12 th-fw-600'
                      style={{ backgroundColor: '#fdbf8e' }}
                    >
                      {eachScholastic?.component_name}
                    </td>
                    {eachScholastic?.sub_component?.map((eachSem) => {
                      return (
                        <td
                          className={`th-fw-600`}
                          colSpan={eachSem?.marks_with_subject?.length + 4}
                          style={{
                            backgroundColor: '#fdbf8e',
                            width: `${72 / eachScholastic?.sub_component?.length}%`,
                          }} //calculating column width
                        >
                          {eachSem?.sub_component_name}
                        </td>
                      );
                    })}
                    {eachScholastic?.sub_component?.length > 1 ? (
                      <td
                        className='th-width-16 th-fw-600'
                        colSpan={4}
                        style={{ backgroundColor: '#fdbf8e' }}
                      >
                        ANNUAL SCORE / GRADE
                      </td>
                    ) : null}
                  </tr>
                  {/* Scholastic Semester Header End */}
                  {/* Subject/Exam type Header Start */}
                  <tr>
                    <td className='th-width-12 th-fw-600'>{'Subject'}</td>
                    {eachScholastic?.sub_component?.map((eachSem) => {
                      return eachSem?.marks_with_subject?.map(
                        (eachSubject, subjectIndex) => {
                          return (
                            <>
                              <td className='th-width-8 th-fw-600 text-center'>
                                {eachSubject?.column_text}
                              </td>

                              {/* Inserting Total marks column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td className='th-width-10 th-fw-600 text-center'>
                                  {'Total'}
                                </td>
                              ) : null}

                              {/* Inserting Grade column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td
                                  className='th-width-12 th-fw-600 text-center'
                                  rowSpan={2}
                                >
                                  {'Grade'}
                                </td>
                              ) : null}

                              {/* Inserting OSR column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td
                                  className='th-width-12 th-fw-600 text-center'
                                  rowSpan={2}
                                >
                                  {'OSR'}
                                </td>
                              ) : null}

                              {/* Inserting AIR column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td
                                  className='th-width-12 th-fw-600 text-center'
                                  rowSpan={2}
                                >
                                  {'AIR'}
                                </td>
                              ) : null}
                            </>
                          );
                        }
                      );
                    })}
                    {/* Inserting Anuual column for each semester */}
                    {eachScholastic?.sub_component?.length > 1 ? (
                      <>
                        {' '}
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'(T1 +T2)/2'}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'Grade'}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'OSR'}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'AIR'}
                        </td>
                      </>
                    ) : null}
                  </tr>
                  {/* Subject/Exam type Header End */}
                  {/* Weightage Header Start */}
                  <tr>
                    <td className='th-width-12 th-fw-600'>{'WEIGHTAGE(%)'}</td>
                    {eachScholastic?.sub_component?.map((eachSem) => {
                      return eachSem?.marks_with_subject?.map(
                        (eachSubject, subjectIndex) => {
                          return (
                            <>
                              <td className='th-width-10 th-fw-600 text-center'>
                                {eachSubject?.weightage}
                              </td>
                              {/* Inserting Total marks column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td className='th-width-12 th-fw-600 text-center'>
                                  {eachSem?.total_weightage}
                                </td>
                              ) : null}
                            </>
                          );
                        }
                      );
                    })}
                  </tr>
                  {/* Weightage Header End */}
                  {/* Subject With Marks Start */}

                  {subjectList[i]?.map((x, subjectIndex) => {
                    return (
                      <tr>
                        <td className='th-fw-600' style={{ backgroundColor: '#ffffff' }}>
                          {x.subject_name}
                        </td>
                        {eachScholastic?.sub_component?.map((eachSem, i) => {
                          return eachSem?.marks_with_subject?.map((eachExam, j) => {
                            let subMarks = eachExam?.marks?.filter(
                              (eachMarks, marksIndex) => {
                                return eachMarks?.subject?.id === x.id;
                              }
                            )[0]?.normalized_marks;

                            return (
                              <>
                                <td
                                  className='th-width-10  text-center'
                                  style={{ backgroundColor: '#ffffff' }}
                                >
                                  {subMarks}
                                </td>
                                {/* Inserting Total marks column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.subject_wise_secured_marks[subjectIndex]}
                                  </td>
                                ) : null}
                                {/* Inserting Total Grade column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.grade[subjectIndex]}
                                  </td>
                                ) : null}
                                {/* Inserting Total OSR column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.OSR[subjectIndex]}
                                  </td>
                                ) : null}
                                {/* Inserting Total AIR column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.AIR[subjectIndex]}
                                  </td>
                                ) : null}
                              </>
                            );
                          });
                        })}
                        {/* avg */}
                        {eachScholastic?.sub_component?.length > 1 ? (
                          <>
                            {' '}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.marks[subjectIndex]}
                            </td>
                            {/* Avg Grade */}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.grade[subjectIndex]}
                            </td>
                            {/* Avg OSR */}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.OSR[subjectIndex]}
                            </td>
                            {/* Avg AIR */}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.AIR[subjectIndex]}
                            </td>
                          </>
                        ) : null}
                      </tr>
                    );
                  })}

                  {/* Total Start */}
                  <tr>
                    <td className='th-width-12 th-fw-600'>{'Total'}</td>
                    {eachScholastic?.sub_component?.map((eachSem, x) => {
                      return (
                        <>
                          <td
                            className='th-width-10 th-fw-600 text-center'
                            colSpan={examTypeHeader[i][x].length + 1}
                          >
                            {eachSem.total_secured_marks} out of {eachSem.total_marks} (
                            {isNaN(eachSem?.total_marks_percentage)
                              ? eachSem?.total_marks_percentage
                              : eachSem?.total_marks_percentage?.toFixed(2)}
                            %)
                          </td>
                          <td className='th-width-12 th-fw-600 text-center'>
                            {eachSem.total_grade}
                          </td>
                          <td className='th-width-12 th-fw-600 text-center'>{}</td>
                          <td className='th-width-12 th-fw-600 text-center'>{}</td>
                        </>
                      );
                    })}
                    {eachScholastic?.sub_component?.length > 1 ? (
                      <>
                        <td className='th-width-12 th-fw-600 text-center'>
                          {_.sum(
                            eachScholastic?.sub_component.map((item) => {
                              return item.total_secured_marks;
                            })
                          ) / eachScholastic?.sub_component?.length}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center'>{''}</td>
                        <td className='th-width-12 th-fw-600 text-center'>{''}</td>
                        <td className='th-width-12 th-fw-600 text-center'>{''}</td>
                      </>
                    ) : null}
                  </tr>
                  {/* Total End */}

                  {/* Grading point descriptions Start */}
                  <tr index={eachScholastic?.sub_component?.length}>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        eachScholastic?.sub_component?.length > 1
                          ? examTypeHeader[i]?.flat().length +
                            scholasticHeader[i].length +
                            (3 * eachScholastic?.sub_component?.length + 5)
                          : examTypeHeader[i]?.flat().length +
                            scholasticHeader[i].length +
                            3
                      } //exam type length + Tot. column + grade+osr+air+ 4 col of annual+ subject column
                    >
                      {eachScholastic?.grade_description}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        eachScholastic?.sub_component?.length > 1
                          ? examTypeHeader[i]?.flat().length +
                            scholasticHeader[i].length +
                            (3 * eachScholastic?.sub_component?.length + 5)
                          : examTypeHeader[i]?.flat().length +
                            scholasticHeader[i].length +
                            3
                      } //exam type length + Tot. column + grade+osr+air+ 4 col of annual+ subject column
                    >
                      {eachScholastic?.component_description}
                    </td>
                  </tr>
                  {/* Grading point descriptions End */}
                </>
              );
            })}
          </tbody>
        </table>

        {/* Co Scholastic exam */}

        <table className='w-100 mt-1 th-12 th-report-table '>
          <tbody className='th-table-border'>
            {coScholasticData?.map((eachScholastic, coI) => {
              return (
                <>
                  {/* Scholastic Semester Header Start */}
                  <tr className='text-center'>
                    <td
                      className='th-width-12 th-fw-600'
                      style={{ backgroundColor: '#fdbf8e' }}
                    >
                      {eachScholastic?.component_name}
                    </td>
                    {eachScholastic?.sub_component?.map((eachSem) => {
                      return (
                        <td
                          className={`th-fw-600`} //calculating column width
                          colSpan={eachSem?.marks_with_subject?.length + 4}
                          style={{
                            backgroundColor: '#fdbf8e',
                            width: `${72 / eachScholastic?.sub_component?.length}%`,
                          }}
                        >
                          {eachSem?.sub_component_name}
                        </td>
                      );
                    })}
                    {eachScholastic?.sub_component?.length > 1 ? (
                      <td
                        className='th-width-16 th-fw-600'
                        colSpan={4}
                        style={{ backgroundColor: '#fdbf8e' }}
                      >
                        ANNUAL SCORE / GRADE
                      </td>
                    ) : null}
                  </tr>
                  {/* Scholastic Semester Header End */}
                  {/* Subject/Exam type Header Start */}
                  <tr>
                    <td className='th-width-12 th-fw-600'>{'Subject'}</td>
                    {eachScholastic?.sub_component?.map((eachSem) => {
                      return eachSem?.marks_with_subject?.map(
                        (eachSubject, subjectIndex) => {
                          return (
                            <>
                              <td className='th-width-10 th-fw-600 text-center'>
                                {eachSubject?.column_text}
                              </td>

                              {/* Inserting Total marks column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td className='th-width-12 th-fw-600 text-center'>
                                  {'Total'}
                                </td>
                              ) : null}
                              {/* Inserting Grade column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td
                                  className='th-width-12 th-fw-600 text-center'
                                  rowSpan={2}
                                >
                                  {'Grade'}
                                </td>
                              ) : null}

                              {/* Inserting OSR column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td
                                  className='th-width-12 th-fw-600 text-center'
                                  rowSpan={2}
                                >
                                  {'OSR'}
                                </td>
                              ) : null}

                              {/* Inserting AIR column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td
                                  className='th-width-12 th-fw-600 text-center'
                                  rowSpan={2}
                                >
                                  {'AIR'}
                                </td>
                              ) : null}
                            </>
                          );
                        }
                      );
                    })}
                    {/* Inserting Anuual column for each semester */}
                    {eachScholastic?.sub_component?.length > 1 ? (
                      <>
                        {' '}
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'(T1 +T2)/2'}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'Grade'}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'OSR'}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center' rowSpan={2}>
                          {'AIR'}
                        </td>
                      </>
                    ) : null}
                  </tr>
                  {/* Subject/Exam type Header End */}
                  {/* Weightage Header Start */}
                  <tr>
                    <td className='th-width-12 th-fw-600'>{'WEIGHTAGE(%)'}</td>
                    {eachScholastic?.sub_component?.map((eachSem) => {
                      return eachSem?.marks_with_subject?.map(
                        (eachSubject, subjectIndex) => {
                          return (
                            <>
                              <td className='th-width-10 th-fw-600 text-center'>
                                {eachSubject?.weightage}
                              </td>
                              {/* Inserting Total marks column for each semester */}
                              {subjectIndex == eachSem?.marks_with_subject?.length - 1 ? (
                                <td className='th-width-12 th-fw-600 text-center'>
                                  {eachSem?.total_weightage}
                                </td>
                              ) : null}
                            </>
                          );
                        }
                      );
                    })}
                  </tr>
                  {/* Weightage Header End */}
                  {/* Subject With Marks Start */}

                  {coschSubjectList[coI]?.map((x, subjectIndex) => {
                    return (
                      <tr>
                        <td className='th-fw-600' style={{ backgroundColor: '#ffffff' }}>
                          {x.subject_name}
                        </td>
                        {eachScholastic?.sub_component?.map((eachSem, i) => {
                          return eachSem?.marks_with_subject?.map((eachExam, j) => {
                            let subMarks = eachExam?.marks?.filter(
                              (eachMarks, marksIndex) => {
                                return eachMarks?.subject?.id === x.id;
                              }
                            )[0]?.normalized_marks;

                            return (
                              <>
                                <td
                                  className='th-width-10  text-center'
                                  style={{ backgroundColor: '#ffffff' }}
                                >
                                  {subMarks ? subMarks : 'NA'}
                                </td>
                                {/* Inserting Total marks column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.subject_wise_secured_marks[subjectIndex]}
                                  </td>
                                ) : null}
                                {/* Inserting Total Grade column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.grade[subjectIndex]}
                                  </td>
                                ) : null}
                                {/* Inserting Total OSR column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.OSR[subjectIndex]}
                                  </td>
                                ) : null}
                                {/* Inserting Total AIR column for each semester */}
                                {j == eachSem?.marks_with_subject?.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.AIR[subjectIndex]}
                                  </td>
                                ) : null}
                              </>
                            );
                          });
                        })}
                        {/* avg */}
                        {eachScholastic?.sub_component?.length > 1 ? (
                          <>
                            {' '}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.marks[subjectIndex]}
                            </td>
                            {/* Avg Grade */}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.grade[subjectIndex]}
                            </td>
                            {/* Avg OSR */}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.OSR[subjectIndex]}
                            </td>
                            {/* Avg AIR */}
                            <td
                              className='th-width-10  text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachScholastic?.annual_score?.AIR[subjectIndex]}
                            </td>
                          </>
                        ) : null}
                      </tr>
                    );
                  })}

                  {/* Total Start */}
                  <tr>
                    <td className='th-width-12 th-fw-600'>{'Total'}</td>
                    {eachScholastic?.sub_component?.map((eachSem, x) => {
                      return (
                        <>
                          <td
                            className='th-width-10 th-fw-600 text-center'
                            colSpan={coschSxamTypeHeader[coI][x].length + 1}
                          >
                            {eachSem.total_secured_marks} out of {eachSem.total_marks} (
                            {isNaN(eachSem?.total_marks_percentage)
                              ? eachSem?.total_marks_percentage
                              : eachSem?.total_marks_percentage?.toFixed(2)}
                            %)
                          </td>
                          <td className='th-width-12 th-fw-600 text-center'>
                            {eachSem.total_grade}
                          </td>
                          <td className='th-width-12 th-fw-600 text-center'>{}</td>
                          <td className='th-width-12 th-fw-600 text-center'>{}</td>
                        </>
                      );
                    })}
                    {eachScholastic?.sub_component?.length > 1 ? (
                      <>
                        {' '}
                        <td className='th-width-12 th-fw-600 text-center'>
                          {_.sum(
                            eachScholastic?.sub_component.map((item) => {
                              return item.total_secured_marks;
                            })
                          ) / eachScholastic?.sub_component?.length}
                        </td>
                        <td className='th-width-12 th-fw-600 text-center'>{''}</td>
                        <td className='th-width-12 th-fw-600 text-center'>{''}</td>
                        <td className='th-width-12 th-fw-600 text-center'>{''}</td>
                      </>
                    ) : null}
                  </tr>
                  {/* Total End */}

                  {/* Grading point descriptions Start */}
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        eachScholastic?.sub_component?.length > 1
                          ? coschSxamTypeHeader[coI]?.flat().length +
                            coschScholasticHeader[coI].length +
                            (3 * eachScholastic?.sub_component?.length + 5)
                          : coschSxamTypeHeader[coI]?.flat().length +
                            coschScholasticHeader[coI].length +
                            3
                      } //exam type length + Tot. column + grade+osr+air+ 4 col of annual+ subject column
                    >
                      {eachScholastic?.grade_description}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        eachScholastic?.sub_component?.length > 1
                          ? coschSxamTypeHeader[coI]?.flat().length +
                            coschScholasticHeader[coI].length +
                            (3 * eachScholastic?.sub_component?.length + 5)
                          : coschSxamTypeHeader[coI]?.flat().length +
                            coschScholasticHeader[coI].length +
                            3
                      } //exam type length + Tot. column + grade+osr+air+ 4 col of annual+ subject column
                    >
                      {eachScholastic?.component_description}
                    </td>
                  </tr>
                  {/* Grading point descriptions End */}
                </>
              );
            })}
          </tbody>
        </table>

        {/* PTSD */}

        {data?.ptsd_data?.data?.length > 0 ? (
          <table className='w-100 mt-1 th-12 th-report-table '>
            <tbody className='th-table-border'>
              {ptsd_data?.map((eachPtsd, i) => {
                return (
                  <>
                    {/* Scholastic Semester Header Start */}
                    <tr className='text-center'>
                      {eachPtsd?.data?.map((eachSem) => {
                        return (
                          <>
                            {' '}
                            <td
                              className={`th-fw-600 text-uppercase`}
                              // colSpan={eachSem?.marks_with_subject?.length}
                              style={{
                                backgroundColor: '#fdbf8e',
                                width: `${72 / eachPtsd?.data?.length}%`,
                              }} //calculating column width
                            >
                              PERSONALITY TRAIT AND SELF DISCIPLINE ({eachSem?.term})
                            </td>
                            <td
                              className={`th-fw-600`}
                              style={{
                                backgroundColor: '#fdbf8e',
                              }}
                            >
                              Grade
                            </td>
                          </>
                        );
                      })}
                      {eachPtsd?.data?.length > 1 ? (
                        <td
                          className='th-width-16 th-fw-600'
                          style={{ backgroundColor: '#fdbf8e' }}
                        >
                          ANNUAL SCORE / GRADE
                        </td>
                      ) : null}
                    </tr>

                    {finalPtsdData?.map((eachSem, i) => {
                      return (
                        <tr>
                          {eachSem?.map((eachQues, j) => {
                            return (
                              <>
                                {' '}
                                <td
                                  className='th-width-8 text-left td-p-mb-0'
                                  style={{ backgroundColor: '#ffffff' }}
                                  dangerouslySetInnerHTML={{
                                    __html: eachQues?.question_name,
                                  }}
                                >
                                  {/* {eachQues?.question_name} */}
                                </td>
                                <td
                                  className='th-width-8 th-fw-600 text-center'
                                  style={{ backgroundColor: '#ffffff' }}
                                >
                                  {eachQues?.grade}
                                </td>
                              </>
                            );
                          })}
                          {eachPtsd?.data?.length > 1 ? (
                            <td
                              className='th-width-8 th-fw-600 text-center'
                              style={{ backgroundColor: '#ffffff' }}
                            >
                              {eachPtsd?.annual_data?.grade[i]}
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
                    {/* Grading point descriptions Start */}
                    {eachPtsd?.grade_description ? (
                      <tr>
                        <td
                          style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                          colSpan={
                            eachPtsd?.data?.length > 1
                              ? 2 * eachPtsd?.data?.length + 1
                              : 2 * eachPtsd?.data?.length
                          }
                        >
                          {eachPtsd?.grade_description}
                        </td>
                      </tr>
                    ) : null}
                    {/* Grading point descriptions End */}
                  </>
                );
              })}
            </tbody>
          </table>
        ) : null}

        {/* Teachers Remarks */}
        <table className='w-100 mt-1 th-12 th-report-table '>
          <tbody className='th-table-border'>
            <tr>
              <td className='th-width-18 py-2 text-center th-fw-600'>
                CLASS TEACHER'S REMARK
              </td>
              <td className='th-width-82 py-2'>{teacherRemarks}</td>
            </tr>

            <tr>
              <td className='th-width-18 py-2 text-center th-fw-600'>PRINCIPAL</td>
              <td className='th-width-82 py-2'>
                {schoolData?.principal_name}
                {pricipalSignData?.length ? (
                  <span className='pl-2'>
                    <img
                      src={
                        `https://letseduvate.s3.amazonaws.com/prod/media/` +
                        pricipalSignData[0]?.principle_sign
                      }
                      width={'120px'}
                    />
                  </span>
                ) : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
