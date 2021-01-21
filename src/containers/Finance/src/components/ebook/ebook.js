/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
// import { usePdf } from '@mikecousins/react-pdf'

import axios from 'axios'
import { connect } from 'react-redux'
import { CardHeader, makeStyles, Avatar, Button, Grid, Slide, Card, CardMedia, Dialog } from '@material-ui/core'
import { urls } from '../../urls'
import EbookPdf from './ebookPdf'

function Transition (props) {
  return <Slide direction='up' {...props} />
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },

  pager: {
    listStyleType: 'none',
    display: 'flex',
    margin: '0 auto',
    padding: '10px'
  },
  Button: {
    color: '#fff',
    padding: '5px',
    // width: '20vh',
    // 'margin-left': '10px',
    // 'margin-right': '8px',
    width: '90%',
    'margin-left': '12px'
  }

}))

const Ebook = (props) => {
  const { ebook_name: ebookName, ebook_file_type: url, id: ebookId, filteredData: intialData, ebook_link: necrtUrl, ebook_thumbnail: thumbnail } = props
  const canvasRef = useRef(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [open, setOpen] = useState(false)
  const [ebookNum, setEbookNum] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [click, setClick] = useState(false)
  const classes = useStyles()

  // const { pdfDocument } = usePdf({
  //   file: url && url,
  //   // file: 'https://letseduvate.s3.amazonaws.com/prod/media/ebook_media/What_is_your_Name.pdf',
  //   page: 1,
  //   canvasRef
  // })
  const handleDelete = (delId) => {
    axios.delete(urls.EBOOK + '?ebook_id=' + delId, {
      headers: {
        Authorization: 'Bearer ' + props.user
      } })
      .then(res => {
        setData(intialData)
        window.alert('Deleted Successfully')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleClickOpen = () => {
    // setPdfUrl('https://letseduvate.s3.amazonaws.com/prod/media/ebook_media/323_22.pdf')

    if (ebookName.includes('NCERT')) {
      window.open(necrtUrl)
    } else {
      setPdfUrl(url && url)
      setLoading(true)
      setEbookNum(ebookId)

      setOpen(true)
      setClick(true)
      axios.get(`${urls.EbookUser}?ebook_id=${ebookId}`, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
        .then(({ data }) => {
          console.log(data)
          setLoading(false)
          setPageNumber(data.page_number)
          setTimeSpent(data.time_spent)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  console.log(pageNumber)
  let role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  return (
    <div>
      <Card style={role !== 'Subjecthead' && role !== 'Admin' ? { 'background-color': 'lavender', height: '330px' } : { 'background-color': 'lavender', height: '400px' }}>
        <CardMedia >
          <CardHeader
            style={role !== 'Subjecthead' && role !== 'Admin' ? { 'align-items': 'end', height: '100px', padding: '10px' } : { 'align-items': 'end', height: '100px', padding: '10px' }}
            avatar={
              <Avatar aria-label='recipe'
                style={{
                  backgroundColor: '#5d1049',
                  width: '20px',
                  height: '20px',
                  padding: '15px',
                  margin: '-5px',
                  'font-size': '1rem',
                  'border-radius': '0%'
                }}>{ebookName.charAt(0)}</Avatar>
            }
            action={
              role !== 'Subjecthead' && role !== 'Admin'
                ? <Button variant='contained'
                  color='primary' onClick={handleClickOpen}>
                    Read
                </Button> : ''
            }
            title={ebookName}

          />
          {/* {
            ebookName.includes('NCERT')
              ? <img className='canvasstyle' src={thumbnail && thumbnail} onError='https://letseduvate.s3.amazonaws.com/prod/media/no-img.jpg' />
              : <canvas
                className='canvasstyle'
                ref={canvasRef} />

          } */}
          <img className='canvasstyle' src={thumbnail && thumbnail} onError='https://letseduvate.s3.amazonaws.com/prod/media/no-img.jpg' />

          {
            role === 'Subjecthead' || role === 'Admin'
              ? <div style={{ marginTop: '5%' }}>
                <div className={classes.root}>
                  <Grid container spacing={3} style={{ 'margin-left': '-19px' }}>
                    <Grid item xs={6}>
                      <Button
                        // style={{ width: '15vh' }}
                        variant='contained'
                        className={classes.Button}
                        color='primary' onClick={handleClickOpen}>

                        Read
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        // style={{ width: '15vh' }}
                        className={classes.Button}
                        variant='contained'
                        color='primary'
                        onClick={() => handleDelete(ebookId)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </div>

              </div>
              : ''
          }

        </CardMedia>

      </Card>

      {
        !ebookName.includes('NCERT') ? <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}

        >

          <Grid>

            <EbookPdf pageNumber={pageNumber} timeStore={timeSpent} id={ebookNum} url={`${pdfUrl && pdfUrl}`} passLoad={loading} goBackFunction={handleClose} name={ebookName} />

          </Grid>
        </Dialog> : ''

      }

    </div>
  )
}
const mapStateToProps = (state) => ({
  user: state.authentication.user

})

export default connect(mapStateToProps)(Ebook)
