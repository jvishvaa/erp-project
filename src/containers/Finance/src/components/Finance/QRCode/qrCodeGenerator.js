import React, {
  useEffect,
  useState
} from 'react'
import { withStyles, Grid, Button, TextField } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import zipcelx from 'zipcelx'
import readXlsxFile from 'read-excel-file'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { apiActions } from '../../../_actions'
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css'
import * as actionTypes from '../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  item: {
    margin: '10px'
    // position: 'relative'
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  downloadFormat: {
    position: 'absolute',
    marginLeft: '20px',
    color: '#800080',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: 'DodgerBlue'
    }
  }
})

const QRCodeGenerator = ({ classes, session, history, alert, user }) => {
  const [bulkFile, setBulkFile] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  // const [fileName, setFileName] = useState(null)
  useEffect(() => {
    // hi
  }, [])

  const fileChangeHandler = (event) => {
    console.log('my file: ', event.target.files[0])
    const file = event.target.files[0]
    setBulkFile(file)
  }

  const downloadSample = () => {
    const headers = [
      {
        value: 'ERP',
        type: 'string'
      }
    ]
    const config = {
      filename: 'QR_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const getQRHandler = () => {
    let zip = new JSZip()
    const schema = {
      'ERP': {
        prop: 'ERP',
        type: String
      }
    }
    setDataLoading(true)
    readXlsxFile(bulkFile, { schema }).then(({ rows, errors }) => {
      // `errors` have shape `{ row, column, error, value }`.
      if (errors.length !== 0) {
        throw new Error('Excel Format Not Correct')
      }
      const erp = rows.map(item => item.ERP)
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        margin: 1
      }
      erp.map((oneErp, index) => {
        QRCode.toDataURL(`${oneErp}`, opts)
          .then(url => {
            let myString = url
            let res = myString.split(',')
            // var img = zip.folder('images')
            zip.file(`${oneErp}` + '.jpeg', res[1], { base64: true })
            if (index === erp.length - 1) {
              zip.generateAsync({ type: 'blob' }).then(function (content) {
                // see FileSaver.js
                saveAs(content, 'qrcodes.zip')
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      })
      setDataLoading(false)
    }).catch(err => {
      console.log(err)
      alert.warning(err.message || 'Unable to Read Excel')
      setDataLoading(false)
    })
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className={classes.item} xm={3}>
          <TextField
            id='file_upload'
            margin='dense'
            type='file'
            required
            variant='outlined'
            // className={classes.textField}
            inputProps={{ accept: '.xlsx' }}
            helperText={(
              <span>
                <span>Upload Excel Sheet</span>
                <span
                  className={classes.downloadFormat}
                  onClick={downloadSample}
                  onKeyDown={() => { }}
                  role='presentation'
                >
                  Download Format
                </span>
              </span>
            )}
            onChange={fileChangeHandler}
          />
        </Grid>
        <Grid item className={classes.item} xm={3}>
          <Button
            onClick={getQRHandler}
            color='primary'
            style={{ marginTop: '10px', padding: '5px!important' }}
            variant='contained'
          >
            Get
          </Button>
        </Grid>
      </Grid>
      {/* <img src={source} alt='no source' width='200px' height='200px' filename={fileName} /> */}
      {/* {shuffleStatus && shuffleStatus.value === 1 ? pendingShuffleTable() : shuffleStatus && shuffleStatus.value === 2 ? approvedShuffleTable() : rejectedShuffleTable() } */}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

QRCodeGenerator.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  // session: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  // dataLoading: state.finance.common.dataLoader,
  branchPerSession: state.finance.common.branchPerSession
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchStudentShuffle: (session, status, alert, user) => dispatch(actionTypes.fetchStudentShuffle({ session, status, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(QRCodeGenerator)))
