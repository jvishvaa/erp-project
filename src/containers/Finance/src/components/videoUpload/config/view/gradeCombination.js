import { urls } from '../../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const CHAPTER = 'Chapter'
export const ROLES = { ADMIN: 'Admin',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  GuestStudent: 'GuestStudent',
  LEADTEACHER: 'LeadTeacher',
  EAACADEMICS: 'EA Academics'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATION
*/

let { GRADECHAPTER } = urls

export const COMBINATION = {
  [ROLES.ADMIN]: [{
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  }
  ],
  [ROLES.SUBJECTHEAD]: [
    {
      name: SUBJECT,
      dependencies: [GRADE],
      url: GRADECHAPTER,
      params: ['grade_id'],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      loadAtStart: true,
      single: true
    }, {
      name: GRADE,
      dependencies: [],
      params: ['subject_id'],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      single: true
    }
  ],
  [ROLES.PLANNER]: [{
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  }
  ],
  [ROLES.STUDENT]: [],
  [ROLES.GuestStudent]: [],
  [ROLES.LEADTEACHER]: [
    {
      name: GRADE,
      dependencies: [],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      loadAtStart: true,
      single: true

    }],

  [ROLES.EAACADEMICS]: [{
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  }
  ]

}
