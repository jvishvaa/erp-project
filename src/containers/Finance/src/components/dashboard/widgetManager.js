import Widgets from './widgets'

class WidgetManager {
  constructor (role) {
    this.activeWidgets = []
    this.defaultWidgets = Widgets[role]
  }
  add (id) {

  }
  initializeAll () {
    this.activeWidgets = Widgets
    if (this.defaultWidgets) {
      return Array.isArray(this.defaultWidgets) ? this.defaultWidgets : []
    } else {
      return []
    }
  }

  remove () {

  }
}

export default WidgetManager
