const getNAString = (value) => (value !== '' ? value : 'NA');

const getSubjectWiseMarks = (marks, categoryKeys) => {
  const length = categoryKeys?.length || 0;
  const subjectWiseMarks = Array.from({ length }, (element, index) => ({
    id: categoryKeys[index],
    value: null,
  }));
  categoryKeys.forEach((key) => {
    subjectWiseMarks.forEach(({ id }, index, arr) => {
      let subjectMark = marks[+key];
      return key === id ? (arr[index]['value'] = subjectMark) : null;
    });
  });
  const marksList = subjectWiseMarks.map(({ value }) => getNAString(value));
  return marksList;
};

const generateSemesterMarks = (subjectWiseMarks, categoryKeys, isOrchids = true) => {
  return isOrchids
    ? Object.values(subjectWiseMarks).map(
        ({ air = '', grade = '', osr = '', total = '', marks = {} }) => [
          ...getSubjectWiseMarks(marks, categoryKeys),
          total,
          grade,
          osr,
          air,
        ]
      )
    : Object.values(subjectWiseMarks).map(
        ({ grade = '', osr = '', total = '', marks = {} }) => [
          ...getSubjectWiseMarks(marks, categoryKeys),
          total,
          grade,
          osr,
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

  return categoryRowLength || 1;
};

const generateHeaderColspan = (scholastic, coScholastic, isOrchids = true) => {
  const variableColspan = isOrchids ? 2 : 1;
  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);
  const colspan = [
    variableColspan,
    categoryRowLength * 3 + variableColspan,
    variableColspan + 1,
  ];
  return colspan;
};

const generateReportTopDescription = (
  userInfo = {},
  scholastic = {},
  coScholastic = {},
  isOrchids = true
) => {
  const {
    name = '',
    erp_id = '',
    mothers_name = '',
    grade = '',
    fathers_name = '',
    dob = '',
    attendance_fraction = '',
    attendance_percentage = '',
  } = userInfo || {};
  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);
  const variableColspanOne = isOrchids ? 4 : 3;
  const variableColspanTwo = isOrchids ? 2 : 1;

  return [
    {
      header1: { value: "STUDENT'S NAME", colspan: 1 },
      value1: { value: name || 'NA', colspan: categoryRowLength + variableColspanOne },
      header2: { value: 'ERP CODE', colspan: variableColspanTwo },
      value2: { value: erp_id || 'NA', colspan: categoryRowLength + variableColspanOne },
    },
    {
      header1: { value: "MOTHER'S NAME", colspan: 1 },
      value1: {
        value: mothers_name || 'NA',
        colspan: categoryRowLength + variableColspanOne,
      },
      header2: { value: 'GRADE / DIV.', colspan: variableColspanTwo },
      value2: { value: grade || 'NA', colspan: categoryRowLength + variableColspanOne },
    },
    {
      header1: { value: "FATHER'S NAME", colspan: 1 },
      value1: {
        value: fathers_name || 'NA',
        colspan: categoryRowLength + variableColspanOne,
      },
      header2: { value: 'DATE OF BIRTH', colspan: variableColspanTwo },
      value2: { value: dob || 'NA', colspan: categoryRowLength + variableColspanOne },
    },
    {
      header1: { value: 'ATTENDANCE', colspan: 1 },
      value1: {
        value: attendance_fraction.split('/').join(' / ') || 'NA',
        colspan: categoryRowLength + variableColspanOne,
      },
      header2: { value: '% ATTENDANCE', colspan: variableColspanTwo },
      value2: {
        value: attendance_percentage || 'NA',
        colspan: categoryRowLength + variableColspanOne,
      },
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
const generateCategoryMap = (categoryMap = {}, isOrchids = true) => {
  const transformedCategoryType = Object.entries(categoryMap).map(
    ([
      key,
      { assessment_type: assessmentType = null, name: category = null, weight = null },
    ]) => ({
      key,
      assessmentType,
      category,
      weight,
    })
  );
  const categoryKeys = [...transformedCategoryType.map(({ key }) => getNAString(key))];

  //category headers
  const categoryRow = [
    ...transformedCategoryType.map(({ category }) => getNAString(category)),
  ];

  const constantHeaders = isOrchids ? ['Grade', 'OSR', 'AIR'] : ['Grade', 'OSR'];

  //totalWeight added in weight row below
  const totalWeight = transformedCategoryType.reduce(
    (total, { weight }) => total + weight,
    0
  );

  //weight row data
  const weightRow = [
    ...transformedCategoryType.map(({ weight }) => weight ?? 'NA'),
    totalWeight,
  ];

  //category-assessmentType data
  const categoryAssessmentType = [
    ...transformedCategoryType.map(({ category = null, assessmentType = null }) => {
      const assessmentTypeString = Array.isArray(assessmentType)
        ? assessmentType.join('/')
        : assessmentType;
      const displayString = getNAString(assessmentTypeString);
      return `${category}${' '} -${' '}${displayString}`;
    }),
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
const generateTermDetails = (termDetails, categoryKeys, isOrchids = true) => {
  const { semesterOne = {}, semesterTwo = {} } = generateSemesterOneTwo(termDetails);
  const { subjectMarks: subjectMarksSemesterOne = {} } = semesterOne || {};
  const { subjectMarks: subjectMarksSemesterTwo = {} } = semesterTwo || {};

  let subjectsList = Object.keys(subjectMarksSemesterOne);
  let semesterOneSubjectWiseMarks = generateSemesterMarks(
    subjectMarksSemesterOne,
    categoryKeys,
    isOrchids
  );
  let semesterTwoSubjectWiseMarks = generateSemesterMarks(
    subjectMarksSemesterTwo,
    categoryKeys,
    isOrchids
  );

  const semOneLength = semesterOneSubjectWiseMarks?.length || 0;
  const semTwoLength = semesterTwoSubjectWiseMarks?.length || 0;
  //To check if semester 2 is not present and if present the number of subjects are not equal
  if (semOneLength !== semTwoLength) {
    if (semOneLength > semTwoLength) {
      const diff = semOneLength - semTwoLength;
      let transformedSemTwo = Array.from({ length: diff }, () =>
        Array.from({ length: semesterOneSubjectWiseMarks[0].length }, () => null)
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
  const semesterMarks = isOrchids
    ? semesterOneSubjectWiseMarks.map((semesterOneSubject, index) => [
        subjectsList[index],
        ...semesterOneSubject,
        ...semesterTwoSubjectWiseMarks[index],
        '', // (T1+T2)/2
        '', // Annual Grade
        '', // Annual OSR
        '', // Annual AIR
      ])
    : semesterOneSubjectWiseMarks.map((semesterOneSubject, index) => [
        subjectsList[index],
        ...semesterOneSubject,
        ...semesterTwoSubjectWiseMarks[index],
        '', // (T1+T2)/2
        '', // Annual Grade
        '', // Annual OSR
      ]);

  return semesterMarks;
};

/*transforming gradeScale as per usage*/
const generateGradeScale = (gradeScale = {}) => {
  const gradeScaleList = Object.entries(gradeScale);
  const gradeScaleToDisplay = gradeScaleList
    .map(([key, value]) => `${key} - ${value ?? 'NA'}`)
    .join(`, `);
  return `${gradeScaleList?.length} Point Grading Scale: ${gradeScaleToDisplay}`;
};

const getTableHeaderRow = (tableType, categoryRowLength, isOrchids = true) => {
  const variableColspan = isOrchids ? 4 : 3;
  return [
    {
      backgroundColor: '#fff',
      backgroundColor: '#FDBF8E',
      value: tableType,
      colspan: 1,
    },
    {
      backgroundColor: '#fff',
      backgroundColor: '#FDBF8E',
      value: 'SEMESTER 1',
      colspan: variableColspan + categoryRowLength,
    },
    {
      backgroundColor: '#fff',
      backgroundColor: '#FDBF8E',
      value: 'SEMESTER 2',
      colspan: variableColspan + categoryRowLength,
    },
    {
      backgroundColor: '#fff',
      backgroundColor: '#FDBF8E',
      value: 'ANNUAL SCORE / GRADE',
      colspan: variableColspan,
    },
  ];
};

const generateTermDetailsSummaryRow = (
  termDetails,
  categoryRowLength,
  isOrchids = true
) => {
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

  return isOrchids
    ? [
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
      ]
    : [
        { value: 'Total' },
        {
          value: outOfTotalSemOne ? `Out of ${outOfTotalSemOne}` : '',
          colSpan: categoryRowLength,
        },
        { value: totalMarksSemOne },
        { value: finalGradeSemOne },
        { value: '' }, //total sem-1 marks
        {
          value: outOfTotalSemTwo ? `Out of ${outOfTotalSemTwo}` : '',
          colSpan: categoryRowLength,
        },
        { value: totalMarksSemTwo },
        { value: finalGradeSemTwo },
        { value: '' }, //total sem-2 marks
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

const generateFooterData = (scholastic, coScholastic, schoolData, isOrchids = true) => {
  const categoryRowLength = generateCategoryRowLength(scholastic, coScholastic);
  const { term_details: termDetails = {} } = scholastic || {};
  const { overallRemarkSemOne = '', overallRemarkSemTwo = '' } =
    getOverallRemark(termDetails);
  const categoryRowLengthHalf = Math.round(categoryRowLength / 2);
  const { principal_name: principalName = '' } = schoolData || {};
  const variableColspanOne = isOrchids ? 4 : 1;
  const variableColspanTwo = isOrchids ? 1 : -2;
  return [
    [
      { value: "CLASS TEACHER'S REMARK", colspan: categoryRowLengthHalf },
      { value: overallRemarkSemOne, colspan: categoryRowLength * 3 + variableColspanOne },
    ],
    [
      { value: 'PRINCIPAL', colspan: categoryRowLengthHalf },
      {
        value: principalName && `${principalName} - DIGITAL SIGNATURE`,
        colspan: categoryRowLength * 3 + variableColspanOne,
      },
    ],
    [
      {
        value:
          '**THIS IS AN AUTOGENERATED REPORT CARD AND HENCE DOES NOT REQUIRE ANY SIGNATURE AND SCHOOL STAMP OR SEAL**',
        colspan: categoryRowLength * 4 + variableColspanTwo,
      },
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
