import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
// import AuthService from '../AuthService'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import { Toolbar } from '../../ui'

import { urls } from '../../urls'

import FileManager from './manager'
import { apiActions } from '../../_actions'
import Tools from './tools'

import { FilesContextProvider } from './context'

function TabContainer (props) {
  return (
    <Typography component='div' style={{ paddingTop: 2 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

function Files (props) {
  const [tab, setTab] = useState(0)
  const [academicFiles, setAcademicFiles] = useState([])
  const [otherFiles, setOtherFiles] = useState([])

  useEffect(() => {
    async function fetchFiles () {
      const res = await axios.get(urls.FileUpload, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
      setAcademicFiles(res.data.academic_url_list)
      setOtherFiles(res.data.other_url_list)
    }
    fetchFiles()
  }, [props.user])

  return <div>
    <Toolbar
      containerStyle={{ padding: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}
      style={{ padding: 0 }}>
      <Tabs value={tab} onChange={(event, value) => setTab(value)}>
        <Tab label='ACADEMIC' />
        <Tab label='OTHER' />
      </Tabs>
    </Toolbar>
    <FilesContextProvider files={academicFiles} type={'academic'}>
      {tab === 0 && <TabContainer>
        <Tools />
        <Card elevation={0} style={{ margin: 16, padding: 16, backgroundColor: 'rgba(247, 247, 247, 0.933)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 1px 0px inset' }}>
          {academicFiles.length > 0 ? <FileManager /> : 'No files found.'}
        </Card>
      </TabContainer>}
    </FilesContextProvider>
    <FilesContextProvider files={otherFiles} type={'other'}>
      {tab === 1 && <TabContainer>
        <Tools />
        <Card elevation={0} style={{ margin: 16, padding: 16, backgroundColor: 'rgba(247, 247, 247, 0.933)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 1px 0px inset' }}>
          <FileManager />
        </Card>
      </TabContainer>}
    </FilesContextProvider>
  </div>
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.grades.items
})

const mapDispatchToProps = dispatch => ({
  loadGrades: dispatch(apiActions.listGrades())
})
export default connect(mapStateToProps, mapDispatchToProps)(Files)
