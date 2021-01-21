import { urls } from '../../../urls'

export const GRADE = 'Grade'
export const ROLES = { AOLAdmin: 'AOLAdmin' }

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { GRADECHAPTER } = urls

export const COMBINATIONS = {
  [ROLES.AOLAdmin]: [{
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  }
  ]
}
