import { urls } from '../../../urls'

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} STUDENTCOMBINATIONS
*/

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const SECTION = 'Section'
export const CHAPTER = 'Chapter'
export const ROLES = {
  STUDENT: 'Student',
  GuestStudent: 'GuestStudent'
}

let { BRANCHv2, GRADEMAPPINGv2, SUBJECTMAPPINGv2, Chapter, GRADECHAPTER } = urls

export const STUDENTCOMBINATIONS = {
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
      label: 'subject_name',
      value: 'subject_id',
      output: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
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
      value: 'id',
      output: 'id',
      single: true
    }
  ]
}
