import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer, Divider, Popover } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import classNames from 'classnames'
import TreeView from '@material-ui/lab/TreeView'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Typography from '@material-ui/core/Typography'
// import { SupervisedUserCircle } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import TreeItem from '@material-ui/lab/TreeItem'
import { connect } from 'react-redux'
import ClearIcon from '@material-ui/icons/ClearRounded'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { viewActions } from '../../../_actions'
import sideBarRoutes from '../../sideBarRoutes'
// import Urlhistory from '../../urlhistory'

const drawerWidth = 240

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)'
    }
  },
  content: {
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2)
    }
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1),
    color: '#8e1559'
    //  '#821240'
  },
  labelText: {
    fontWeight: 'inherit',
    color: 'rgba(0,0,0,0.88)',
    flexGrow: 1
  }
}))

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 400
  },
  drawerOpen: {
    width: drawerWidth,
    paddingTop: 18,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    paddingTop: 18,
    width: 64,
    [theme.breakpoints.up('sm')]: {
      width: 64
    }
  },
  toolbar: {
    position: 'sticky',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.4)'
  }
}))

function Sidebar (props) {
  const classes = useStyles()
  const [open, setOpen] = useState(props.open)
  const [expandedNodes, setExpandedNodes] = useState([])
  const [expandedSubMenuNodes, setExpandedSubMenuNodes] = useState([])
  const [searchText, setSearchText] = useState('')
  const [textField, setTextField] = useState()
  const [ subMenuAnchorPosition, setSubMenuAnchorPosition ] = useState(null)
  const [ subMenuOpen, setSubMenuOpen ] = useState()
  const [ subMenuContent, setSubMenuContent ] = useState('')
  // const [•NodeId, set•NodeId] = useState()
  const [filteredRoutes, setFilteredRoutes] = useState([])
  useEffect(() => {
    setOpen(props.open)
    setSearchText('')
    if (!props.open) setExpandedNodes([])
  }, [props.open])
  useEffect(() => {
    textField && textField.focus()
  }, [filteredRoutes, textField])
  // function handleSubMenuClose (event) {
  //   setSubMenuAnchorPosition(null)
  // }
  function StyledTreeItem (props) {
    const classes = useTreeItemStyles()
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, open, ...other } = props
    let currentLocation = props.history && props.history.location && props.history.location.pathname
    if (props.path && LabelIcon) {
      return <TreeItem
        nodeId={props.nodeId}
        onClick={() => props.history.push(props.path)}
        // en([...results]dIcon={React.isValidElement(LabelIcon) ? LabelIcon : SupervisedUserCircle}
        label={
          <div onClick={() => console.log(props.path, 'Clicked')} className={classes.labelRoot}>
            <LabelIcon color='rgba(0,0,0,0.88)' className={classes.labelIcon} />
            {open && <><Typography variant='body2' className={classes.labelText}>
              {labelText}
              {currentLocation && props.path === currentLocation && <span style={{ color: 'red' }}> •</span>}
            </Typography>
              <Typography variant='caption' color='inherit'>
                {labelInfo}
              </Typography></>}
          </div>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': bgColor
        }}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          group: classes.group,
          label: classes.label
        }}
        {...other}
      />
    } else if (LabelIcon) {
      return (
        <TreeItem
          nodeId={props.nodeId}
          //   endIcon={React.isValidElement(LabelIcon) ? LabelIcon : SupervisedUserCircle}
          collapseIcon={<ArrowDropDownIcon />}
          expandIcon={<ArrowRightIcon />}
          label={
            <div onMouseOver={(event) => {
              if (!open) {
                let clientRect = event.target.getBoundingClientRect()
                setSubMenuOpen(true); setSubMenuContent(props.content)
                setSubMenuAnchorPosition({ top: clientRect.top, left: 64 })
              }
            }} className={classes.labelRoot}>
              <LabelIcon color='inherit' className={classes.labelIcon} />

              {open && <><Typography variant='body2' className={classes.labelText}>
                {labelText}
                {currentLocation && props.path === currentLocation && '•'}
              </Typography>
                <Typography variant='caption' color='inherit'>
                  {labelInfo}
                </Typography></>}
            </div>
          }
          style={{
            '--tree-view-color': color,
            '--tree-view-bg-color': bgColor
          }}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            group: classes.group,
            label: classes.label
          }}
          {...other}
        />
      )
    } else {
      return <TreeItem
        nodeId={props.nodeId}
        //   endIcon={React.isValidElement(LabelIcon) ? LabelIcon : SupervisedUserCircle}
        onClick={() => { props.path && props.history.push(props.path) }}
        collapseIcon={<ArrowDropDownIcon />}
        expandIcon={<ArrowRightIcon />}
        label={
          <div className={classes.labelRoot}>
            {open && <><Typography variant='body2' className={classes.labelText}>
              {labelText}
              {currentLocation && props.path === currentLocation && '•'}
            </Typography>
              <Typography variant='caption' color='inherit'>
                {labelInfo}
              </Typography></>}
          </div>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': bgColor
        }}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          group: classes.group,
          label: classes.label
        }}
        {...other}
      />
    }
  }
  function StyledSubMenuTreeItem (props) {
    const classes = useTreeItemStyles()
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, open, ...other } = props
    let currentLocation = props.history && props.history.location && props.history.location.pathname
    if (props.path && LabelIcon) {
      return <TreeItem
        nodeId={props.nodeId}
        onClick={() => { setSubMenuOpen(false); props.history.push(props.path) }}
        // en([...results]dIcon={React.isValidElement(LabelIcon) ? LabelIcon : SupervisedUserCircle}
        label={
          <div className={classes.labelRoot}>
            <LabelIcon color='rgba(0,0,0,0.88)' className={classes.labelIcon} />
            {open && <><Typography variant='body2' className={classes.labelText}>
              {labelText}
              {currentLocation && props.path === currentLocation && <span style={{ color: 'red' }}> •</span>}
            </Typography>
              <Typography variant='caption' color='inherit'>
                {labelInfo}
              </Typography></>}
          </div>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': bgColor
        }}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          group: classes.group,
          label: classes.label
        }}
        {...other}
      />
    } else if (LabelIcon) {
      return (
        <TreeItem
          nodeId={props.nodeId}
          //   endIcon={React.isValidElement(LabelIcon) ? LabelIcon : SupervisedUserCircle}
          collapseIcon={<ArrowDropDownIcon />}
          expandIcon={<ArrowRightIcon />}
          label={
            <div className={classes.labelRoot}>
              <LabelIcon color='inherit' className={classes.labelIcon} />

              {open && <><Typography variant='body2' className={classes.labelText}>
                {labelText}
                {currentLocation && props.path === currentLocation && '•'}
              </Typography>
                <Typography variant='caption' color='inherit'>
                  {labelInfo}
                </Typography></>}
            </div>
          }
          style={{
            '--tree-view-color': color,
            '--tree-view-bg-color': bgColor
          }}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            group: classes.group,
            label: classes.label
          }}
          {...other}
        />
      )
    } else {
      return <TreeItem
        nodeId={props.nodeId}
        //   endIcon={React.isValidElement(LabelIcon) ? LabelIcon : SupervisedUserCircle}
        onClick={() => { setSubMenuOpen(false); props.path && props.history.push(props.path) }}
        collapseIcon={<ArrowDropDownIcon />}
        expandIcon={<ArrowRightIcon />}
        label={
          <div className={classes.labelRoot}>
            {open && <><Typography variant='body2' className={classes.labelText}>
              {labelText}
              {currentLocation && props.path === currentLocation && '•'}
            </Typography>
              <Typography variant='caption' color='inherit'>
                {labelInfo}
              </Typography></>}
          </div>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': bgColor
        }}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          group: classes.group,
          label: classes.label
        }}
        {...other}
      />
    }
  }
  function renderSubMenuContent (content) {
    return Array.isArray(content) && content.map((item, index) => {
      //   let { icon: ItemIcon } = item
      if (Array.isArray(item.content)) {
        return (<StyledSubMenuTreeItem open labelIcon={item.icon} nodeId={String(index)} content={item.content} labelText={item.sidebarName} >
          {item.content.map((subitem, subIndex) => {
            if (Array.isArray(subitem.content) && subitem.content.length > 0) {
              return <StyledSubMenuTreeItem open labelIcon={subitem.icon} nodeId={index + '/' + subIndex} labelText={subitem.sidebarName} >
                {subitem.content.map((nestedItem, nestedItemIndex) => {
                  return <StyledSubMenuTreeItem open labelIcon={nestedItem.icon} history={props.history} path={nestedItem.path} nodeId={index + '/' + subIndex + '/' + nestedItemIndex} labelText={nestedItem.sidebarName} />
                })
                }
              </StyledSubMenuTreeItem>
            } else {
              return <StyledSubMenuTreeItem open labelIcon={subitem.icon} history={props.history} path={subitem.path} nodeId={index + '/' + subIndex} labelText={subitem.sidebarName} />
            }
          })}
        </StyledSubMenuTreeItem>)
      }
      return <StyledSubMenuTreeItem open labelIcon={item.icon} history={props.history} path={item.path} nodeId={String(index)} labelText={item.sidebarName} />
    })
  }
  function onSearch (event) {
    if (!textField) setTextField(event.target)
    if (event.target.value.length > 0) {
      setSearchText(event.target.value)
      Promise.resolve(searchAndSetValue(event))
    } else { setSearchText(event.target.value) }
  }
  function searchAndSetValue ({ target }) {
    let { value } = target
    var user = JSON.parse(localStorage.getItem('user_profile'))
    let role = user && user.personal_info.role
    let mainItems = sideBarRoutes[role]
    let results = new Set()
    mainItems.forEach(item => {
      if (item.sidebarName && item.sidebarName.toLowerCase().includes(value.toLowerCase())) {
        results.add(item)
      }
      if (item.content) {
        item.content.forEach(subItem => {
          if (subItem.sidebarName.toLowerCase().includes(value.toLowerCase())) {
            let exists = [...results].filter(item => item.sidebarName === subItem.sidebarName)
            if (exists.length === 0 && ((Array.isArray(subItem.content) && subItem.content.length === 0) || !Array.isArray(subItem.content))) {
              results.add(subItem)
            }
          }
          if (Array.isArray(subItem.content) && subItem.content.length > 0) {
            subItem.content.forEach(nestedSubItem => {
              if (nestedSubItem.sidebarName.toLowerCase().includes(value.toLowerCase())) {
                results.add(nestedSubItem)
              }
            })
          }
        })
      }
    })
    setFilteredRoutes([...results])
  }
  function renderSidebarTree (open) {
    var user = JSON.parse(localStorage.getItem('user_profile'))
    let role = user && user.personal_info.role
    if (searchText.length > 0) {
      return filteredRoutes.length > 0 ? <TreeView
        className={classes.root}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        expanded={expandedNodes}
        onNodeToggle={(event, nodeIds) => setExpandedNodes(nodeIds)}
      >
        {filteredRoutes.map((item, index) => {
          if (Array.isArray(item.content)) {
            return (<StyledTreeItem open={open} labelIcon={item.icon} nodeId={String(index)} content={item.content} labelText={item.sidebarName} >
              {item.content.map((subitem, subIndex) => {
                if (Array.isArray(subitem.content) && subitem.content.length > 0) {
                  return <StyledTreeItem open={open} labelIcon={subitem.icon} nodeId={index + '/' + subIndex} labelText={subitem.sidebarName} >
                    {subitem.content.map((nestedItem, nestedItemIndex) => {
                      return <StyledTreeItem open={open} labelIcon={nestedItem.icon} history={props.history} path={nestedItem.path} nodeId={index + '/' + subIndex + '/' + nestedItemIndex} labelText={nestedItem.sidebarName} />
                    })
                    }
                  </StyledTreeItem>
                } else {
                  return <StyledTreeItem open={open} labelIcon={subitem.icon} history={props.history} path={subitem.path} nodeId={index + '/' + subIndex} labelText={subitem.sidebarName} />
                }
              })}
            </StyledTreeItem>)
          }
          return <StyledTreeItem open={open} labelIcon={item.icon} history={props.history} path={item.path} nodeId={String(index)} labelText={item.sidebarName} />
        })}</TreeView> : 'No results found.'
    } else {
      return <TreeView
        className={classes.root}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        expanded={expandedNodes}
        onNodeToggle={(event, nodeIds) => setExpandedNodes(nodeIds)}
      >
        {sideBarRoutes && sideBarRoutes[role] && sideBarRoutes[role].map((item, index) => {
          //   let { icon: ItemIcon } = item
          if (Array.isArray(item.content)) {
            return (<StyledTreeItem open={open} labelIcon={item.icon} nodeId={String(index)} content={item.content} labelText={item.sidebarName} >
              {item.content.map((subitem, subIndex) => {
                if (Array.isArray(subitem.content) && subitem.content.length > 0) {
                  return <StyledTreeItem open={open} labelIcon={subitem.icon} nodeId={index + '/' + subIndex} labelText={subitem.sidebarName} >
                    {subitem.content.map((nestedItem, nestedItemIndex) => {
                      return <StyledTreeItem open={open} labelIcon={nestedItem.icon} history={props.history} path={nestedItem.path} nodeId={index + '/' + subIndex + '/' + nestedItemIndex} labelText={nestedItem.sidebarName} />
                    })
                    }
                  </StyledTreeItem>
                } else {
                  return <StyledTreeItem open={open} labelIcon={subitem.icon} history={props.history} path={subitem.path} nodeId={index + '/' + subIndex} labelText={subitem.sidebarName} />
                }
              })}
            </StyledTreeItem>)
          }
          return <StyledTreeItem open={open} labelIcon={item.icon} history={props.history} path={item.path} nodeId={String(index)} labelText={item.sidebarName} />
        })}</TreeView>
    }
  }
  return !props.withoutBase ? <><Drawer
    variant={document.documentElement.clientWidth > 600 ? 'permanent' : 'temporary'}
    className={classNames(classes.drawer, {
      [classes.drawerOpen]: open,
      [classes.drawerClose]: !open
    })}
    classes={{
      paper: classNames({
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })
    }}
    onClose={props.toggle}
    open={open}
  >
    <div className={classes.toolbar}>
      <IconButton onClick={props.toggleSidebar}>
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <Divider />
    {open && <div style={{ position: 'sticky', top: '48px', left: 0, padding: 8, transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)', background: '#ffffffd1' }}>
      <div style={{ position: 'relative', backgroundColor: 'rgb(226, 226, 226)', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}><div style={{ position: 'absolute', marginLeft: '8px', top: '3px', color: 'white' }}><SearchIcon style={{ color: 'rgba(0,0,0,0.7)' }} /></div><div style={{ marginLeft: '42px' }}><Input
        type='search'
        placeholder='Search…'
        onChange={onSearch}
        value={searchText}
        endAdornment={
          searchText.length > 0 && <InputAdornment position='end'>
            <IconButton
              size={'small'}
              disableFocusRipple
              aria-label='toggle password visibility'
              onClick={() => setSearchText('')}
            >
              { <ClearIcon />}
            </IconButton>
          </InputAdornment>
        }
        autoFocus
        style={{ color: '#000' }}
      /></div></div>
      {/* <Urlhistory alert={props.alert} /> */}
    </div>}
    <div style={{ marginTop: 8 }}>
      {renderSidebarTree(props.open)}
    </div></Drawer>
    <Popover
      open={subMenuOpen}
      anchorReference='anchorPosition'
      anchorPosition={subMenuAnchorPosition}
      onClose={() => setSubMenuOpen(false)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        expanded={expandedSubMenuNodes}
        onNodeToggle={(event, nodeIds) => setExpandedSubMenuNodes(nodeIds)}
      >
        {renderSubMenuContent(subMenuContent)}
      </TreeView>
    </Popover>
  </> : ''
}

const mapStateToProps = state => ({
  open: state.view.sidebar,
  path: state.view.path,
  withoutBase: state.view.withoutBase
})

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(viewActions.toggleSidebar())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sidebar))
