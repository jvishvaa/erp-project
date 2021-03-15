import React from 'react'

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  // width: 100,
  // height: 100,
  width: '50%',
  height: '100%',
  // width: '100%',
  // height: '100%',
  padding: 4,
  boxSizing: 'border-box'
}
// const thumbsContainer = {
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   marginTop: 16
// }
const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const img = {

  display: 'block',
  width: 'auto',
  // height: '100%',
  maxWidth: '100%',
  height: 'auto'
}

const Thumbs = ({ files }) => files.map(file => (
  <div style={thumb} key={file.name}>
    <div style={thumbInner}>
      <img
        src={file.preview}
        style={img}
        {...file.alt ? { alt: file.alt } : {}}
      />
    </div>
  </div>
))
export default Thumbs
