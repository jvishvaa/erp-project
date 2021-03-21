import { store } from '../../_helpers'

class Exporter {
  constructor () {
    this.filter = store.getState().filter
    this.branches = new Set()
    this.grades = new Set()
    this.subjects = new Set()
    this.sections = new Set()
    this.subjectDBIds = new Set()
    this.sectionDBIds = new Set()
    delete this.filter['apply_all']
    if (this.filter.data) {
      Object.keys(this.filter.data.itemData).forEach(item => {
        this.branches.add(this.filter.data.itemData[item].branch_id)
        this.grades.add(this.filter.data.itemData[item].grade_id)
        if (this.filter.data.itemData[item].type === 4) {
          this.subjects.add(this.filter.data.itemData[item].id)
          this.subjectDBIds.add(this.filter.data.itemData[item].db_id)
        } else {
          this.sections.add(this.filter.data.itemData[item].id)
          this.sectionDBIds.add(this.filter.data.itemData[item].db_id)
        }
      })
    }
    console.log(Array.from(this.subjectDBIds))
    console.log(Array.from(this.sectionDBIds))
  }
  getJSON () {
    return this.filter
  }
  getArrays () {
    let { branches, grades, sections, subjects } = this
    return { branches, grades, sections, subjects }
  }
  getBranches () {
    console.log(this.branches)
    return Array.from(this.branches)
  }
  getGrades () {
    console.log(this.grades)
    return Array.from(this.grades)
  }
  getSections () {
    return Array.from(this.sections)
  }
  getSectionDBIds () {
    return Array.from(this.sectionDBIds)
  }
  getSubjectDBIds () {
    return Array.from(this.subjectDBIds)
  }
  getSubjects () {
    return Array.from(this.subjects)
  }
}

export default Exporter
