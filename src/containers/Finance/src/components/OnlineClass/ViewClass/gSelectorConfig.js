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
export const ROLES = { ADMIN: 'Admin', EAACADEMICS: 'EA Academics', PRINICIPAL: 'Principal', ACADEMICCOORDINATOR: 'AcademicCoordinator', SUBJECTHEAD: 'Subjecthead', PLANNER: 'Planner' }

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { BRANCHv2, GRADEMAPPINGv2, SUBJECTMAPPINGv2 } = urls

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
    dependencies: [SUBJECT],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'grade_id',
    output: 'grade_id',
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id',
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
    hidden: false
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
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
    single: true,
    hidden: false
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    single: true
  }
  ],
  [ROLES.ACADEMICCOORDINATOR]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true,
    hidden: false
  }, {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    single: true

  }
  ],
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
    // loadAtStart: true,
    single: true
  },
  {
    name: GRADE,
    dependencies: [],
    url: GRADEMAPPINGv2,
    params: ['branch_id', 'acad_session', 'subject_id'],
    label: 'grade_name',
    value: 'grade_id',
    output: 'grade_id',
    single: true
  }
  ],
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
    dependencies: [SUBJECT],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'grade_id',
    output: 'grade_id',
    single: true

  }, {
    name: SUBJECT,
    dependencies: [],
    url: SUBJECTMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'subject_name',
    value: 'subject_id',
    output: 'subject_id',
    single: true

  }
  ]
}
