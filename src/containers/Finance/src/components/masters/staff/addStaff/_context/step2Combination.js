/**
 * @type {Array}
 * @description - Combination of mapping for lead teacher.
 */
export const leadTeacherCombination = {
  LeadTeacher: [
    {
      name: 'Branch',
      dependencies: ['Grade'],
      keep: true
    },
    {
      name: 'Grade',
      dependencies: ['Subject'],
      keep: false
    },
    {
      name: 'Subject',
      dependencies: [],
      keep: false
    }
  ]
}
