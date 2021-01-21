import { urls } from '../../urls'

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

let { BRANCHv2, SECTIONMAPPINGv2, GRADEMAPPINGv2 } = urls
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

  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true

  }],
  [ROLES.CFO]: [{
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
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
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
    output: 'branch_id',
    loadAtStart: true,
    single: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true

  }],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
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
    output: 'branch_id',
    loadAtStart: true,
    single: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true

  }],

  [ROLES.BDM]: [{
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
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true

  }],
  [ROLES.FOE]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true

  }],
  [ROLES.ACADEMICCOORDINATOR]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id',
    single: true

  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id',
    single: true

  }]

}
