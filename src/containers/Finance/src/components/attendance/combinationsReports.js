import { urls } from '../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SECTION = 'Section'
export const ROLES = { ADMIN: 'Admin', CFO: 'CFO'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/
let { BRANCHv2, SECTIONMAPPINGv2, GRADEMAPPINGv2 } = urls

// let { BRANCHv2 } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_name',
    output: 'branch_id',
    loadAtStart: true
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
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    output: 'section_mapping_id',
    value: 'section_id'
  }

  ],
  [ROLES.CFO]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_name',
    output: 'branch_id',
    loadAtStart: true
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
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id'],
    label: 'section_name',
    output: 'section_mapping_id',
    value: 'section_id'
  }

  ]
}
