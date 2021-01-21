import { urls } from '../../../../urls'

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
export const ROLES = { TEACHER: 'Teacher', PRINICIPAL: 'Principal', BDM: 'BDM', FOE: 'FOE', ADMIN: 'Admin', ACADEMICCOORDINATOR: 'AcademicCoordinator', CFO: 'CFO', EAACADEMICS: 'EA Academics' }

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
    output: 'branch_acad_id',
    loadAtStart: true,
    single: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true
  }],
  [ROLES.PRINICIPAL]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true,
    single: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true
  }],
  [ROLES.TEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    loadAtStart: true,
    output: 'branch_acad_id',
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id',
    single: true
  }]
}
