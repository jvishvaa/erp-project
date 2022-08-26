import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import './index.css';

export default function AssesmentReportNew({ reportCardDataNew }) {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  console.log(reportCardDataNew, selectedAcademicYear, 'reportCardDataNew');
  let data = reportCardDataNew;

  let reportData = data?.report;
  let schoolData = data?.school_info;
  let userData = data?.user_info;

  console.log(reportData, 'reportData');

  let scholasticData = _.filter(reportData, { component_type: 'SCHOLASTIC' });
  let coScholasticData = _.filter(reportData, { component_type: 'CO-SCHOLASTIC' });

  let subjectList = [];
  let scholasticHeader = [];
  var examTypeHeader = [];

  let coschSubjectList = [];
  let coschScholasticHeader = [];
  var coschSxamTypeHeader = [];

  for (let i = 0; i < scholasticData.length; i++) {
    scholasticHeader.push([scholasticData[i]?.component_name]);
    subjectList.push(scholasticData[i]?.subject_lists);
    let tempExamType = [];

    for (let j = 0; j < scholasticData[i].sub_component.length; j++) {
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

  for (let i = 0; i < coScholasticData.length; i++) {
    coschScholasticHeader.push([coScholasticData[i]?.component_name]);
    coschSubjectList.push(coScholasticData[i]?.subject_lists);
    let tempExamType = [];

    for (let j = 0; j < coScholasticData[i].sub_component.length; j++) {
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

  return (
    <React.Fragment>
      <div className='row bg-white py-2'>
        <table className='w-100'>
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
                <div className='th-24'>
                  CBSE AFFILIATION NO: {schoolData?.cbse_affiliation_code}
                </div>
                <div className='th-14 th-fw-600'>{schoolData?.address}</div>
                <div className='th-30 th-fw-600 pt-4'>ANNUAL REPORT CARD</div>
                <div className='th-20 pb-3'>
                  ACADEMIC YEAR {selectedAcademicYear?.session_year}
                </div>
              </td>
              <td width='15%' className='text-center'>
                <img
                  src={
                    'https://d3ka3pry54wyko.cloudfront.net/dev/media/logos/orchids_logo.png'
                  }
                  width={'120px'}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <table className='w-100'>
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

        <table className='w-100 mt-1 th-12'>
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
                          className={`th-width-${
                            88 / eachScholastic?.sub_component?.length + 1
                          } th-fw-600`} //calculating column width
                          colSpan={eachSem?.marks_with_subject?.length + 1}
                          style={{ backgroundColor: '#fdbf8e' }}
                        >
                          {eachSem?.sub_component_name}
                        </td>
                      );
                    })}
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
                              {subjectIndex == eachSem?.marks_with_subject.length - 1 ? (
                                <td className='th-width-12 th-fw-600 text-center'>
                                  {'Total'}
                                </td>
                              ) : null}
                            </>
                          );
                        }
                      );
                    })}
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
                              {subjectIndex == eachSem?.marks_with_subject.length - 1 ? (
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
                            )[0]?.marks_obtained;

                            return (
                              <>
                                <td
                                  className='th-width-10  text-center'
                                  style={{ backgroundColor: '#ffffff' }}
                                >
                                  {subMarks}
                                </td>
                                {/* Inserting Total marks column for each semester */}
                                {j == eachSem?.marks_with_subject.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.subject_wise_secured_marks[subjectIndex]}
                                  </td>
                                ) : null}
                              </>
                            );
                          });
                        })}
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
                            colSpan={examTypeHeader[i][x].length}
                          >
                            {'Out Of 500'}
                          </td>
                          <td className='th-width-12 th-fw-600 text-center'>
                            {eachSem.total_secured_marks}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                  {/* Total End */}

                  {/* Grading point descriptions Start */}
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        examTypeHeader[i]?.flat().length + scholasticHeader[i].length + 1
                      } //exam type length + Tot. column + subject column
                    >
                      {eachScholastic?.grade_description}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        examTypeHeader[i]?.flat().length + scholasticHeader[i].length + 1
                      } //exam type length + Tot. column + subject column
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

        <table className='w-100 mt-1 th-12'>
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
                          className={`th-width-${
                            88 / eachScholastic?.sub_component?.length + 1
                          } th-fw-600`} //calculating column width
                          colSpan={eachSem?.marks_with_subject?.length + 1}
                          style={{ backgroundColor: '#fdbf8e' }}
                        >
                          {eachSem?.sub_component_name}
                        </td>
                      );
                    })}
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
                              {subjectIndex == eachSem?.marks_with_subject.length - 1 ? (
                                <td className='th-width-12 th-fw-600 text-center'>
                                  {'Total'}
                                </td>
                              ) : null}
                            </>
                          );
                        }
                      );
                    })}
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
                              {subjectIndex == eachSem?.marks_with_subject.length - 1 ? (
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

                  {subjectList[coI]?.map((x, subjectIndex) => {
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
                            )[0]?.marks_obtained;

                            return (
                              <>
                                <td
                                  className='th-width-10  text-center'
                                  style={{ backgroundColor: '#ffffff' }}
                                >
                                  {subMarks}
                                </td>
                                {/* Inserting Total marks column for each semester */}
                                {j == eachSem?.marks_with_subject.length - 1 ? (
                                  <td
                                    className='th-width-12 text-center'
                                    style={{ backgroundColor: '#ffffff' }}
                                  >
                                    {eachSem?.subject_wise_secured_marks[subjectIndex]}
                                  </td>
                                ) : null}
                              </>
                            );
                          });
                        })}
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
                            colSpan={coschSxamTypeHeader[coI][x].length}
                          >
                            {'Out Of 500'}
                          </td>
                          <td className='th-width-12 th-fw-600 text-center'>
                            {eachSem.total_secured_marks}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                  {/* Total End */}

                  {/* Grading point descriptions Start */}
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        coschSxamTypeHeader[coI]?.flat().length +
                        scholasticHeader[coI].length +
                        1
                      } //exam type length + Tot. column + subject column
                    >
                      {eachScholastic?.grade_description}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ backgroundColor: '#ffffff', fontStyle: 'italic' }}
                      colSpan={
                        coschSxamTypeHeader[coI]?.flat().length +
                        scholasticHeader[coI].length +
                        1
                      } //exam type length + Tot. column + subject column
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
      </div>
    </React.Fragment>
  );
}
