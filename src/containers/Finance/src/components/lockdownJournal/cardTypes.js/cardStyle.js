import React, { useState } from 'react'
import { Grid, Card, CardHeader, Typography, CardContent } from '@material-ui/core'
import ViewJournal from '../components/modal'

function LockdownCards ({ loadingStatus, listOfJournals }) {
  const [click, setClick] = useState(false)
  const [studentId, setStudentId] = useState(0)
  const [openModel, setOpenModel] = useState(false)

  const viewFile = (id) => {
    setStudentId(id)
    setClick(true)
    setOpenModel(!openModel)
    console.log(id)
  }
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={6} >
          {
            listOfJournals && listOfJournals.map(item => {
              return (
                <Card
                  onClick={() => viewFile(item.student_id)}
                  style={{
                    display: 'flex',
                    textAlign: 'start',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    padding: 16,
                    backgroundImage: `url("/folder.svg")`,
                    width: window.isMobile ? ((window.screen.width / 2) - 48) : 295,
                    height: window.isMobile ? ((window.screen.width / 2) - 48) * 0.717 : 211,
                    backgroundSize: 'cover' }}
                >
                  <CardHeader

                    title={item.name}
                  />
                  <CardContent>
                    <Typography>LockDown Journal</Typography>
                  </CardContent>

                </Card>
              )
            })
          }
        </Grid>
      </Grid>

      {
        click
          ? <ViewJournal loadingStatus={loadingStatus} open={openModel} toggle={() => setOpenModel(!openModel)} id={studentId} /> : ''
      }
    </React.Fragment>
  )
}

export default LockdownCards
