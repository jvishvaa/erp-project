import { urls } from '../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const CHAPTER = 'Chapter'
export const ROLES = { ADMIN: 'Admin',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  GuestStudent: 'GuestStudent',
  EAACADEMICS: 'EA Academics'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATION
*/

let { Chapter, SUBJECTMAPPINGv2, BRANCHv2, GRADEMAPPINGv2, GRADECHAPTER } = urls

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
      dependencies: [],
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
      label: 'subject_name',
      value: 'subject_id',
      output: 'subject_id',
      single: true,
      hidden: true

    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      label: 'chapter_name',
      value: 'id',
      output: 'id',
      single: true,
      hidden: true
    }
  ],
  [ROLES.GuestStudent]: [],

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
