import { urls } from '../../../urls'

export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const ROLES = { ADMIN: 'Admin',
  SUBJECTHEAD: 'Subjecthead'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

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
    value: 'subject_id',
    single: true
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
