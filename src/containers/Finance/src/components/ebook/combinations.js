import { urls } from '../../urls'

export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const BRANCH = 'Branch'
export const SECTION = 'Section'
export const CHAPTER = 'Chapter'
export const ROLES = {
  SUBJECTHEAD: 'Subjecthead',
  STUDENT: 'Student',
  GuestStudent: 'GuestStudent'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { GRADECHAPTER, BRANCHv2, GRADEMAPPINGv2 } = urls

export const COMBINATIONS = {
  // [ROLES.SUBJECTHEAD]: [

  //   {
  //     name: GRADE,
  //     dependencies: [SUBJECT],
  //     url: GRADECHAPTER,
  //     label: 'grade_name',
  //     output: 'grade_id',
  //     value: 'grade_id',
  //     loadAtStart: true,
  //     single: true
  //   }
  // ],
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
      single: true
    }
  ],

  [ROLES.GuestStudent]: [
    {
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
