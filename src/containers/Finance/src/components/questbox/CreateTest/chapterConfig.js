import { urls } from '../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const SECTION = 'Section'

export const ROLES = { ACADEMICCOORDINATOR: 'AcademicCoordinator',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  LEADTEACHER: 'LeadTeacher',
  SUBJECTHEAD: 'Subjecthead',
  ADMIN: 'Admin'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { GRADECHAPTER, GetQuestionCount } = urls

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
    url: GetQuestionCount,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }]
}
