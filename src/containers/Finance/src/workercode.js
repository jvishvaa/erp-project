
/* global self */
let workercode = () => {
  var SequentialTaskQueue = (function () {
    'use strict'

    /**
       * Standard cancellation reasons. {@link SequentialTaskQueue} sets {@link CancellationToken.reason}
       * to one of these values when cancelling a task for a reason other than the user code calling
       * {@link CancellationToken.cancel}.
       */
    var cancellationTokenReasons = {
      /** Used when the task was cancelled in response to a call to {@link SequentialTaskQueue.cancel} */
      cancel: Object.create(null),
      /** Used when the task was cancelled after its timeout has passed */
      timeout: Object.create(null)
    }
    /**
       * Standard event names used by {@link SequentialTaskQueue}
       */
    var sequentialTaskQueueEvents = {
      drained: 'drained',
      error: 'error',
      timeout: 'timeout'
    }
    /**
       * FIFO task queue to run tasks in predictable order, without concurrency.
       */
    var SequentialTaskQueue = /** @class */ (function () {
      /**
           * Creates a new instance of {@link SequentialTaskQueue}
           * @param options - Configuration options for the task queue.
          */
      function SequentialTaskQueue (options) {
        this.queue = []
        this._isClosed = false
        this.waiters = []
        if (!options) { options = {} }
        this.defaultTimeout = options.timeout
        this.name = options.name || 'SequentialTaskQueue'
        this.scheduler = options.scheduler || SequentialTaskQueue.defaultScheduler
      }
      Object.defineProperty(SequentialTaskQueue.prototype, 'isClosed', {
        /** Indicates if the queue has been closed. Calling {@link SequentialTaskQueue.push} on a closed queue will result in an exception. */
        get: function () {
          return this._isClosed
        },
        enumerable: true,
        configurable: true
      })
      /**
           * Adds a new task to the queue.
           * @param task - The function to call when the task is run
           * @param timeout - An optional timeout (in milliseconds) for the task, after which it should be cancelled to avoid hanging tasks clogging up the queue.
           * @returns A {@link CancellationToken} that may be used to cancel the task before it completes.
           */
      SequentialTaskQueue.prototype.push = function (task, options) {
        var _this = this
        if (this._isClosed) { throw new Error(this.name + ' has been previously closed') }
        var taskEntry = {
          callback: task,
          args: options && options.args ? (Array.isArray(options.args) ? options.args.slice() : [options.args]) : [],
          timeout: options && options.timeout !== undefined ? options.timeout : this.defaultTimeout,
          cancellationToken: {
            cancel: function (reason) { return _this.cancelTask(taskEntry, reason) }
          },
          resolve: undefined,
          reject: undefined
        }
        taskEntry.args.push(taskEntry.cancellationToken)
        this.queue.push(taskEntry)
        this.scheduler.schedule(function () { return _this.next() })
        var result = new Promise(function (resolve, reject) {
          taskEntry.resolve = resolve
          taskEntry.reject = reject
        })
        result.cancel = function (reason) { return taskEntry.cancellationToken.cancel(reason) }
        return result
      }
      /**
           * Cancels the currently running task (if any), and clears the queue.
           * @returns {Promise} A Promise that is fulfilled when the queue is empty and the current task has been cancelled.
           */
      SequentialTaskQueue.prototype.cancel = function () {
        var _this = this
        if (this.currentTask) { this.cancelTask(this.currentTask, cancellationTokenReasons.cancel) }
        var queue = this.queue.splice(0)
        // Cancel all and emit a drained event if there were tasks waiting in the queue
        if (queue.length) {
          queue.forEach(function (task) { return _this.cancelTask(task, cancellationTokenReasons.cancel) })
          this.emit(sequentialTaskQueueEvents.drained)
        }
        return this.wait()
      }
      /**
           * Closes the queue, preventing new tasks to be added.
           * Any calls to {@link SequentialTaskQueue.push} after closing the queue will result in an exception.
           * @param {boolean} cancel - Indicates that the queue should also be cancelled.
           * @returns {Promise} A Promise that is fulfilled when the queue has finished executing remaining tasks.
           */
      SequentialTaskQueue.prototype.close = function (cancel) {
        if (!this._isClosed) {
          this._isClosed = true
          if (cancel) { return this.cancel() }
        }
        return this.wait()
      }
      /**
           * Returns a promise that is fulfilled when the queue is empty.
           * @returns {Promise}
           */
      SequentialTaskQueue.prototype.wait = function () {
        var _this = this
        if (!this.currentTask && this.queue.length === 0) { return Promise.resolve() }
        return new Promise(function (resolve) {
          _this.waiters.push(resolve)
        })
      }
      /**
           * Adds an event handler for a named event.
           * @param {string} evt - Event name. See the readme for a list of valid events.
           * @param {Function} handler - Event handler. When invoking the handler, the queue will set itself as the `this` argument of the call.
           */
      SequentialTaskQueue.prototype.on = function (evt, handler) {
        this.events = this.events || {};
        (this.events[evt] || (this.events[evt] = [])).push(handler)
      }
      /**
           * Adds a single-shot event handler for a named event.
           * @param {string} evt - Event name. See the readme for a list of valid events.
           * @param {Function} handler - Event handler. When invoking the handler, the queue will set itself as the `this` argument of the call.
           */
      SequentialTaskQueue.prototype.once = function (evt, handler) {
        var _this = this
        var cb = function () {
          var args = []
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i]
          }
          _this.removeListener(evt, cb)
          handler.apply(_this, args)
        }
        this.on(evt, cb)
      }
      /**
           * Removes an event handler.
           * @param {string} evt - Event name
           * @param {Function} handler - Event handler to be removed
           */
      SequentialTaskQueue.prototype.removeListener = function (evt, handler) {
        if (this.events) {
          var list = this.events[evt]
          if (list) {
            var i = 0
            while (i < list.length) {
              if (list[i] === handler) { list.splice(i, 1) } else { i++ }
            }
          }
        }
      }
      /** @see {@link SequentialTaskQueue.removeListener} */
      SequentialTaskQueue.prototype.off = function (evt, handler) {
        return this.removeListener(evt, handler)
      }
      SequentialTaskQueue.prototype.emit = function (evt) {
        var _this = this
        var args = []
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i]
        }
        if (this.events && this.events[evt]) {
          try {
            this.events[evt].forEach(function (fn) { return fn.apply(_this, args) })
          } catch (e) {
            console.error(this.name + ": Exception in '" + evt + "' event handler", e)
          }
        }
      }
      SequentialTaskQueue.prototype.next = function () {
        var _this = this
        // Try running the next task, if not currently running one
        if (!this.currentTask) {
          var task = this.queue.shift()
          // skip cancelled tasks
          while (task && task.cancellationToken.cancelled) { task = this.queue.shift() }
          if (task) {
            try {
              this.currentTask = task
              if (task.timeout) {
                task.timeoutHandle = setTimeout(function () {
                  _this.emit(sequentialTaskQueueEvents.timeout)
                  _this.cancelTask(task, cancellationTokenReasons.timeout)
                }, task.timeout)
              }
              var res = task.callback.apply(undefined, task.args)
              if (res && isPromise(res)) {
                res.then(function (result) {
                  task.result = result
                  _this.doneTask(task)
                }, function (err) {
                  _this.doneTask(task, err)
                })
              } else {
                task.result = res
                this.doneTask(task)
              }
            } catch (e) {
              this.doneTask(task, e)
            }
          } else {
            // queue is empty, call waiters
            this.callWaiters()
          }
        }
      }
      SequentialTaskQueue.prototype.cancelTask = function (task, reason) {
        task.cancellationToken.cancelled = true
        task.cancellationToken.reason = reason
        this.doneTask(task)
      }
      SequentialTaskQueue.prototype.doneTask = function (task, error) {
        var _this = this
        if (task.timeoutHandle) { clearTimeout(task.timeoutHandle) }
        task.cancellationToken.cancel = noop
        if (error) {
          this.emit(sequentialTaskQueueEvents.error, error)
          task.reject.call(undefined, error)
        } else if (task.cancellationToken.cancelled) { task.reject.call(undefined, task.cancellationToken.reason) } else { task.resolve.call(undefined, task.result) }
        if (this.currentTask === task) {
          this.currentTask = undefined
          if (!this.queue.length) {
            this.emit(sequentialTaskQueueEvents.drained)
            this.callWaiters()
          } else { this.scheduler.schedule(function () { return _this.next() }) }
        }
      }
      SequentialTaskQueue.prototype.callWaiters = function () {
        var waiters = this.waiters.splice(0)
        waiters.forEach(function (waiter) { return waiter() })
      }
      return SequentialTaskQueue
    }())
    SequentialTaskQueue.defaultScheduler = {
      schedule: function (callback) { return setTimeout(callback, 0) }
    }
    function noop () {
    }
    function isPromise (obj) {
      return (obj && typeof obj.then === 'function')
    }
    SequentialTaskQueue.defaultScheduler = {
      schedule: typeof setImmediate === 'function'
        ? function (callback) { return setImmediate(callback) }
        : function (callback) { return setTimeout(callback, 0) }
    }
    return SequentialTaskQueue
  }())

  var TreeModel = (function () {
    function mergeSort (comparatorFn, arr) {
      var len = arr.length; var firstHalf; var secondHalf
      if (len >= 2) {
        firstHalf = arr.slice(0, len / 2)
        secondHalf = arr.slice(len / 2, len)
        return merge(comparatorFn, mergeSort(comparatorFn, firstHalf), mergeSort(comparatorFn, secondHalf))
      } else {
        return arr.slice()
      }
    }

    function merge (comparatorFn, arr1, arr2) {
      var result = []; var left1 = arr1.length; var left2 = arr2.length
      while (left1 > 0 && left2 > 0) {
        if (comparatorFn(arr1[0], arr2[0]) <= 0) {
          result.push(arr1.shift())
          left1--
        } else {
          result.push(arr2.shift())
          left2--
        }
      }
      if (left1 > 0) {
        result.push.apply(result, arr1)
      } else {
        result.push.apply(result, arr2)
      }
      return result
    }

    function findInsertIndex (comparatorFn, arr, el) {
      var i, len
      for (i = 0, len = arr.length; i < len; i++) {
        if (comparatorFn(arr[i], el) > 0) {
          break
        }
      }
      return i
    }

    var walkStrategies

    walkStrategies = {}

    function k (result) {
      return function () {
        return result
      }
    }

    function TreeModel (config) {
      config = config || {}
      this.config = config
      this.config.childrenPropertyName = config.childrenPropertyName || 'children'
      this.config.modelComparatorFn = config.modelComparatorFn
    }

    function addChildToNode (node, child) {
      child.parent = node
      node.children.push(child)
      return child
    }

    function Node (config, model) {
      this.config = config
      this.model = model
      this.children = []
    }

    TreeModel.prototype.parse = function (model) {
      var i, childCount, node

      if (!(model instanceof Object)) {
        throw new TypeError('Model must be of type object.')
      }

      node = new Node(this.config, model)
      if (model[this.config.childrenPropertyName] instanceof Array) {
        if (this.config.modelComparatorFn) {
          model[this.config.childrenPropertyName] = mergeSort(
            this.config.modelComparatorFn,
            model[this.config.childrenPropertyName])
        }
        for (i = 0, childCount = model[this.config.childrenPropertyName].length; i < childCount; i++) {
          addChildToNode(node, this.parse(model[this.config.childrenPropertyName][i]))
        }
      }
      return node
    }

    function hasComparatorFunction (node) {
      return typeof node.config.modelComparatorFn === 'function'
    }

    Node.prototype.isRoot = function () {
      return this.parent === undefined
    }

    Node.prototype.hasChildren = function () {
      return this.children.length > 0
    }

    function addChild (self, child, insertIndex) {
      var index

      if (!(child instanceof Node)) {
        throw new TypeError('Child must be of type Node.')
      }

      child.parent = self
      if (!(self.model[self.config.childrenPropertyName] instanceof Array)) {
        self.model[self.config.childrenPropertyName] = []
      }

      if (hasComparatorFunction(self)) {
      // Find the index to insert the child
        index = findInsertIndex(
          self.config.modelComparatorFn,
          self.model[self.config.childrenPropertyName],
          child.model)

        // Add to the model children
        self.model[self.config.childrenPropertyName].splice(index, 0, child.model)

        // Add to the node children
        self.children.splice(index, 0, child)
      } else {
        if (insertIndex === undefined) {
          self.model[self.config.childrenPropertyName].push(child.model)
          self.children.push(child)
        } else {
          if (insertIndex < 0 || insertIndex > self.children.length) {
            throw new Error('Invalid index.')
          }
          self.model[self.config.childrenPropertyName].splice(insertIndex, 0, child.model)
          self.children.splice(insertIndex, 0, child)
        }
      }
      return child
    }

    Node.prototype.addChild = function (child) {
      return addChild(this, child)
    }

    Node.prototype.addChildAtIndex = function (child, index) {
      if (hasComparatorFunction(this)) {
        throw new Error('Cannot add child at index when using a comparator function.')
      }

      return addChild(this, child, index)
    }

    Node.prototype.setIndex = function (index) {
      if (hasComparatorFunction(this)) {
        throw new Error('Cannot set node index when using a comparator function.')
      }

      if (this.isRoot()) {
        if (index === 0) {
          return this
        }
        throw new Error('Invalid index.')
      }

      if (index < 0 || index >= this.parent.children.length) {
        throw new Error('Invalid index.')
      }

      var oldIndex = this.parent.children.indexOf(this)

      this.parent.children.splice(index, 0, this.parent.children.splice(oldIndex, 1)[0])

      this.parent.model[this.parent.config.childrenPropertyName]
        .splice(index, 0, this.parent.model[this.parent.config.childrenPropertyName].splice(oldIndex, 1)[0])

      return this
    }

    Node.prototype.getPath = function () {
      var path = [];
      (function addToPath (node) {
        path.unshift(node)
        if (!node.isRoot()) {
          addToPath(node.parent)
        }
      })(this)
      return path
    }

    Node.prototype.getIndex = function () {
      if (this.isRoot()) {
        return 0
      }
      return this.parent.children.indexOf(this)
    }

    /**
* Parse the arguments of traversal functions. These functions can take one optional
* first argument which is an options object. If present, this object will be stored
* in args.options. The only mandatory argument is the callback function which can
* appear in the first or second position (if an options object is given). This
* function will be saved to args.fn. The last optional argument is the context on
* which the callback function will be called. It will be available in args.ctx.
*
* @returns Parsed arguments.
*/
    function parseArgs () {
      var args = {}
      if (arguments.length === 1) {
        if (typeof arguments[0] === 'function') {
          args.fn = arguments[0]
        } else {
          args.options = arguments[0]
        }
      } else if (arguments.length === 2) {
        if (typeof arguments[0] === 'function') {
          args.fn = arguments[0]
          args.ctx = arguments[1]
        } else {
          args.options = arguments[0]
          args.fn = arguments[1]
        }
      } else {
        args.options = arguments[0]
        args.fn = arguments[1]
        args.ctx = arguments[2]
      }
      args.options = args.options || {}
      if (!args.options.strategy) {
        args.options.strategy = 'pre'
      }
      if (!walkStrategies[args.options.strategy]) {
        throw new Error('Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.')
      }
      return args
    }

    Node.prototype.walk = function () {
      var args
      args = parseArgs.apply(this, arguments)
      walkStrategies[args.options.strategy].call(this, args.fn, args.ctx)
    }

    walkStrategies.pre = function depthFirstPreOrder (callback, context) {
      var i, childCount, keepGoing
      keepGoing = callback.call(context, this)
      for (i = 0, childCount = this.children.length; i < childCount; i++) {
        if (keepGoing === false) {
          return false
        }
        keepGoing = depthFirstPreOrder.call(this.children[i], callback, context)
      }
      return keepGoing
    }

    walkStrategies.post = function depthFirstPostOrder (callback, context) {
      var i, childCount, keepGoing
      for (i = 0, childCount = this.children.length; i < childCount; i++) {
        keepGoing = depthFirstPostOrder.call(this.children[i], callback, context)
        if (keepGoing === false) {
          return false
        }
      }
      keepGoing = callback.call(context, this)
      return keepGoing
    }

    walkStrategies.breadth = function breadthFirst (callback, context) {
      var queue = [this];
      (function processQueue () {
        var i, childCount, node
        if (queue.length === 0) {
          return
        }
        node = queue.shift()
        for (i = 0, childCount = node.children.length; i < childCount; i++) {
          queue.push(node.children[i])
        }
        if (callback.call(context, node) !== false) {
          processQueue()
        }
      })()
    }

    Node.prototype.all = function () {
      var args; var all = []
      args = parseArgs.apply(this, arguments)
      args.fn = args.fn || k(true)
      walkStrategies[args.options.strategy].call(this, function (node) {
        if (args.fn.call(args.ctx, node)) {
          all.push(node)
        }
      }, args.ctx)
      return all
    }

    Node.prototype.first = function () {
      var args, first
      args = parseArgs.apply(this, arguments)
      args.fn = args.fn || k(true)
      walkStrategies[args.options.strategy].call(this, function (node) {
        if (args.fn.call(args.ctx, node)) {
          first = node
          return false
        }
      }, args.ctx)
      return first
    }

    Node.prototype.drop = function () {
      var indexOfChild
      if (!this.isRoot()) {
        indexOfChild = this.parent.children.indexOf(this)
        this.parent.children.splice(indexOfChild, 1)
        this.parent.model[this.config.childrenPropertyName].splice(indexOfChild, 1)
        this.parent = undefined
        delete this.parent
      }
      return this
    }
    return TreeModel
  })()

  let firstTreeModel = new TreeModel()
  let root = []
  firstTreeModel.parse({ id: 1,
    name: 'something',
    children: [{
      id: 2,
      name: 'something_else'
    }] })

  // var queueInt = new SequentialTaskQueue();
  // eslint-disable-next-line
  var queue = new SequentialTaskQueue();
  self.onmessage = function (e) {
    let data = JSON.parse(e.data)
    console.log(data)
    if (data.newData.type === 'first_time') {
      root = firstTreeModel.parse(data.newData.content)
    } else if (data.newData.type === 'update') {
      queue.push(() => {
        if (data.state.apply_all) {
          root.walk({ strategy: 'pre' }, function (node) {
            if (node.model.name === data.newData.content.name) {
              node.model.marked = true
            }
          })
        } else {
          root.walk({ strategy: 'pre' }, function (node) {
            if (node.model.id === data.newData.content.id) {
              node.model.marked = true
            }
          })
        }
      })
    } else if (data.newData.type === 'get_data') {
      self.postMessage(root)
    }
  }
}

export default workercode
