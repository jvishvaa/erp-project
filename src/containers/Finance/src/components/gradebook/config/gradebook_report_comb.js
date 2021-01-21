import { urls } from '../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const SECTION = 'Section'

export const ROLES = { ACADEMICCOORDINATOR: 'AcademicCoordinator',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  SUBJECTHEAD: 'Subjecthead',
  ADMIN: 'Admin',
  LEADTEACHER: 'LeadTeacher',
  EAACADEMICS: 'EA Academics'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { GRADEMAPPINGv2, SUBJECTMAPPINGv2, BRANCHv2, SECTIONMAPPINGv2 } = urls

export const GRADEBOOKREPORTCOMBINATIONS = {
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
    value: 'section_mapping_id',
    output: 'section_mapping_id',
    single: true
  }],
  [ROLES.PRINCIPAL]: [{
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
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  }],
  [ROLES.TEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    loadAtStart: true,
    output: 'branch_id',
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
    value: 'section_mapping_id',
    output: 'section_mapping_id',
    single: true
  }],
  [ROLES.LEADTEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    loadAtStart: true,
    output: 'branch_id',
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
    value: 'section_mapping_id',
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
    single: true
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
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
  }, {
    name: SUBJECT,
    dependencies: [GRADE],
    url: SUBJECTMAPPINGv2,
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id',
    single: true
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id', 'acad_session', 'subject_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  }
  ],
  [ROLES.EAACADEMICS]: [{
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
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id',
    single: true
  }]
}
