import React, { useState, useEffect } from 'react'
import { Grid, Tabs, Tab,
  //  Paper,
  Card, Badge, CardContent, Button } from '@material-ui/core'
import axios from 'axios'
import { connect } from 'react-redux'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from './chapterConfig'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'

const HidePracticeQuestions = (props) => {
  const [currentTab, setCurrentTab] = useState(0)
  const [chapters, setChapters] = useState([])
  const [gradeId, setGradeId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (data) => {
    if (data.grade_id && data.subject_id) {
      setSubjectId(data.subject_id)
      setLoading(true)
    } else {
      setGradeId(data.grade_id)
      setSubjectId('')
      setLoading(false)
      setChapters([])
    }
  }

  useEffect(() => {
    if (subjectId) {
      getChapters()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeId, subjectId, currentTab])

  const handleTabChange = (event, tab) => {
    setCurrentTab(tab)
    setLoading(true)
  }

  const getChapters = () => {
    console.log(currentTab)
    let path = `${urls.ChapterWiseQuesCount}?grade_id=${gradeId}&subject_id=${subjectId}&feature=practice_questions`
    currentTab === 0 ? path += `&is_hidden=False` : path += `&is_hidden=True`
    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + props.user
      }
    })
      .then(res => {
        setChapters(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        // let { response: { data: { status } = {} } = {} } = err
        console.log(err)
        setLoading(false)
      })
  }

  const handleHide = (id) => {
    const hiddenStatus = currentTab === 0 ? 'True' : 'False'
    axios.put(`${urls.Chapter}${id}/`, { is_hidden: hiddenStatus }, {
      headers: {
        'Authorization': 'Bearer ' + props.user
      }
    })
      .then(res => {
        let filteredChapters = chapters.filter(chapter => chapter.id !== id)
        setChapters(filteredChapters)
      })
      .catch(err => {
        let { response: { data: { status } = {} } = {} } = err
        console.log(err)
        if (status) {
          props.alert.error(status)
        } else {
          props.alert.error('Something went wrong')
        }
      })
  }

  return (
    <React.Fragment>
      <Card style={{ overflow: 'visible' }}>
        <Grid container>
          <Grid item sm={8}>
            <GSelect config={COMBINATIONS} onChange={handleChange} />
          </Grid>
          <Grid item sm={4}>
            {/* <Paper square> */}
            <Tabs
              value={currentTab}
              indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange}
              centered
              style={{ marginTop: 8 }}
            >
              <Tab label='Active' disabled={currentTab === 0 || !subjectId} />
              <Tab label='Hidden' disabled={currentTab === 1 || !subjectId} />
            </Tabs>
            {/* </Paper> */}
          </Grid>
        </Grid>
      </Card>
      {
        loading
          ? <InternalPageStatus label={`Loading Chapters...`} />
          : <Grid container spacing={12} style={{ padding: 10 }}>
            {chapters.map((chapter, index) => (<Grid style={{ margin: 8 }} item>
              <Card style={{ padding: 30, overflow: 'hidden', position: 'relative' }}>
                <CardContent button>
                  {chapter.chapter_name} <br />
                </CardContent>
                <Badge
                  style={{ position: 'absolute', bottom: 20, right: 20 }}
                  badgeContent={chapters.length > 0 && chapter['qns_count']} color='primary' />
                <Button
                  size='small'
                  variant='contained'
                  color='primary'
                  style={{ position: 'absolute', bottom: 7, left: 8 }}
                  onClick={() => { handleHide(chapter.id) }}
                >
                  {currentTab === 0 ? 'Hide' : 'Unhide'}
                </Button>
              </Card>
            </Grid>))
            }
          </Grid>
      }
      {
        !loading && !chapters.length
          ? <h3 style={{ textAlign: 'center', marginTop: 100 }}>No Chapters</h3>
          : ''
      }
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user
  }
}

export default connect(mapStateToProps)(HidePracticeQuestions)
