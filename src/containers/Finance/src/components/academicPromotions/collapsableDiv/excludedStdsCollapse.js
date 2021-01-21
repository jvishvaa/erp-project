
import React from 'react'
import NestedList from './nestedList'

class ExcludedStdsCollapseBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleItemClick = this.handleItemClick.bind(this)
  }
  //   items = [{
  //     erp: '1905040587',
  //     from_grade: 'Grade 1',
  //     from_section: 'Sec I',
  //     id: 30442,
  //     name: ' JAANAVI CHANDAN',
  //     to_grade: 'Grade 2',
  //     to_section: 'Sec I'
  //   }]
  handleItemClick (itemId, index, item) {
    this.props.handleItemClick(itemId, index, item)
  }
  render () {
    let { title, items, ...restProps } = this.props
    title = `${title} - ( ${Array.isArray(items) ? items.length : ''} )`
    items = items || []
    items = items.map(item => {
      let { erp, name, from_grade: fromGrade, from_section: fromSection, to_grade: toGrade, to_section: toSection } = item
      let from = ` \nFrom: ${fromGrade} - ${fromSection}`
      let to = ` \nTo: ${toGrade} - ${toSection}`
      let label = ` ${erp} -${name} ${from} ${to}`
      return { ...item, label }
    })
    return <NestedList title={title} items={items || []} onItemClick={this.handleItemClick} {...restProps} />
  }
}
export default ExcludedStdsCollapseBar
