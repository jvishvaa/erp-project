// const React = require('react')
// const ReactDataGrid = require('react-data-grid');
// const exampleWrapper = require('../components/exampleWrapper');
const React = require('react')
// const { Toolbar, Filters: { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter }, Data: { Selectors } } = require('react-data-grid-addons');

class OMSHeader extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { }
  }

  getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString()
  };

  render () {
    return (
      <div className='header'>
        <h1>OMS</h1>
      </div>
    )
  }
}

// const exampleDescription = (
//   <p>Using the same approach as regular Filters setting <code>column.filterable = true</code>, Custom Filters can be implemented and applied as below. Add the attribute <code>code.filterRenderer = NumberFilterableHeaderCell</code> to the column object will
//   allow having a Numeric Filter.</p>
// );

// module.exports = exampleWrapper({
//   WrappedComponent: Example,
//   exampleName: 'Custom Filters Example',
//   exampleDescription,
//   examplePath: './scripts/example22-custom-filters.js',
//   examplePlaygroundLink: undefined
// });
export default OMSHeader
