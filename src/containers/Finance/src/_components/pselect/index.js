import React from 'react'
import axios from 'axios'
import Dexie from 'dexie'
import { connect } from 'react-redux'

import { urls } from '../../urls'
import PSelect from './pselect'
import { filterActions } from '../../_actions'
import FileSystemAPI from './filesystem_api'

class Loader extends React.Component {
  constructor () {
    super()
    this.state = {
      currentState: 'Loading... (0/3)',
      loaded: false,
      filesystem: new FileSystemAPI()
    }
  }
  async getLatestRevision () {
    let response = {}
    try {
      response = await axios.get(urls.PowerSelectorLatest, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
    } catch (e) {
      throw new Error(e)
    }
    let url = response.data.storage_information
    let revision = Number(response.data.id)
    return {
      url, revision
    }
  }
  async openOrCreateDB (dbName) {
    let DB, createdNow
    try {
      DB = await (new Dexie(dbName).open())
      if (DB) DB = new Dexie('PSDB')
      createdNow = false
    } catch (e) {
      DB = new Dexie('PSDB')
      createdNow = true
    }
    return { DB, createdNow }
  }
  async fetchLatestRevision (url) {
    let { filesystem } = this.state
    let response
    try {
      response = await axios.get(url)
    } catch (e) {
      throw new Error('Unable to get latest revision mapping', e)
    }
    await filesystem.setItem('mapping.json', JSON.stringify(response.data))
    // localStorage.setItem('ps_revision_data', JSON.stringify(response.data))
    // store in service worker
    this.props.storeForWorker(response.data, this.props.selectedItems)
    return response.data
  }

  async addDataToDB (db, mappings, revision) {
    this.setState({ currentState: 'Loading (2/3)' })
    try {
      db.transaction('rw', 'branches', 'grades', 'subjects', 'sections', async () => {
        this.setState({ currentState: 'Loading... (3/3)' })
        await db.branches.clear()
        await db.grades.clear()
        await db.subjects.clear()
        await db.sections.clear()

        await mappings.children.forEach(async (branch, branchIndex) => {
          db.branches.put({ rowIndex: branchIndex, data: branch })
          branch.children.forEach(async (grade, gradeIndex) => {
            db.grades.put({ rowIndex: branchIndex, columnIndex: gradeIndex + 1, data: grade })
            let subjectIndex = 0
            let sectionIndex = 0
            grade.children.forEach(async (child, childIndex) => {
              if (child.type === 4) {
                db.subjects.put({ rowIndex: branchIndex, columnIndex: gradeIndex + 1, index: subjectIndex, data: child })
                subjectIndex++
              } else {
                db.sections.put({ rowIndex: branchIndex, columnIndex: gradeIndex + 1, index: sectionIndex, data: child })
                sectionIndex++
              }
            })
          })
        })
      }).then(res => {
        this.setState({ currentState: 'Successfully updated DB with latest data.', loaded: true })
        localStorage.setItem('ps_revision', revision)
      }).catch(e => console.log('Something went wrong with transaction', e))
    } catch (e) {
      console.log(e)
    }
  }

  async componentDidMount () {
    try {
      // Get the latest revision of powerselector
      let { url, revision } = await this.getLatestRevision()
      let { filesystem } = this.state
      // Open the db of powerselector
      let { DB: db, createdNow } = await this.openOrCreateDB('PSDB')
      const psRevisionData = await filesystem.getItem('mapping.json')
      if (psRevisionData) {
        this.props.storeForWorker(JSON.parse(psRevisionData), this.props.selectedItems)
      }
      // Check the local revision and check latest available revision available
      // If the table created now, push the changes.
      if ((localStorage.getItem('ps_revision') && localStorage.getItem('ps_revision') < revision) || createdNow || !localStorage.getItem('ps_revision') || !psRevisionData) {
        // Get the latest revision
        this.setState({ currentState: 'Loading... (1/3)' })
        let latestMapping = await this.fetchLatestRevision(url)
        await db.version(2).stores({ branches: '[rowIndex], data', grades: 'rowIndex,columnIndex,data', subjects: '[rowIndex+columnIndex+index],[rowIndex+columnIndex], data', sections: '[rowIndex+columnIndex+index],[rowIndex+columnIndex], data' })
        await this.addDataToDB(db, latestMapping, revision)
      } else {
        this.setState({ loaded: true })
      }
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    let { currentState, loaded } = this.state
    return loaded ? <PSelect {...this.props} /> : currentState
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})
const mapDispatchToProps = dispatch => ({
  storeForWorker: (mappings, selectedItems) => dispatch(filterActions.update({ type: 'first_time', content: mappings, selectedItems: selectedItems }))
})
export default connect(mapStateToProps, mapDispatchToProps)(Loader)
