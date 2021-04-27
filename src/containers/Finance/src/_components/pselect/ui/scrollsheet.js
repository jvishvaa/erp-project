import React from 'react'

function ScrollSheet (props) {
  let { filteredBranches, currentIndex } = props
  return <React.Fragment>
    <div id='scroll-shadow'style={{ position: 'absolute', left: 0, top: 0, width: '200px', transition: 'top 300ms', boxShadow: 'rgba(255, 255, 255, 0.16) 6px 0px 6px, rgba(130, 130, 130, 0.23) 8px -1px 6px', height: 300, zIndex: 300 }} />
    <div id='scroll-container' style={{ position: 'absolute', left: 0, top: 40, height: 260, width: '200px', transition: 'top 300ms', zIndex: 6000, overflow: 'auto' }} >
      { filteredBranches.map((branch, value) => {
        return <div id='pscontainer-row' onClick={() => props.setCurrentItem(value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: currentIndex === value && '#E0E0E0', width: '100%', transition: 'all 300ms' }}>
          <div>{branch}</div>
        </div>
      })
      }
    </div>
  </React.Fragment>
}

export default ScrollSheet
