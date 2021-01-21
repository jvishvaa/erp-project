import { urls } from '../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const CHAPTER = 'Chapter'
export const ROLES = { ADMIN: 'Admin',
  TEACHER: 'Teacher',
  LEADTEACHER: 'LeadTeacher',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  REVIEWER: 'Reviewer',
  GuestStudent: 'GuestStudent',
  EAACADEMICS: 'EA Academics'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { GRADECHAPTER, Chapter } = urls

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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }],
  [ROLES.LEADTEACHER]: [
    {
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
      dependencies: [CHAPTER],
      url: GRADECHAPTER,
      params: ['grade_id'],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }],
  [ROLES.SUBJECTHEAD]: [
    {
      name: SUBJECT,
      dependencies: [GRADE],
      url: GRADECHAPTER,
      params: [],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      loadAtStart: true,
      single: true
    }, {
      name: GRADE,
      dependencies: [CHAPTER],
      params: ['subject_id'],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      single: true
    },
    {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
    }
  ],
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }],
  [ROLES.GuestStudent]: [],
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }]

}
