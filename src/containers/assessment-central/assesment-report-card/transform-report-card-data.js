const getSubjectWiseMarks = (marks, categoryKeys) => {
  const length = categoryKeys?.length || 0;
  const subjectWiseMarks = Array.from({ length }, (element, index) => ({
    id: categoryKeys[index],
    value: '',
  }));
  categoryKeys.forEach((key) => {
    subjectWiseMarks.forEach(({ id }, index, arr) =>
      key === id ? (arr[index]['value'] = marks[+key]) : null
    );
  });
  const marksList = subjectWiseMarks.map(({ value = '' }) => value);
  // const subjectWiseMarks = Array.from({ length }, () => '');
  // Object.entries(marks).forEach(([key, value]) => (subjectWiseMarks[key - 1] = value));
  return marksList;
};

const generateSemesterMarks = (subjectWiseMarks, categoryKeys) => {
  return Object.values(subjectWiseMarks).map(
    ({ air = '', grade = '', osr = '', total = '', marks = {} }) => [
      ...getSubjectWiseMarks(marks, categoryKeys),
      total,
      grade,
      osr,
      air,
    ]
  );
};

const generateSemesterOneTwo = (termDetails) => {
  const transformedTermDetails = Object.values(termDetails).map(
    ({
      final_grade: finalGrade = '',
      name: semester = '',
      subject_marks: subjectMarks = {},
      out_of_total: outOfTotal = '',
      total_obtained: totalObtained = '',
      overall_remark: overallRemark = '',
    }) => ({
      finalGrade,
      semester,
      outOfTotal,
      totalObtained,
      subjectMarks,
      overallRemark,
    })
  );
  const [semesterOne = {}, semesterTwo = {}] = transformedTermDetails || [];

  return { semesterOne, semesterTwo };
};

/*transforming categoryMap as per usage*/
const generateCategoryMap = (categoryMap) => {
  const transformedCategoryType = Object.entries(categoryMap).map(
    ([
      key,
      { assessment_type: assessmentType = '', name: category = '', weight = '' },
    ]) => ({
      key,
      assessmentType,
      category,
      weight,
    })
  );

  const categoryKeys = [...transformedCategoryType.map(({ key }) => key)];

  //category headers
  const categoryRow = [...transformedCategoryType.map(({ category }) => category)];

  const constantHeaders = ['Grade', 'OSR', 'AIR'];

  //totalWeight added in weight row below
  const totalWeight = transformedCategoryType.reduce(
    (total, { weight }) => total + weight,
    0
  );
  //weight row data
  const weightRow = [...transformedCategoryType.map(({ weight }) => weight), totalWeight];

  //category-assessmentType data
  const categoryAssessmentType = [
    ...transformedCategoryType.map(
      ({ category = '', assessmentType = [] }) =>
        `${category}-${
          Array.isArray(assessmentType) ? assessmentType.join('/') : assessmentType
        }`
    ),
  ].join(', ');
  return {
    categoryKeys,
    categoryRow,
    constantHeaders,
    weightRow,
    categoryAssessmentType,
  };
};

/*transforming termDetails as per usage*/
const generateTermDetails = (termDetails, categoryKeys) => {
  const { semesterOne = {}, semesterTwo = {} } = generateSemesterOneTwo(termDetails);
  const { subjectMarks: subjectMarksSemesterOne = {} } = semesterOne || {};
  const { subjectMarks: subjectMarksSemesterTwo = {} } = semesterTwo || {};

  let subjectsList = Object.keys(subjectMarksSemesterOne);

  let semesterOneSubjectWiseMarks = generateSemesterMarks(
    subjectMarksSemesterOne,
    categoryKeys
  );
  let semesterTwoSubjectWiseMarks = generateSemesterMarks(
    subjectMarksSemesterTwo,
    categoryKeys
  );

  const semOneLength = semesterOneSubjectWiseMarks?.length || 0;
  const semTwoLength = semesterTwoSubjectWiseMarks?.length || 0;

  //To check if semester 2 is not present and if present the number of subjects are not equal
  if (semOneLength !== semTwoLength) {
    if (semOneLength > semTwoLength) {
      const diff = semOneLength - semTwoLength;
      let transformedSemTwo = Array.from({ length: diff }, () =>
        Array.from({ length: semesterOneSubjectWiseMarks[0].length }, () => '')
      );
      semesterTwoSubjectWiseMarks = [
        ...semesterTwoSubjectWiseMarks,
        ...transformedSemTwo,
      ];
    } else {
      //Logic need to be written if required
    }
  }

  //Joining rows of both sems
  const semesterMarks = semesterOneSubjectWiseMarks.map((semesterOneSubject, index) => [
    subjectsList[index],
    ...semesterOneSubject,
    ...semesterTwoSubjectWiseMarks[index],
    '', // (T1+T2)/2
    '', // Annual Grade
    '', // Annual OSR
    '', // Annual AIR
  ]);

  return semesterMarks;
};

/*transforming gradeScale as per usage*/
const generateGradeScale = (gradeScale = {}) => {
  const gradeScaleList = Object.entries(gradeScale);
  const gradeScaleToDisplay = gradeScaleList
    .map(([key, value]) => `${key} - ${value}`)
    .join(', ');
  return `${gradeScaleList?.length} Point Grading Scale: ${gradeScaleToDisplay}`;
};

const getTableHeaderRow = (tableType, categoryRowLength) => [
  { backgroundColor: '#7abbbb', value: tableType, colspan: 1 },
  {
    backgroundColor: 'rgb(252 179 120)',
    value: 'SEMESTER 1',
    colspan: 4 + categoryRowLength,
  },
  {
    backgroundColor: 'rgb(252 179 120)',
    value: 'SEMESTER 2',
    colspan: 4 + categoryRowLength,
  },
  { backgroundColor: 'rgb(170 226 226)', value: 'ANNUAL SCORE/GRADE', colspan: 4 },
];

const generateTermDetailsSummaryRow = (termDetails, categoryRowLength) => {
  const { semesterOne = {}, semesterTwo = {} } = generateSemesterOneTwo(termDetails);

  const {
    finalGrade: finalGradeSemOne = '',
    totalObtained: totalMarksSemOne = '',
    outOfTotal: outOfTotalSemOne = '',
  } = semesterOne || {};
  const {
    finalGrade: finalGradeSemTwo = '',
    totalObtained: totalMarksSemTwo = '',
    outOfTotal: outOfTotalSemTwo = '',
  } = semesterTwo || {};

  return [
    { value: 'Total' },
    {
      value: outOfTotalSemOne ? `Out of ${outOfTotalSemOne}` : '',
      colSpan: categoryRowLength,
    },
    { value: totalMarksSemOne },
    { value: finalGradeSemOne },
    { value: '' }, //total sem-1 marks
    { value: '' }, //total sem-1 grade
    {
      value: outOfTotalSemTwo ? `Out of ${outOfTotalSemTwo}` : '',
      colSpan: categoryRowLength,
    },
    { value: totalMarksSemTwo },
    { value: finalGradeSemTwo },
    { value: '' }, //total sem-2 marks
    { value: '' }, //total sem-2 grade
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' },
  ];
};

const getOverallRemark = (termDetails) => {
  const { semesterOne = {}, semesterTwo = {} } = generateSemesterOneTwo(termDetails);
  const { overallRemark: overallRemarkSemOne = '' } = semesterOne || {};
  const { overallRemark: overallRemarkSemTwo = '' } = semesterTwo || {};
  return { overallRemarkSemOne, overallRemarkSemTwo };
};

const generateObservationTableHeaders = (
  performanceAnalysis,
  achievementGoal,
  support,
  expectation
) => {
  return [
    { label: 'Performance Analysis:', value: performanceAnalysis },
    { label: 'Achievement Goal:', value: achievementGoal },
    { label: 'Support, I Will Offer:', value: support },
    { label: 'Expectation from You:', value: expectation },
    { label: 'Parent / Student Signature:', value: '' },
  ];
};

export {
  generateCategoryMap,
  generateTermDetails,
  getTableHeaderRow,
  generateGradeScale,
  generateTermDetailsSummaryRow,
  getOverallRemark,
  generateObservationTableHeaders,
};
