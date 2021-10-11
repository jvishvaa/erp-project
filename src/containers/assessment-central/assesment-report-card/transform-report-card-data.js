const getSubjectWiseMarks = (length, marks) => {
  const subjectWiseMarks = Array.from({ length }, () => '');
  Object.entries(marks).forEach(([key, value]) => (subjectWiseMarks[key - 1] = value));
  return subjectWiseMarks;
};

const generateSemesterMarks = (subjectWiseMarks, categoryRowLength) =>
  Object.values(subjectWiseMarks).map(
    ({ air = '', grade = '', osr = '', total = '', marks = {} }) => [
      ...getSubjectWiseMarks(categoryRowLength, marks),
      total,
      grade,
      osr,
      air,
    ]
  );

const generateSemesterOneTwo = (termDetails) => {
  const transformedTermDetails = Object.values(termDetails).map(
    ({
      final_grade: finalGrade = '',
      name: semester = '',
      subject_marks: subjectMarks = {},
      out_of_total: outOfTotal = '',
      total_obtained: totalObtained = '',
    }) => ({
      finalGrade,
      semester,
      outOfTotal,
      totalObtained,
      subjectMarks,
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
      assessmentType,
      category,
      weight,
    })
  );

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
      ({ category, assessmentType }) => `${category}-${assessmentType}`
    ),
  ].join(', ');
  return { categoryRow, constantHeaders, weightRow, categoryAssessmentType };
};

/*transforming termDetails as per usage*/
const generateTermDetails = (termDetails, categoryRowLength) => {
  const { semesterOne = {}, semesterTwo = {} } = generateSemesterOneTwo(termDetails);
  const { subjectMarks: subjectMarksSemesterOne = {} } = semesterOne || {};
  const { subjectMarks: subjectMarksSemesterTwo = {} } = semesterTwo || {};

  let subjectsList = Object.keys(subjectMarksSemesterOne);

  let semesterOneSubjectWiseMarks = generateSemesterMarks(
    subjectMarksSemesterOne,
    categoryRowLength
  );
  let semesterTwoSubjectWiseMarks = generateSemesterMarks(
    subjectMarksSemesterTwo,
    categoryRowLength
  );

  const semOneLength = semesterOneSubjectWiseMarks?.length;
  const semTwoLength = semesterTwoSubjectWiseMarks?.length;

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

const getTableHeaderRow = (tableType) => [
  { backgroundColor: '#7abbbb', value: tableType, colspan: 1 },
  { backgroundColor: 'rgb(252 179 120)', value: 'SEMESTER 1', colspan: 10 },
  { backgroundColor: 'rgb(252 179 120)', value: 'SEMESTER 2', colspan: 10 },
  { backgroundColor: 'rgb(170 226 226)', value: 'ANNUAL SCORE/GRADE', colspan: 4 },
];

const generateTermDetailsSummaryRow = (termDetails) => {
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
    { value: outOfTotalSemOne ? `Out of ${outOfTotalSemOne}` : '', colSpan: 6 },
    { value: totalMarksSemOne },
    { value: finalGradeSemOne },
    { value: '' }, //total sem-1 marks
    { value: '' }, //total sem-1 grade
    { value: outOfTotalSemTwo ? `Out of ${outOfTotalSemTwo}` : '', colSpan: 6 },
    { value: totalMarksSemTwo },
    { value: finalGradeSemTwo },
    { value: '' }, //total sem-2 marks
    { value: '' }, //total sem-2 grade
    { value: '534' },
    { value: 'B1' },
    { value: '3' },
    { value: '9' },
  ];
};

export {
  generateCategoryMap,
  generateTermDetails,
  getTableHeaderRow,
  generateGradeScale,
  generateTermDetailsSummaryRow,
};
