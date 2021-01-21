import { urls } from '../../../urls'

export const BRANCH = 'Branch'
export const ROLES = {
  ADMIN: 'Admin',
  MANGEMENTADMIN: 'Management Admin'

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

  [ROLES.ADMIN]: [
    {
      name: BRANCH,
      dependencies: [],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'branch_id',
      loadAtStart: true,
      single: true
    }
  ],
  [ROLES.MANGEMENTADMIN]: [
    {
      name: BRANCH,
      dependencies: [],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'branch_id',
      loadAtStart: true,
      single: true
    }
  ]

}
