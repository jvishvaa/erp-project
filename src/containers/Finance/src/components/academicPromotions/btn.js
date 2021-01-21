import React from 'react'
import { Button } from '@material-ui/core'

function CustomButton (props = {}) {
  let { style: propsStyle = {}, label, loading, ...restProps } = props
  console.log(propsStyle, restProps)
  const styles = {
    color: 'white',
    backgroundColor: 'rgb(75,92,107)',
    boxShadow: 'rgba(151, 151, 151, 0.15) 0px 3px 1px',
    borderRadius: '2%',
    textTransform: 'capitalize',
    letterSpacing: '0.1em',
    fontSize: '1em',
    ...propsStyle,
    ...loading ? { cursor: 'wait' } : {}
  }
  return <Button
    style={styles}
    {...restProps}
  >
    {label}
  </Button>
}

export default CustomButton
