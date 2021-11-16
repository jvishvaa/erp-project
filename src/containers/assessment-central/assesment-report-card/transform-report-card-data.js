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

const generateCategoryRowLength = (scholastic, coScholastic) => {
  const scholasticCategoryMapLength = Object.entries(
    scholastic['category_map'] || {}
  ).length;
  const coScholasticCategoryMapLength = Object.entries(
    coScholastic['category_map'] || {}
  ).length;
  const categoryRowLength =
    scholasticCategoryMapLength === coScholasticCategoryMapLength
      ? scholasticCategoryMapLength
      : scholasticCategoryMapLength > coScholasticCategoryMapLength
      ? scholasticCategoryMapLength - coScholasticCategoryMapLength
      : coScholasticCategoryMapLength - scholasticCategoryMapLength;

  return categoryRowLength;
};

const generateHeaderColspan = (scholastic, coScholastic) => {
  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);
  const colspan = [3, categoryRowLength * 3, 4];
  return colspan;
};

const generateReportTopDescription = (
  userInfo = {},
  scholastic = {},
  coScholastic = {}
) => {
  const {
    name = '',
    erp_id = '',
    mothers_name = '',
    grade = '',
    fathers_name = '',
    dob = '',
    section = '',
    profile_img,
    attendance = '',
  } = userInfo || {};
  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);
  return [
    {
      header1: { value: "STUDENT'S NAME", colspan: 1 },
      value1: { value: name, colspan: categoryRowLength + 4 },
      header2: { value: 'ERP CODE', colspan: 2 },
      value2: { value: erp_id, colspan: 3 },
      emptyCells: { value: '', colspan: categoryRowLength + 1 },
    },
    {
      header1: { value: "MOTHER'S NAME", colspan: 1 },
      value1: { value: mothers_name, colspan: categoryRowLength + 4 },
      header2: { value: 'GRADE / DIV.', colspan: 2 },
      value2: { value: grade, colspan: 3 },
      emptyCells: { value: '', colspan: categoryRowLength + 1 },
    },
    {
      header1: { value: "FATHER'S NAME", colspan: 1 },
      value1: { value: fathers_name, colspan: categoryRowLength + 4 },
      header2: { value: 'DATE OF BIRTH', colspan: 2 },
      value2: { value: dob, colspan: 3 },
      emptyCells: { value: '', colspan: categoryRowLength + 1 },
    },
    {
      header1: { value: 'ATTENDANCE', colspan: 1 },
      value1: { value: '', colspan: categoryRowLength + 4 },
      header2: { value: '% ATTENDANCE', colspan: 2 },
      value2: { value: attendance, colspan: 3 },
      emptyCells: { value: '', colspan: categoryRowLength + 1 },
    },
  ];
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
      trait_data: traitData = [],
    }) => ({
      finalGrade,
      semester,
      outOfTotal,
      totalObtained,
      subjectMarks,
      overallRemark,
      traitData,
    })
  );
  const [semesterOne = {}, semesterTwo = {}] = transformedTermDetails || [];

  return { semesterOne, semesterTwo };
};

/*transforming categoryMap as per usage*/
const generateCategoryMap = (categoryMap = {}) => {
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
  //
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
  {
    backgroundColor: '#fff',
    // backgroundColor: '#7abbbb',
    backgroundColor:'#FDBF8E',
    value: tableType,
    colspan: 1,
  },
  {
    backgroundColor: '#fff',
    // backgroundColor: 'rgb(252 179 120)',
    backgroundColor:'#FDBF8E',
    value: 'SEMESTER 1',
    colspan: 4 + categoryRowLength,
  },
  {
    backgroundColor: '#fff',
    // backgroundColor: 'rgb(252 179 120)',
    backgroundColor:'#FDBF8E',
    value: 'SEMESTER 2',
    colspan: 4 + categoryRowLength,
  },
  {
    backgroundColor: '#fff',
    // backgroundColor: 'rgb(170 226 226)',
    backgroundColor:'#FDBF8E',
    value: 'ANNUAL SCORE / GRADE',
    colspan: 4,
  },
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

const generateObservationTableHeaders = (traits = {}) => {
  return Object.entries(traits).map(([key, value]) => ({
    label: key.split('_').join(' '),
    value,
  }));
};

const generatePersonalityTraits = (scholastic, coScholastic) => {
  const scholasticTermDetails = scholastic['term_details'] || [];
  const coScholasticTermDetails = coScholastic['term_details'] || [];

  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);

  const { semesterOne: scholasticSemOne = {}, semesterTwo: scholasticSemTwo = {} } =
    generateSemesterOneTwo(scholasticTermDetails);
  const { semesterOne: coScholasticSemOne = {}, semesterTwo: coScholasticSemTwo = {} } =
    generateSemesterOneTwo(coScholasticTermDetails);

  const { traitData: scholasticSemOneTraitData = [] } = scholasticSemOne || {};
  const { traitData: scholasticSemTwoTraitData = [] } = scholasticSemTwo || {};
  const { traitData: coScholasticSemOneTraitData = [] } = coScholasticSemOne || {};
  const { traitData: coScholasticSemTwoTraitData = [] } = coScholasticSemTwo || {};

  const semOneTrait =
    scholasticSemOneTraitData.length >= coScholasticSemOneTraitData.length
      ? scholasticSemOneTraitData
      : coScholasticSemOneTraitData;

  const semTwoTrait =
    scholasticSemTwoTraitData.length >= coScholasticSemTwoTraitData.length
      ? scholasticSemTwoTraitData
      : coScholasticSemTwoTraitData;

  const maxLength =
    semOneTrait.length >= semTwoTrait.length ? semOneTrait.length : semTwoTrait.length;

  const personalityTraits = Array.from({ length: maxLength }, (element, index) => [
    { value: semOneTrait?.[index]?.['trait_name'] || '', colspan: 4 + categoryRowLength },
    { value: semOneTrait?.[index]?.['trait_grade'] || '', colspan: 1 },
    { value: semTwoTrait?.[index]?.['trait_name'] || '', colspan: 4 + categoryRowLength },
    { value: semTwoTrait?.[index]?.['trait_grade'] || '', colspan: 1 },
    { value: '', colspan: 3 },
  ]);

  personalityTraits.unshift([
    {
      value: 'PERSONALITY TRAIT AND SELF DISCIPLINE (SEMESTER 1)',
      colspan: 4 + categoryRowLength,
    },
    { value: 'GRADE', colspan: 1 },
    {
      value: 'PERSONALITY TRAIT AND SELF DISCIPLINE (SEMESTER 2)',
      colspan: 4 + categoryRowLength,
    },
    { value: 'GRADE', colspan: 1 },
    { value: 'ANNUAL GRADE', colspan: 3 },
  ]);
  return personalityTraits;
};

const generateFooterData = (scholastic, coScholastic) => {
  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);
  const { term_details: termDetails = {} } = scholastic || {};
  const { overallRemarkSemOne = '', overallRemarkSemTwo = '' } =
    getOverallRemark(termDetails);
  const categoryRowLengthHalf = Math.round(categoryRowLength / 2);
  return [
    [
      { value: "CLASS TEACHER'S REMARK", colspan: 3 },
      { value: overallRemarkSemOne, colspan: categoryRowLength * 2 + 10 },
    ],
    [
      { value: 'SIGNATURE: CLASS TEACHER', colspan: categoryRowLengthHalf },
      { value: '', colspan: categoryRowLengthHalf },
      { value: 'SIGNATURE: COORDINATOR', colspan: categoryRowLengthHalf },
      { value: '', colspan: categoryRowLengthHalf },
      { value: 'SIGNATURE: PARENT', colspan: categoryRowLengthHalf },
      { value: '', colspan: categoryRowLengthHalf },
      { value: 'SIGNATURE: PRINCIPAL', colspan: categoryRowLengthHalf },
      { value: '', colspan: categoryRowLengthHalf + 1 },
    ],
  ];
};

export {
  generateCategoryMap,
  generateTermDetails,
  getTableHeaderRow,
  generateGradeScale,
  generateTermDetailsSummaryRow,
  generateHeaderColspan,
  generateReportTopDescription,
  getOverallRemark,
  generateObservationTableHeaders,
  generatePersonalityTraits,
  generateFooterData,
};
