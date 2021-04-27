import React, { useState, useEffect } from 'react'

import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

/**
 */
function DSExpander (props) {
  let { content1, content2, subTitle1, mainTitle, subTitle2, open } = props
  let [ toggle, setToggle ] = useState(open)
  useEffect(() => {
    setToggle(open)
  }, [open])
  return <div>
    <div id='content1' style={{ display: toggle ? 'block' : 'none', transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)' }}>
      <div>
        {content1}
      </div>
      <ListItem key={props.checkbox1} style={{ height: 30, borderTop: '1px solid rgba(0,0,0,0.2)' }} role={undefined} dense button>
        <Checkbox
          value={props.checkbox1} onChange={props.onChange1} />
        <ListItemText primary={subTitle1} />
      </ListItem>
    </div>
    <ButtonBase onClick={() => {
      props.onClick(!toggle)
      setToggle(!toggle)
    }} style={{ width: '100%', height: 30 }}>
      <div id='center' style={{ width: 'inherit', height: 30, overflow: 'ellipsis', padding: 5, boxShadow: toggle ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' : 'none', transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)' }}>
        <Typography style={{ textAlign: 'left' }}>
          {mainTitle}
        </Typography>
      </div>
    </ButtonBase>
    <div id='content2' style={{ display: toggle ? 'block' : 'none', transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)' }}>
      <ListItem key={props.checkbox2} style={{ height: 30, borderBottom: '1px solid rgba(0,0,0,0.2)' }} role={undefined} dense button>
        <Checkbox
          value={props.checkbox2} onChange={props.onChange2}
        />
        <ListItemText primary={subTitle2} />
      </ListItem>
      <div>
        {content2}
      </div>
    </div>
  </div>
}

export default DSExpander
