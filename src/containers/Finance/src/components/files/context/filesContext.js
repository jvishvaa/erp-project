import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { urls } from '../../../urls'

import { store } from '../../../_helpers/store'

export const Context = createContext({})

export const Provider = props => {
  // Initial values are obtained from the props
  const {
    files: initialFiles,
    type,
    children
  } = props
  useEffect(() => {
    console.log(initialFiles)
    setFiles(initialFiles)
  }, [initialFiles])
  // Use State to keep the values
  const [files, setFiles] = useState(initialFiles)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showUploadModal, setUploadModal] = useState(false)
  const selectAll = () => {
    setSelectedFiles(initialFiles)
  }
  const unSelectAll = () => {
    setSelectedFiles([])
  }
  const toggleUploadModal = () => {
    setUploadModal(!showUploadModal)
  }

  async function deleteSelected () {
    await axios.delete(`${urls.FileUpload}?file_id=${selectedFiles.map(file => file.id)}&type=${type}`, {
      headers: {
        Authorization: 'Bearer ' + store.getState().authentication.user
      }
    }).then(() => {
      /* global alert */
      alert('Deleted selected files successfully!')
      setFiles(files.filter(file => !selectedFiles.includes(file)))
      setSelectedFiles([])
    })
  }
  // Make the context object:
  const filesContext = {
    files,
    setFiles,
    selectedFiles,
    setSelectedFiles,
    selectAll,
    unSelectAll,
    deleteSelected,
    showUploadModal,
    toggleUploadModal,
    type
  }

  // pass the value in provider and return
  return <Context.Provider value={filesContext}>{children}</Context.Provider>
}

export const { Consumer } = Context

Provider.propTypes = {
  files: PropTypes.array,
  type: PropTypes.string
}

Provider.defaultProps = {
  files: []
}
