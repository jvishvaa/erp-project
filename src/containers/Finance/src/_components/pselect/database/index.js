import dexie from './dexie'

class Database {
  constructor () {
    this.db = dexie
    window.db = dexie
  }
  // temporary code to delete old version of db
  deleteOldDb (callbackFunc) {
    // In the following line, you should include the prefixes of implementations you want to test.
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    indexedDB.databases().then(databases => {
      if (Array.isArray(databases) && databases.length) {
        databases.forEach(database => {
          if (database.name === 'PSDB') {
            if (database.version !== 20) {
              indexedDB.deleteDatabase('PSDB')
              console.log("Old indexDB 'PSDB' deleted..")
              // to avoid error after delete.. cause pselect may look for db
              window.location.reload()
            } else {
              if (callbackFunc) {
                callbackFunc()
              }
            }
          }
        })
      }
      if (callbackFunc) {
        callbackFunc()
      }
    })
  }
  // storeData () {
  //   return this.db.branches.count((count) => {
  //     if (count > 0) {
  //       console.log('Already populated')
  //       this.deleteOldDb()
  //     } else {
  //       mappings.children.forEach(async (branch, branchIndex) => {
  //         this.db.branches.put({ rowIndex: branchIndex, data: branch })
  //         branch.children.forEach(async (grade, gradeIndex) => {
  //           this.db.grades.put({ rowIndex: branchIndex, columnIndex: gradeIndex + 1, data: grade })
  //           let subjectIndex = 0
  //           let sectionIndex = 0
  //           grade.children.forEach(async (child, childIndex) => {
  //             if (child.type === 4) {
  //               this.db.subjects.put({ rowIndex: branchIndex, columnIndex: gradeIndex + 1, index: subjectIndex, data: child })
  //               subjectIndex++
  //             } else {
  //               this.db.sections.put({ rowIndex: branchIndex, columnIndex: gradeIndex + 1, index: sectionIndex, data: child })
  //               sectionIndex++
  //             }
  //           })
  //         })
  //       })
  //     }
  //   })
  // }
  // getCount () {
  //   let columnCount = 1; let rowCount = 1
  //   return { columnCount, rowCount }
  // }
  getAllBranches () {
    return this.db.branches.toCollection().toArray()
  }
  getGrades (rowIndex) {
    return this.db.grades.where({
      rowIndex
    }).toArray()
  }

  retrieveData (rowIndex, columnIndex, type) {
    return new Promise((resolve, reject) => {
      switch (type) {
        case 1 : (String(rowIndex)) && this.db.branches.get([rowIndex]).then(res => resolve(res)).catch(e => reject(e)); break
        case 2 : (String(rowIndex) && String(columnIndex)) && this.db.grades.where('[rowIndex+columnIndex]').equals([rowIndex, columnIndex]).toArray().then(res => resolve(res)).catch(e => reject(e)); break
        case 3 : (String(rowIndex) && String(columnIndex)) && this.db.sections.where({
          rowIndex: rowIndex,
          columnIndex: columnIndex
        }).toArray().then(res => resolve(res)).catch(e => reject(e)); break
        case 4 : (String(rowIndex) && String(columnIndex)) && this.db.subjects.where({
          rowIndex: rowIndex,
          columnIndex: columnIndex
        }).toArray().then(res => resolve(res)).catch(e => reject(e)); break
      }
    })
  }
}

export default Database
