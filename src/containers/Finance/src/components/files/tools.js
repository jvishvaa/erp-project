import React, { useContext } from 'react'

import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import SelectAllIcon from '@material-ui/icons/SelectAll'
import CloudUpload from '@material-ui/icons/CloudUpload'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { FilesContext } from './context'
import Uploader from './uploader'

function Tools () {
  let { selectedFiles, selectAll, unSelectAll, deleteSelected, toggleUploadModal, type, showUploadModal } = useContext(FilesContext)
  return <Card elevation={0} style={{ margin: 16, padding: 8, backgroundColor: 'rgba(247, 247, 247, 0.933)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 1px 0px inset' }}>
    <Grid container>
      <Grid item>
        <Button onClick={() => deleteSelected()} color='primary'>
          <DeleteIcon />DELETE
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={() => selectAll()} color='primary'>
          <SelectAllIcon /> SELECT ALL
        </Button>
      </Grid>
      <Grid item>
        <Button disabled={selectedFiles.length === 0} onClick={() => unSelectAll()} color='primary'>
      UNSELECT ALL
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={() => toggleUploadModal()} style={{ marginRight: 4 }}>
          <CloudUpload />&nbsp;&nbsp;Upload
        </Button>
      </Grid>
      <div style={{ flexGrow: 1 }} />
      <Grid item>
        {selectedFiles.length > 0 && <Typography style={{ padding: 8 }}>{ selectedFiles.length } files selected.</Typography>}
      </Grid>
    </Grid>
    <Uploader open={showUploadModal} toggle={toggleUploadModal} type={type} />
  </Card>
}

// onClick={(event) => setUploadWindowAnchor(event.currentTarget)}

export default Tools
