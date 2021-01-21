import { urls } from '../../urls'

export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const ROLES = { AOLAdmin: 'AOLAdmin', Admin: 'Admin', OnlineClassAdmin: 'Online Class Admin' }

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
    loadAtStart: true
  }
  ],
  [ROLES.Admin]: [{
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true
    // single: true
  }
  ],
  [ROLES.OnlineClassAdmin]: [{
    name: GRADE,
    dependencies: [],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true
    // single: true
  }
  ]
}
