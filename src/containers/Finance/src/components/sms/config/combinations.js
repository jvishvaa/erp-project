import { urls } from '../../../urls'

export const BRANCH = 'Branch'
export const ROLES = { ADMIN: 'Admin',
  PRINCIPAL: 'Principal',
  EAACADEMICS: 'EA Academics'
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
    name: BRANCH,
    url: BRANCHv2,
    dependencies: [],
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],
  [ROLES.PRINCIPAL]: [{
    name: BRANCH,
    url: BRANCHv2,
    dependencies: [],
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    url: BRANCHv2,
    dependencies: [],
    label: 'branch_name',
    output: 'branch_id',
    value: 'branch_id',
    loadAtStart: true,
    single: true
  }]
}
