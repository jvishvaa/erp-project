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
export const ROLES = { ADMIN: 'Admin', PRINICIPAL: 'Principal', EAACADEMICS: 'EA Academics', SUBJECTHEAD: 'Subjecthead', PLANNER: 'Planner', LEADTEACHER: 'LeadTeacher', ACADEMICCOORDINATOR: 'AcademicCoordinator', TEACHER: 'Teacher', ONLINECLASSADMIN: 'Online Class Admin', AOLADMIN: 'AOLAdmin' }

let { BRANCHv2, GRADEMAPPINGv2 } = urls

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
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
    // single: true
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: false
  }

  ],
  [ROLES.ONLINECLASSADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
    // single: true
  },
  {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: false
  }
  ],
  [ROLES.PRINICIPAL]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_acad_id',
      output: 'branch_acad_id',
      loadAtStart: true
    // single: true
    },
    {
      name: GRADE,
      dependencies: [],
      url: GRADEMAPPINGv2,
      params: ['branch_id'],
      label: 'grade_name',
      output: 'acad_branch_grade_mapping_id',
      value: 'acad_branch_grade_mapping_id',
      single: false
      // loadAtStart: true
    }

  ],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
    // single: true
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: false
  }
  ],
  [ROLES.SUBJECTHEAD]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
    // single: true
  }
  ],
  [ROLES.LEADTEACHER]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_acad_id',
      output: 'branch_acad_id',
      loadAtStart: false,
      hidden: true
    // single: true
    },
    {
      name: GRADE,
      dependencies: [],
      url: GRADEMAPPINGv2,
      params: ['branch_id'],
      label: 'grade_name',
      output: 'acad_branch_grade_mapping_id',
      value: 'acad_branch_grade_mapping_id',
      single: false,
      loadAtStart: false,
      hidden: true
    }
  ],
  [ROLES.PLANNER]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
    // single: true
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: false
  }
  ],
  [ROLES.ACADEMICCOORDINATOR]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_acad_id',
      output: 'branch_acad_id',
      loadAtStart: true
      // hidden: true
    // single: true
    },
    {
      name: GRADE,
      dependencies: [],
      url: GRADEMAPPINGv2,
      params: ['branch_id'],
      label: 'grade_name',
      output: 'acad_branch_grade_mapping_id',
      value: 'acad_branch_grade_mapping_id',
      single: false,
      loadAtStart: true
    }

  ],
  [ROLES.TEACHER]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_acad_id',
      output: 'branch_acad_id',
      loadAtStart: true,
      hidden: true
    // single: true
    },
    {
      name: GRADE,
      dependencies: [],
      url: GRADEMAPPINGv2,
      params: ['branch_id'],
      label: 'grade_name',
      output: 'acad_branch_grade_mapping_id',
      value: 'acad_branch_grade_mapping_id',
      single: false,
      loadAtStart: false
    }

  ],
  [ROLES.AOLADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
    // single: true
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'acad_branch_grade_mapping_id',
    value: 'acad_branch_grade_mapping_id',
    single: false
  }

  ]

}
