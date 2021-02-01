import { urls } from '../../urls'
/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/
export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const SECTION = 'Section'
export const ROLES = { ADMIN: 'Admin',
  MIS: 'MIS',
  TEACHER: 'Teacher',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  PRINCIPAL: 'Principal',
  CFO: 'CFO'
}

let { BRANCHv2, SUBJECTMAPPINGv2, SECTIONMAPPINGv2, GRADEMAPPINGv2 } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'grade_id',
    show: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_id',
    show: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id'
  }],
  [ROLES.CFO]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'grade_id',
    show: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_id',
    show: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id'
  }],
  [ROLES.MIS]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    show: true,
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'grade_id',
    show: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_id',
    show: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id'
  }],
  [ROLES.TEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    output: 'section_id',
    value: 'section_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.PLANNER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id'
  }, {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id'
  }],
  [ROLES.SUBJECTHEAD]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    loadAtStart: true
  },
  {
    name: SUBJECT,
    dependencies: [GRADE],
    url: SUBJECTMAPPINGv2,
    label: 'subject_name',
    value: 'subject_id',
    loadAtStart: true
  },
  {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id', 'acad_session', 'subject_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['branch_id', 'acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id'
  }],
  [ROLES.STUDENT]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'grade_id',
    hidden: true
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_id',
    hidden: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id'
  }],
  [ROLES.PRINCIPAL]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id'
  }]
}
