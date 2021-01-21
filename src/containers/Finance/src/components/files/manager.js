import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import NoteIcon from '@material-ui/icons/Note'
import CheckedIcon from '@material-ui/icons/CheckCircle'
import OpenIcon from '@material-ui/icons/OpenInNew'
import ButtonBase from '@material-ui/core/ButtonBase'

import './styles.css'
import { FilesContext } from './context'
import DisplayModal from './DisplayModal'

function File (props) {
  let { setSelectedFiles, selectedFiles } = useContext(FilesContext)
  let { file } = props

  return <div>
    <Tooltip title={(file.files.split('/'))[file.files.split('/').length - 1]}>
      <ButtonBase style={{ margin: 8, height: 120, width: 120 }}>
        <Grid
          direction={'column'}
          className={'fileGridItem'}
          justify='space-between'
          onClick={() => {
            if (!selectedFiles.includes(file)) {
              setSelectedFiles((files) => [...files, file])
            } else {
              let files = selectedFiles.filter(selectedFile => selectedFile !== file)
              setSelectedFiles(files)
            }
          }}
          style={{ height: 120, width: 120, padding: 8, overflow: 'hidden' }}
          container>
          <Grid item>
            <Grid container>
              <Grid item>
                <NoteIcon />
              </Grid>
              <div style={{ flexGrow: 1 }} />
              <Grid item>
                {selectedFiles.includes(file) && <CheckedIcon fontSize={'small'} color={'secondary'} />}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90, overflow: 'hidden' }}>{(file.files.split('/'))[file.files.split('/').length - 1]}</Typography>
          </Grid>
          <Grid item>
            <Grid alignItems='flex-start' justify='space-around' style={{ width: '100%' }} container>
              <IconButton style={{ right: '30px' }} onClick={(event) => {
                event.stopPropagation()
                window.open(file.files, '_blank')
              }} color='secondary' aria-label='Add an alarm'>
                <OpenIcon fontSize={'small'} color={'secondary'} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </ButtonBase>
    </Tooltip>
    <DisplayModal file={file} />
  </div>
}
function FileManager () {
  let { files } = useContext(FilesContext)
  return <Grid style={{ minHeight: '40vh' }} container>
    {
      files.map(file => {
        return <File file={file} />
      })
    }
  </Grid>
}

export default FileManager
