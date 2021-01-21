import { urls } from '../../../urls'

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Commonly used constants for easy reference.
 * @type {Object}
 */

export const SUBJECT = 'Subject'
export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const ROLES = {
  STUDENT: 'Student'
}

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { BRANCHv2, SUBJECTMAPPINGv2, GRADEMAPPINGv2 } = urls

export const COMBINATIONS = {
  [ROLES.STUDENT]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_name',
      output: 'branch_id',
      loadAtStart: true,
      hidden: true
    }, {
      name: GRADE,
      dependencies: [SUBJECT],
      url: GRADEMAPPINGv2,
      params: ['branch_id'],
      label: 'grade_name',
      value: 'acad_branch_grade_mapping_id',
      output: 'grade_id',
      hidden: true
    },
    {
      name: SUBJECT,
      dependencies: [],
      url: SUBJECTMAPPINGv2,
      params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
      label: 'subject_name',
      value: 'subject_mapping_id',
      output: 'subject_mapping_id',
      single: true
    }
  ]
}
