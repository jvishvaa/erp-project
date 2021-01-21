export const paths = {
  home: {
    title: 'Home'
  },
  nonevaluated_all: {
    title: 'All Non Evaluated Homeworks',
    parent: 'home'
  },
  nonevaluated_grouped: {
    title: 'All Non Evaluated Grouped',
    parent: 'home'
  },
  online_class_homeworks: {
    title: 'Onlineclass Homeworks',
    parent: 'home'
  },
  nonevaluated_grouped_homeworks: {
    title: 'All Non Evaluated Homeworks (Grouped)',
    parent: 'nonevaluated_grouped'
  },
  online_class_submission: {
    title: 'Submission',
    parent: 'online_class_homeworks'
  },
  nonevaluated_all_submission: {
    title: 'Submission',
    parent: 'nonevaluated_all'
  },
  nonevaluated_grouped_submission: {
    title: 'Submission',
    parent: 'nonevaluated_grouped_homeworks'
  },
  getParent (item) {
    return item.parent
  },
  getParents (path) {
    let parents = [{ ...this[path], path: path }]
    console.log('item', path, this[path])
    let currentItem = this[path]
    while (this[currentItem.parent]) {
      parents.unshift({ ...this[currentItem.parent], path: currentItem.parent })
      currentItem = this[currentItem.parent]
    }
    return parents
  }
}
