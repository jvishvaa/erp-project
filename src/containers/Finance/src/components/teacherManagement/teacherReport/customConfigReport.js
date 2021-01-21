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
export const ROLES = { ADMIN: 'Admin',
  TEACHER: 'Teacher',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  PRINCIPAL: 'Principal',
  MIS: 'MIS',
  ACADEMICCOORDINATOR: 'AcademicCoordinator',
  LEADTEACHER: 'LeadTeacher',
  CFO: 'CFO',
  EAACADEMICS: 'EA Academics'

}

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { BRANCHv2, SUBJECTMAPPINGv2, SECTIONMAPPINGv2, GRADEMAPPINGv2 } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }],
  [ROLES.CFO]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_name',
    output: 'branch_acad_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
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
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }],
  [ROLES.LEADTEACHER]: [{
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
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }],
  [ROLES.ACADEMICCOORDINATOR]: [{
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
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }],
  [ROLES.PLANNER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  }, {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }],
  [ROLES.SUBJECTHEAD]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true
  },
  {
    name: SUBJECT,
    dependencies: [GRADE],
    url: SUBJECTMAPPINGv2,
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id',
    loadAtStart: true
  },
  {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id', 'acad_session', 'subject_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
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
  [ROLES.STUDENT]: [
    {
      name: SUBJECT,
      dependencies: [],
      url: SUBJECTMAPPINGv2,
      label: 'subject_name',
      value: 'subject_id',
      output: 'subject_mapping_id',
      loadAtStart: true
    }
  ],
  [ROLES.PRINCIPAL]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }],
  [ROLES.MIS]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SUBJECT, SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_acad_id',
    loadAtStart: true,
    hidden: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [SUBJECT],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'section_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_mapping_id'
  }]

}
