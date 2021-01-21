import { urls } from '../../../urls'
// import { GRADE, SUBJECT, ROLES } from '../../../_components/globalselector/config/constants'
/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/
export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const SECTION = 'Section'
export const ROLES = { ADMIN: 'Admin', TEACHER: 'Teacher', REVIEWER: 'Reviewer', SUBJECTHEAD: 'Subjecthead', PLANNER: 'Planner', STUDENT: 'Student', LEADTEACHER: 'LeadTeacher'
}

let { GRADECHAPTER } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.TEACHER]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.LEADTEACHER]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.REVIEWER]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.PLANNER]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.SUBJECTHEAD]: [{
    name: SUBJECT,
    dependencies: [GRADE],
    url: GRADECHAPTER,
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    loadAtStart: true,
    single: true
  },
  {
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['subject_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    single: true
  }
  ]
}
