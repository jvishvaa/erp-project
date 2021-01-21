import { urls } from '../../../../urls'
/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Commonly used constants for easy reference.
 * @type {Object}
 */

export const GRADE = 'Grade'
export const SECTION = 'Section'
export const ROLES = { ADMIN: 'Admin' }

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { BRANCHv2, SECTIONMAPPINGv2, GRADEMAPPINGv2 } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: 'Branch',
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
    // hidden: true
  }, {
    name: 'Grade',
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  },
  {
    name: 'Section',
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }
  ] }
