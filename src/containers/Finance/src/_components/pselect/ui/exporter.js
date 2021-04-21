import { store } from '../../../_helpers'

class Exporter {
  constructor () {
    this.filter = store.getState().filter
    this.branches = new Set()
    this.grades = new Set()
    this.subjects = new Set()
    this.sections = new Set()
    delete this.filter['apply_all']
    if (this.filter.data) {
      Object.keys(this.filter.data.itemData).forEach(item => {
        this.branches.add(this.filter.data.itemData[item].branch_id)
        this.grades.add(this.filter.data.itemData[item].grade_id)
        if (this.filter.data.itemData[item].type === 4) {
          this.subjects.add(this.filter.data.itemData[item].id)
        } else {
          this.sections.add(this.filter.data.itemData[item].id)
        }
      })
    }
  }
  getJSON () {
    return this.filter
  }
  getArrays () {
    let { branches, grades, sections, subjects } = this
    return { branches: [...branches], grades: [...grades], sections: [...sections], subjects: [...subjects] }
  }
  getBranches () {
    return Array.from(this.branches)
  }
  getGrades () {
    return Array.from(this.grades)
  }
  getSections () {
    return Array.from(this.sections)
  }
  getSubjects () {
    return Array.from(this.subjects)
  }
}

export default Exporter
