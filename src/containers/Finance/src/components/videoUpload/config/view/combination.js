import { urls } from '../../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const CHAPTER = 'Chapter'
export const ROLES = { ADMIN: 'Admin',
  TEACHER: 'Teacher',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  REVIEWER: 'Reviewer',
  LEADTEACHER: 'LeadTeacher',
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

let { BRANCHv2, GRADEMAPPINGv2, SUBJECTMAPPINGv2, Chapter, GRADECHAPTER } = urls

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
    additionalParams: [{ 'lmscontent_data_only': 'true' }],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
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
    additionalParams: [{ 'lmscontent_data_only': 'true' }],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
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
    additionalParams: [{ 'lmscontent_data_only': 'true' }],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
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
      additionalParams: [{ 'lmscontent_data_only': 'true' }],
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
      additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
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
    additionalParams: [{ 'lmscontent_data_only': 'true' }],
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
    additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    additionalParams: [{ 'lmscontent_data_only': 'true' }],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }],
  [ROLES.STUDENT]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'acad_branch_grade_mapping_id',
      loadAtStart: true,
      single: true,
      hidden: true
    }, {
      name: GRADE,
      dependencies: [SUBJECT],
      url: GRADEMAPPINGv2,
      params: ['branch_id'],
      label: 'grade_name',
      output: 'grade_id',
      value: 'acade_branch_grade_id',
      single: true,
      hidden: true
    },
    {
      name: SUBJECT,
      dependencies: [CHAPTER],
      url: SUBJECTMAPPINGv2,
      params: [],
      additionalParams: [{ 'lmscontent_data_only': 'true' }],
      label: 'subject_name',
      value: 'subject_id',
      output: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
      label: 'chapter_name',
      value: 'id',
      output: 'id',
      single: true
    }],
  [ROLES.GuestStudent]: [
    {
      name: GRADE,
      dependencies: [SUBJECT],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      loadAtStart: true,
      single: true,
      hidden: true
    },
    {
      name: SUBJECT,
      dependencies: [CHAPTER],
      url: GRADECHAPTER,
      params: ['grade_id'],
      additionalParams: [{ 'lmscontent_data_only': 'true' }],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
      label: 'chapter_name',
      value: 'id',
      output: 'id',
      single: true
    }
  ],
  [ROLES.EAACADEMICS]: [{
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
    additionalParams: [{ 'lmscontent_data_only': 'true' }],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ 'feature': 'lms' }, { 'lmscontent_data_only': 'true' }],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }]

}
