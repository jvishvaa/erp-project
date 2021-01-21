import { urls } from '../../../urls'

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Commonly used constants for easy reference.
 * @type {Object}
 */

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const SECTION = 'Section'
export const ROLES = { ADMIN: 'Admin', TEACHER: 'Teacher', REVIEWER: 'Reviewer', SUBJECTHEAD: 'Subjecthead', PLANNER: 'Planner', STUDENT: 'Student', LEADTEACHER: 'LeadTeacher'
}

let { BRANCHv2, SECTIONMAPPINGv2, GRADEMAPPINGv2, SUBJECTMAPPINGv2 } = urls

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    output: 'section_mapping_id',
    value: 'section_id'
  }

  ],
  [ROLES.TEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }

  ],
  [ROLES.LEADTEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }],
  [ROLES.PLANNER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }],
  [ROLES.SUBJECTHEAD]: [{
    name: BRANCH,
    dependencies: [SUBJECT],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [GRADE],
    url: SUBJECTMAPPINGv2,
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id',
    single: true
  },
  {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id', 'acad_session', 'subject_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['branch_id', 'acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }],
  [ROLES.REVIEWER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  },
  {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }]
}
