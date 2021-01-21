import { urls } from '../../../urls'

export const ROLES = { ADMIN: 'Admin',
  SUBJECTHEAD: 'Subjecthead',
  BDM: 'BDM',
  CFO: 'CFO',
  PRINCIPAL: 'Principal',
  ACADEMICCOORDINATOR: 'AcademicCoordinator'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { BRANCHv2 } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: 'Branch',
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],
  [ROLES.CFO]: [{
    name: 'Branch',
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],

  [ROLES.SUBJECTHEAD]: [{
    name: 'Branch',
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],

  [ROLES.BDM]: [{
    name: 'Branch',
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],
  [ROLES.PRINCIPAL]: [{
    name: 'Branch',
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],

  [ROLES.ACADEMICCOORDINATOR]: [{
    name: 'Branch',
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }]
}
