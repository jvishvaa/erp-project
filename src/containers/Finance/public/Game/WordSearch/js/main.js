/*
 TweenJS
 Visit http://createjs.com/ for documentation, updates and examples.

 Copyright (c) 2010 gskinner.com, inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 Platform.js <https://mths.be/platform>
 Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 Copyright 2011-2013 John-David Dalton
 Available under MIT license <https://mths.be/mit>
*/
this.createjs = this.createjs || {}; createjs.extend = function (a, b) { function c () { this.constructor = a }c.prototype = b.prototype; return a.prototype = new c() }; this.createjs = this.createjs || {}; createjs.promote = function (a, b) { var c = a.prototype; var e = Object.getPrototypeOf && Object.getPrototypeOf(c) || c.__proto__; if (e) { c[(b += '_') + 'constructor'] = e.constructor; for (var d in e)c.hasOwnProperty(d) && typeof e[d] === 'function' && (c[b + d] = e[d]) } return a }; this.createjs = this.createjs || {}
createjs.deprecate = function (a, b) { return function () { var c = "Deprecated property or method '" + b + "'. See docs for info."; console && (console.warn ? console.warn(c) : console.log(c)); return a && a.apply(this, arguments) } }; this.createjs = this.createjs || {};
(function () {
  function a (a, b, d) { this.type = a; this.currentTarget = this.target = null; this.eventPhase = 0; this.bubbles = !!b; this.cancelable = !!d; this.timeStamp = (new Date()).getTime(); this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1 } var b = a.prototype; b.preventDefault = function () { this.defaultPrevented = this.cancelable && !0 }; b.stopPropagation = function () { this.propagationStopped = !0 }; b.stopImmediatePropagation = function () {
    this.immediatePropagationStopped = this.propagationStopped =
!0
  }; b.remove = function () { this.removed = !0 }; b.clone = function () { return new a(this.type, this.bubbles, this.cancelable) }; b.set = function (a) { for (var c in a) this[c] = a[c]; return this }; b.toString = function () { return '[Event (type=' + this.type + ')]' }; createjs.Event = a
})(); this.createjs = this.createjs || {};
(function () {
  function a () { this._captureListeners = this._listeners = null } var b = a.prototype; a.initialize = function (a) { a.addEventListener = b.addEventListener; a.on = b.on; a.removeEventListener = a.off = b.removeEventListener; a.removeAllEventListeners = b.removeAllEventListeners; a.hasEventListener = b.hasEventListener; a.dispatchEvent = b.dispatchEvent; a._dispatchEvent = b._dispatchEvent; a.willTrigger = b.willTrigger }; b.addEventListener = function (a, b, d) {
    var c = d ? this._captureListeners = this._captureListeners || {} : this._listeners =
this._listeners || {}; var e = c[a]; e && this.removeEventListener(a, b, d); (e = c[a]) ? e.push(b) : c[a] = [b]; return b
  }; b.on = function (a, b, d, f, g, h) { b.handleEvent && (d = d || b, b = b.handleEvent); d = d || this; return this.addEventListener(a, function (a) { b.call(d, a, g); f && a.remove() }, h) }; b.removeEventListener = function (a, b, d) { if (d = d ? this._captureListeners : this._listeners) { var c = d[a]; if (c) for (var e = 0, h = c.length; e < h; e++) if (c[e] == b) { h == 1 ? delete d[a] : c.splice(e, 1); break } } }; b.off = b.removeEventListener; b.removeAllEventListeners = function (a) {
    a
      ? (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
  }; b.dispatchEvent = function (a, b, d) {
    if (typeof a === 'string') { var c = this._listeners; if (!(b || c && c[a])) return !0; a = new createjs.Event(a, b, d) } else a.target && a.clone && (a = a.clone()); try { a.target = this } catch (g) {} if (a.bubbles && this.parent) {
      d = this; for (b = [d]; d.parent;)b.push(d = d.parent); c = b.length; for (d = c - 1; d >= 0 && !a.propagationStopped; d--)b[d]._dispatchEvent(a, 1 + (d == 0))
      for (d = 1; d < c && !a.propagationStopped; d++)b[d]._dispatchEvent(a, 3)
    } else this._dispatchEvent(a, 2); return !a.defaultPrevented
  }; b.hasEventListener = function (a) { var c = this._listeners; var b = this._captureListeners; return !!(c && c[a] || b && b[a]) }; b.willTrigger = function (a) { for (var c = this; c;) { if (c.hasEventListener(a)) return !0; c = c.parent } return !1 }; b.toString = function () { return '[EventDispatcher]' }; b._dispatchEvent = function (a, b) {
    var c; var e; var g = b <= 2 ? this._captureListeners : this._listeners; if (a && g && (e = g[a.type]) && (c = e.length)) {
      try {
        a.currentTarget =
this
      } catch (l) {} try { a.eventPhase = b | 0 } catch (l) {}a.removed = !1; e = e.slice(); for (g = 0; g < c && !a.immediatePropagationStopped; g++) { var h = e[g]; h.handleEvent ? h.handleEvent(a) : h(a); a.removed && (this.off(a.type, h, b == 1), a.removed = !1) }
    }b === 2 && this._dispatchEvent(a, 2.1)
  }; createjs.EventDispatcher = a
})(); this.createjs = this.createjs || {};
(function () {
  function a () { throw 'Ticker cannot be instantiated.' }a.RAF_SYNCHED = 'synched'; a.RAF = 'raf'; a.TIMEOUT = 'timeout'; a.timingMode = null; a.maxDelta = 0; a.paused = !1; a.removeEventListener = null; a.removeAllEventListeners = null; a.dispatchEvent = null; a.hasEventListener = null; a._listeners = null; createjs.EventDispatcher.initialize(a); a._addEventListener = a.addEventListener; a.addEventListener = function () { !a._inited && a.init(); return a._addEventListener.apply(a, arguments) }; a._inited = !1; a._startTime = 0; a._pausedTime =
0; a._ticks = 0; a._pausedTicks = 0; a._interval = 50; a._lastTime = 0; a._times = null; a._tickTimes = null; a._timerId = null; a._raf = !0; a._setInterval = function (c) { a._interval = c; a._inited && a._setupTick() }; a.setInterval = createjs.deprecate(a._setInterval, 'Ticker.setInterval'); a._getInterval = function () { return a._interval }; a.getInterval = createjs.deprecate(a._getInterval, 'Ticker.getInterval'); a._setFPS = function (c) { a._setInterval(1E3 / c) }; a.setFPS = createjs.deprecate(a._setFPS, 'Ticker.setFPS'); a._getFPS = function () {
    return 1E3 /
a._interval
  }; a.getFPS = createjs.deprecate(a._getFPS, 'Ticker.getFPS'); try { Object.defineProperties(a, { interval: { get: a._getInterval, set: a._setInterval }, framerate: { get: a._getFPS, set: a._setFPS } }) } catch (e) { console.log(e) }a.init = function () { a._inited || (a._inited = !0, a._times = [], a._tickTimes = [], a._startTime = a._getTime(), a._times.push(a._lastTime = 0), a.interval = a._interval) }; a.reset = function () {
    if (a._raf) {
      var c = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
window.msCancelAnimationFrame; c && c(a._timerId)
    } else clearTimeout(a._timerId); a.removeAllEventListeners('tick'); a._timerId = a._times = a._tickTimes = null; a._startTime = a._lastTime = a._ticks = a._pausedTime = 0; a._inited = !1
  }; a.getMeasuredTickTime = function (c) { var b = 0; var e = a._tickTimes; if (!e || e.length < 1) return -1; c = Math.min(e.length, c || a._getFPS() | 0); for (var g = 0; g < c; g++)b += e[g]; return b / c }; a.getMeasuredFPS = function (c) {
    var b = a._times; if (!b || b.length < 2) return -1; c = Math.min(b.length - 1, c || a._getFPS() | 0); return 1E3 / ((b[0] -
b[c]) / c)
  }; a.getTime = function (c) { return a._startTime ? a._getTime() - (c ? a._pausedTime : 0) : -1 }; a.getEventTime = function (c) { return a._startTime ? (a._lastTime || a._startTime) - (c ? a._pausedTime : 0) : -1 }; a.getTicks = function (c) { return a._ticks - (c ? a._pausedTicks : 0) }; a._handleSynch = function () { a._timerId = null; a._setupTick(); a._getTime() - a._lastTime >= 0.97 * (a._interval - 1) && a._tick() }; a._handleRAF = function () { a._timerId = null; a._setupTick(); a._tick() }; a._handleTimeout = function () { a._timerId = null; a._setupTick(); a._tick() }; a._setupTick =
function () { if (a._timerId == null) { var c = a.timingMode; if (c == a.RAF_SYNCHED || c == a.RAF) { var b = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame; if (b) { a._timerId = b(c == a.RAF ? a._handleRAF : a._handleSynch); a._raf = !0; return } }a._raf = !1; a._timerId = setTimeout(a._handleTimeout, a._interval) } }; a._tick = function () {
    var c = a.paused; var b = a._getTime(); var f = b - a._lastTime; a._lastTime = b; a._ticks++; c && (a._pausedTicks++, a._pausedTime +=
f); if (a.hasEventListener('tick')) { var g = new createjs.Event('tick'); var h = a.maxDelta; g.delta = h && f > h ? h : f; g.paused = c; g.time = b; g.runTime = b - a._pausedTime; a.dispatchEvent(g) } for (a._tickTimes.unshift(a._getTime() - b); a._tickTimes.length > 100;)a._tickTimes.pop(); for (a._times.unshift(b); a._times.length > 100;)a._times.pop()
  }; var b = window; var c = b.performance.now || b.performance.mozNow || b.performance.msNow || b.performance.oNow || b.performance.webkitNow; a._getTime = function () {
    return (c && c.call(b.performance) || (new Date()).getTime()) -
a._startTime
  }; createjs.Ticker = a
})(); this.createjs = this.createjs || {};
(function () {
  function a (a) {
    this.EventDispatcher_constructor(); this.ignoreGlobalPause = !1; this.loop = 0; this.bounce = this.reversed = this.useTicks = !1; this.timeScale = 1; this.position = this.duration = 0; this.rawPosition = -1; this._paused = !0; this._labelList = this._labels = this._parent = this._prev = this._next = null; a && (this.useTicks = !!a.useTicks, this.ignoreGlobalPause = !!a.ignoreGlobalPause, this.loop = !0 === a.loop ? -1 : a.loop || 0, this.reversed = !!a.reversed, this.bounce = !!a.bounce, this.timeScale = a.timeScale || 1, a.onChange && this.addEventListener('change',
      a.onChange), a.onComplete && this.addEventListener('complete', a.onComplete))
  } var b = createjs.extend(a, createjs.EventDispatcher); b._setPaused = function (a) { createjs.Tween._register(this, a); return this }; b.setPaused = createjs.deprecate(b._setPaused, 'AbstractTween.setPaused'); b._getPaused = function () { return this._paused }; b.getPaused = createjs.deprecate(b._getPaused, 'AbstactTween.getPaused'); b._getCurrentLabel = function (a) {
    var c = this.getLabels(); a == null && (a = this.position); for (var b = 0, f = c.length; b < f && !(a < c[b].position); b++);
    return b === 0 ? null : c[b - 1].label
  }; b.getCurrentLabel = createjs.deprecate(b._getCurrentLabel, 'AbstractTween.getCurrentLabel'); try { Object.defineProperties(b, { paused: { set: b._setPaused, get: b._getPaused }, currentLabel: { get: b._getCurrentLabel } }) } catch (c) {}b.advance = function (a, b) { this.setPosition(this.rawPosition + a * this.timeScale, b) }; b.setPosition = function (a, b, d, f) {
    var c = this.duration; var e = this.loop; var l = this.rawPosition; var k = 0; a < 0 && (a = 0); if (c === 0) { var n = !0; if (l !== -1) return n } else {
      var p = a / c | 0; k = a - p * c; (n = e !== -1 && a >= e *
c + c) && (a = (k = c) * (p = e) + c); if (a === l) return n; !this.reversed !== !(this.bounce && p % 2) && (k = c - k)
    } this.position = k; this.rawPosition = a; this._updatePosition(d, n); n && (this.paused = !0); f && f(this); b || this._runActions(l, a, d, !d && l === -1); this.dispatchEvent('change'); n && this.dispatchEvent('complete')
  }; b.calculatePosition = function (a) { var c = this.duration; var b = this.loop; var f = 0; if (c === 0) return 0; b !== -1 && a >= b * c + c ? (a = c, f = b) : a < 0 ? a = 0 : (f = a / c | 0, a -= f * c); return !this.reversed !== !(this.bounce && f % 2) ? c - a : a }; b.getLabels = function () {
    var a = this._labelList
    if (!a) { a = this._labelList = []; var b = this._labels; var d; for (d in b)a.push({ label: d, position: b[d] }); a.sort(function (a, c) { return a.position - c.position }) } return a
  }; b.setLabels = function (a) { this._labels = a; this._labelList = null }; b.addLabel = function (a, b) { this._labels || (this._labels = {}); this._labels[a] = b; var c = this._labelList; if (c) { for (var f = 0, e = c.length; f < e && !(b < c[f].position); f++);c.splice(f, 0, { label: a, position: b }) } }; b.gotoAndPlay = function (a) { this.paused = !1; this._goto(a) }; b.gotoAndStop = function (a) {
    this.paused =
!0; this._goto(a)
  }; b.resolve = function (a) { var b = Number(a); isNaN(b) && (b = this._labels && this._labels[a]); return b }; b.toString = function () { return '[AbstractTween]' }; b.clone = function () { throw 'AbstractTween can not be cloned.' }; b._init = function (a) { a && a.paused || (this.paused = !1); a && a.position != null && this.setPosition(a.position) }; b._updatePosition = function (a, b) {}; b._goto = function (a) { a = this.resolve(a); a != null && this.setPosition(a, !1, !0) }; b._runActions = function (a, b, d, f) {
    if (this._actionHead || this.tweens) {
      var c = this.duration
      var e = this.reversed; var l = this.bounce; var k = this.loop; var n; var p; var m; if (c === 0) { var x = n = p = m = 0; e = l = !1 } else x = a / c | 0, n = b / c | 0, p = a - x * c, m = b - n * c; k !== -1 && (n > k && (m = c, n = k), x > k && (p = c, x = k)); if (d) return this._runActionsRange(m, m, d, f); if (x !== n || p !== m || d || f) { x === -1 && (x = p = 0); a = a <= b; b = x; do { k = b === x ? p : a ? 0 : c; var u = b === n ? m : a ? c : 0; !e !== !(l && b % 2) && (k = c - k, u = c - u); if ((!l || b === x || k !== u) && this._runActionsRange(k, u, d, f || b !== x && !l)) return !0; f = !1 } while (a && ++b <= n || !a && --b >= n) }
    }
  }; b._runActionsRange = function (a, b, d, f) {}; createjs.AbstractTween = createjs.promote(a,
    'EventDispatcher')
})(); this.createjs = this.createjs || {};
(function () {
  function a (c, f) { this.AbstractTween_constructor(f); this.pluginData = null; this.target = c; this.passive = !1; this._stepTail = this._stepHead = new b(null, 0, 0, {}, null, !0); this._stepPosition = 0; this._injected = this._pluginIds = this._plugins = this._actionTail = this._actionHead = null; f && (this.pluginData = f.pluginData, f.override && a.removeTweens(c)); this.pluginData || (this.pluginData = {}); this._init(f) } function b (a, b, c, e, l, k) {
    this.next = null; this.prev = a; this.t = b; this.d = c; this.props = e; this.ease = l; this.passive = k; this.index =
a ? a.index + 1 : 0
  } function c (a, b, c, e, l) { this.next = null; this.prev = a; this.t = b; this.d = 0; this.scope = c; this.funct = e; this.params = l } var e = createjs.extend(a, createjs.AbstractTween); a.IGNORE = {}; a._tweens = []; a._plugins = null; a._tweenHead = null; a._tweenTail = null; a.get = function (b, c) { return new a(b, c) }; a.tick = function (b, c) { for (var d = a._tweenHead; d;) { var f = d._next; c && !d.ignoreGlobalPause || d._paused || d.advance(d.useTicks ? 1 : b); d = f } }; a.handleEvent = function (a) { a.type === 'tick' && this.tick(a.delta, a.paused) }; a.removeTweens =
function (b) { if (b.tweenjs_count) { for (var c = a._tweenHead; c;) { var d = c._next; c.target === b && a._register(c, !0); c = d }b.tweenjs_count = 0 } }; a.removeAllTweens = function () { for (var b = a._tweenHead; b;) { var c = b._next; b._paused = !0; b.target && (b.target.tweenjs_count = 0); b._next = b._prev = null; b = c }a._tweenHead = a._tweenTail = null }; a.hasActiveTweens = function (b) { return b ? !!b.tweenjs_count : !!a._tweenHead }; a._installPlugin = function (b) {
    for (var c = b.priority = b.priority || 0, d = a._plugins = a._plugins || [], e = 0, l = d.length; e < l && !(c < d[e].priority); e++);
    d.splice(e, 0, b)
  }; a._register = function (b, c) { var d = b.target; if (!c && b._paused)d && (d.tweenjs_count = d.tweenjs_count ? d.tweenjs_count + 1 : 1), (d = a._tweenTail) ? (a._tweenTail = d._next = b, b._prev = d) : a._tweenHead = a._tweenTail = b, !a._inited && createjs.Ticker && (createjs.Ticker.addEventListener('tick', a), a._inited = !0); else if (c && !b._paused) { d && d.tweenjs_count--; d = b._next; var e = b._prev; d ? d._prev = e : a._tweenTail = e; e ? e._next = d : a._tweenHead = d; b._next = b._prev = null }b._paused = c }; e.wait = function (a, b) {
    a > 0 && this._addStep(+a, this._stepTail.props,
      null, b); return this
  }; e.to = function (a, b, c) { if (b == null || b < 0)b = 0; b = this._addStep(+b, null, c); this._appendProps(a, b); return this }; e.label = function (a) { this.addLabel(a, this.duration); return this }; e.call = function (a, b, c) { return this._addAction(c || this.target, a, b || [this]) }; e.set = function (a, b) { return this._addAction(b || this.target, this._set, [a]) }; e.play = function (a) { return this._addAction(a || this, this._set, [{ paused: !1 }]) }; e.pause = function (a) { return this._addAction(a || this, this._set, [{ paused: !0 }]) }; e.w = e.wait
  e.t = e.to; e.c = e.call; e.s = e.set; e.toString = function () { return '[Tween]' }; e.clone = function () { throw 'Tween can not be cloned.' }; e._addPlugin = function (a) { var b = this._pluginIds || (this._pluginIds = {}); var c = a.ID; if (c && !b[c]) { b[c] = !0; b = this._plugins || (this._plugins = []); c = a.priority || 0; for (var d = 0, e = b.length; d < e; d++) if (c < b[d].priority) { b.splice(d, 0, a); return }b.push(a) } }; e._updatePosition = function (a, b) {
    var c = this._stepHead.next; var d = this.position; var e = this.duration; if (this.target && c) {
      for (var f = c.next; f && f.t <= d;) {
        c = c.next,
        f = c.next
      } this._updateTargetProps(c, b ? e === 0 ? 1 : d / e : (d - c.t) / c.d, b)
    } this._stepPosition = c ? d - c.t : 0
  }; e._updateTargetProps = function (b, c, e) { if (!(this.passive = !!b.passive)) { var d; var f = b.prev.props; var g = b.props; if (d = b.ease)c = d(c, 0, 1, 1); d = this._plugins; var n; a:for (n in f) { var p = f[n]; var m = g[n]; p = p !== m && typeof p === 'number' ? p + (m - p) * c : c >= 1 ? m : p; if (d) { m = 0; for (var x = d.length; m < x; m++) { var u = d[m].change(this, b, n, p, c, e); if (u === a.IGNORE) continue a; void 0 !== u && (p = u) } } this.target[n] = p } } }; e._runActionsRange = function (a, b, c, e) {
    var d =
(c = a > b) ? this._actionTail : this._actionHead; var f = b; var g = a; c && (f = a, g = b); for (var h = this.position; d;) { var m = d.t; if (m === b || m > g && m < f || e && m === a) if (d.funct.apply(d.scope, d.params), h !== this.position) return !0; d = c ? d.prev : d.next }
  }; e._appendProps = function (b, c, e) {
    var d = this._stepHead.props; var f = this.target; var g = a._plugins; var n; var p; var m = c.prev; var x = m.props; var u = c.props || (c.props = this._cloneProps(x)); var r = {}; for (n in b) {
      if (b.hasOwnProperty(n) && (r[n] = u[n] = b[n], void 0 === d[n])) {
        var z = void 0; if (g) {
          for (p = g.length - 1; p >= 0; p--) {
            var v = g[p].init(this, n,
              z); void 0 !== v && (z = v); if (z === a.IGNORE) { delete u[n]; delete r[n]; break }
          }
        }z !== a.IGNORE && (void 0 === z && (z = f[n]), x[n] = void 0 === z ? null : z)
      }
    } for (n in r) { var A; for (b = m; (A = b) && (b = A.prev);) if (b.props !== A.props) { if (void 0 !== b.props[n]) break; b.props[n] = x[n] } } if (!1 !== e && (g = this._plugins)) for (p = g.length - 1; p >= 0; p--)g[p].step(this, c, r); if (e = this._injected) this._injected = null, this._appendProps(e, c, !1)
  }; e._injectProp = function (a, b) { (this._injected || (this._injected = {}))[a] = b }; e._addStep = function (a, c, e, h) {
    c = new b(this._stepTail,
      this.duration, a, c, e, h || !1); this.duration += a; return this._stepTail = this._stepTail.next = c
  }; e._addAction = function (a, b, e) { a = new c(this._actionTail, this.duration, a, b, e); this._actionTail ? this._actionTail.next = a : this._actionHead = a; this._actionTail = a; return this }; e._set = function (a) { for (var b in a) this[b] = a[b] }; e._cloneProps = function (a) { var b = {}; var c; for (c in a)b[c] = a[c]; return b }; createjs.Tween = createjs.promote(a, 'AbstractTween')
})(); this.createjs = this.createjs || {};
(function () {
  function a (a) { if (a instanceof Array || a == null && arguments.length > 1) { var b = a; var c = arguments[1]; a = arguments[2] } else a && (b = a.tweens, c = a.labels); this.AbstractTween_constructor(a); this.tweens = []; b && this.addTween.apply(this, b); this.setLabels(c); this._init(a) } var b = createjs.extend(a, createjs.AbstractTween); b.addTween = function (a) {
    a._parent && a._parent.removeTween(a); var b = arguments.length; if (b > 1) { for (var c = 0; c < b; c++) this.addTween(arguments[c]); return arguments[b - 1] } if (b === 0) return null; this.tweens.push(a)
    a._parent = this; a.paused = !0; b = a.duration; a.loop > 0 && (b *= a.loop + 1); b > this.duration && (this.duration = b); this.rawPosition >= 0 && a.setPosition(this.rawPosition); return a
  }; b.removeTween = function (a) { var b = arguments.length; if (b > 1) { for (var c = !0, f = 0; f < b; f++)c = c && this.removeTween(arguments[f]); return c } if (b === 0) return !0; b = this.tweens; for (f = b.length; f--;) if (b[f] === a) return b.splice(f, 1), a._parent = null, a.duration >= this.duration && this.updateDuration(), !0; return !1 }; b.updateDuration = function () {
    for (var a = this.duration =
0, b = this.tweens.length; a < b; a++) { var d = this.tweens[a]; var f = d.duration; d.loop > 0 && (f *= d.loop + 1); f > this.duration && (this.duration = f) }
  }; b.toString = function () { return '[Timeline]' }; b.clone = function () { throw 'Timeline can not be cloned.' }; b._updatePosition = function (a, b) { for (var c = this.position, e = 0, g = this.tweens.length; e < g; e++) this.tweens[e].setPosition(c, !0, a) }; b._runActionsRange = function (a, b, d, f) { for (var c = this.position, e = 0, l = this.tweens.length; e < l; e++) if (this.tweens[e]._runActions(a, b, d, f), c !== this.position) return !0 }
  createjs.Timeline = createjs.promote(a, 'AbstractTween')
})(); this.createjs = this.createjs || {};
(function () {
  function a () { throw 'Ease cannot be instantiated.' }a.linear = function (a) { return a }; a.none = a.linear; a.get = function (a) { a < -1 ? a = -1 : a > 1 && (a = 1); return function (b) { return a == 0 ? b : a < 0 ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a)) } }; a.getPowIn = function (a) { return function (b) { return Math.pow(b, a) } }; a.getPowOut = function (a) { return function (b) { return 1 - Math.pow(1 - b, a) } }; a.getPowInOut = function (a) { return function (b) { return (b *= 2) < 1 ? 0.5 * Math.pow(b, a) : 1 - 0.5 * Math.abs(Math.pow(2 - b, a)) } }; a.quadIn = a.getPowIn(2); a.quadOut = a.getPowOut(2)
  a.quadInOut = a.getPowInOut(2); a.cubicIn = a.getPowIn(3); a.cubicOut = a.getPowOut(3); a.cubicInOut = a.getPowInOut(3); a.quartIn = a.getPowIn(4); a.quartOut = a.getPowOut(4); a.quartInOut = a.getPowInOut(4); a.quintIn = a.getPowIn(5); a.quintOut = a.getPowOut(5); a.quintInOut = a.getPowInOut(5); a.sineIn = function (a) { return 1 - Math.cos(a * Math.PI / 2) }; a.sineOut = function (a) { return Math.sin(a * Math.PI / 2) }; a.sineInOut = function (a) { return -0.5 * (Math.cos(Math.PI * a) - 1) }; a.getBackIn = function (a) { return function (b) { return b * b * ((a + 1) * b - a) } }
  a.backIn = a.getBackIn(1.7); a.getBackOut = function (a) { return function (b) { return --b * b * ((a + 1) * b + a) + 1 } }; a.backOut = a.getBackOut(1.7); a.getBackInOut = function (a) { a *= 1.525; return function (b) { return (b *= 2) < 1 ? 0.5 * b * b * ((a + 1) * b - a) : 0.5 * ((b -= 2) * b * ((a + 1) * b + a) + 2) } }; a.backInOut = a.getBackInOut(1.7); a.circIn = function (a) { return -(Math.sqrt(1 - a * a) - 1) }; a.circOut = function (a) { return Math.sqrt(1 - --a * a) }; a.circInOut = function (a) { return (a *= 2) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1) }; a.bounceIn = function (b) {
    return 1 -
a.bounceOut(1 - b)
  }; a.bounceOut = function (a) { return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375 }; a.bounceInOut = function (b) { return b < 0.5 ? 0.5 * a.bounceIn(2 * b) : 0.5 * a.bounceOut(2 * b - 1) + 0.5 }; a.getElasticIn = function (a, c) { var b = 2 * Math.PI; return function (d) { if (d == 0 || d == 1) return d; var e = c / b * Math.asin(1 / a); return -(a * Math.pow(2, 10 * --d) * Math.sin((d - e) * b / c)) } }; a.elasticIn = a.getElasticIn(1, 0.3); a.getElasticOut = function (a, c) {
    var b = 2 * Math.PI
    return function (d) { return d == 0 || d == 1 ? d : a * Math.pow(2, -10 * d) * Math.sin((d - c / b * Math.asin(1 / a)) * b / c) + 1 }
  }; a.elasticOut = a.getElasticOut(1, 0.3); a.getElasticInOut = function (a, c) { var b = 2 * Math.PI; return function (d) { var e = c / b * Math.asin(1 / a); return (d *= 2) < 1 ? -0.5 * a * Math.pow(2, 10 * --d) * Math.sin((d - e) * b / c) : a * Math.pow(2, -10 * --d) * Math.sin((d - e) * b / c) * 0.5 + 1 } }; a.elasticInOut = a.getElasticInOut(1, 0.3 * 1.5); createjs.Ease = a
})(); this.createjs = this.createjs || {};
(function () {
  function a () { throw 'MotionGuidePlugin cannot be instantiated.' }a.priority = 0; a.ID = 'MotionGuide'; a.install = function () { createjs.Tween._installPlugin(a); return createjs.Tween.IGNORE }; a.init = function (b, c, e) { c == 'guide' && b._addPlugin(a) }; a.step = function (b, c, e) {
    for (var d in e) {
      if (d === 'guide') {
        var f = c.props.guide; var g = a._solveGuideData(e.guide, f); f.valid = !g; var h = f.endData; b._injectProp('x', h.x); b._injectProp('y', h.y); if (g || !f.orient) break; f.startOffsetRot = (void 0 === c.prev.props.rotation ? b.target.rotation ||
0 : c.prev.props.rotation) - f.startData.rotation; if (f.orient == 'fixed')f.endAbsRot = h.rotation + f.startOffsetRot, f.deltaRotation = 0; else { g = void 0 === e.rotation ? b.target.rotation || 0 : e.rotation; h = g - f.endData.rotation - f.startOffsetRot; var l = h % 360; f.endAbsRot = g; switch (f.orient) { case 'auto':f.deltaRotation = h; break; case 'cw':f.deltaRotation = (l + 360) % 360 + 360 * Math.abs(h / 360 | 0); break; case 'ccw':f.deltaRotation = (l - 360) % 360 + -360 * Math.abs(h / 360 | 0) } }b._injectProp('rotation', f.endAbsRot)
      }
    }
  }; a.change = function (b, c, e, d, f, g) {
    if ((d =
c.props.guide) && c.props !== c.prev.props && d !== c.prev.props.guide) { if (e === 'guide' && !d.valid || e == 'x' || e == 'y' || e === 'rotation' && d.orient) return createjs.Tween.IGNORE; a._ratioToPositionData(f, d, b.target) }
  }; a.debug = function (b, c, e) {
    b = b.guide || b; var d = a._findPathProblems(b); d && console.error('MotionGuidePlugin Error found: \n' + d); if (!c) return d; var f; var g = b.path; var h = g.length; c.save(); c.lineCap = 'round'; c.lineJoin = 'miter'; c.beginPath(); c.moveTo(g[0], g[1]); for (f = 2; f < h; f += 4) {
      c.quadraticCurveTo(g[f], g[f + 1], g[f + 2], g[f +
3])
    }c.strokeStyle = 'black'; c.lineWidth = 4.5; c.stroke(); c.strokeStyle = 'white'; c.lineWidth = 3; c.stroke(); c.closePath(); g = e.length; if (e && g) { h = {}; var l = {}; a._solveGuideData(b, h); for (f = 0; f < g; f++)h.orient = 'fixed', a._ratioToPositionData(e[f], h, l), c.beginPath(), c.moveTo(l.x, l.y), c.lineTo(l.x + 9 * Math.cos(0.0174533 * l.rotation), l.y + 9 * Math.sin(0.0174533 * l.rotation)), c.strokeStyle = 'black', c.lineWidth = 4.5, c.stroke(), c.strokeStyle = 'red', c.lineWidth = 3, c.stroke(), c.closePath() }c.restore(); return d
  }; a._solveGuideData = function (b,
    c) {
    var e; if (e = a.debug(b)) return e; var d = c.path = b.path; c.orient = b.orient; c.subLines = []; c.totalLength = 0; c.startOffsetRot = 0; c.deltaRotation = 0; c.startData = { ratio: 0 }; c.endData = { ratio: 1 }; c.animSpan = 1; var f = d.length; var g; var h = {}; var l = d[0]; var k = d[1]; for (e = 2; e < f; e += 4) {
      var n = d[e]; var p = d[e + 1]; var m = d[e + 2]; var x = d[e + 3]; var u = { weightings: [], estLength: 0, portion: 0 }; var r = l; var z = k; for (g = 1; g <= 10; g++) {
        a._getParamsForCurve(l, k, n, p, m, x, g / 10, !1, h), r = h.x - r, z = h.y - z, z = Math.sqrt(r * r + z * z), u.weightings.push(z), u.estLength += z, r = h.x,
        z = h.y
      }c.totalLength += u.estLength; for (g = 0; g < 10; g++)z = u.estLength, u.weightings[g] /= z; c.subLines.push(u); l = m; k = x
    }z = c.totalLength; d = c.subLines.length; for (e = 0; e < d; e++)c.subLines[e].portion = c.subLines[e].estLength / z; e = isNaN(b.start) ? 0 : b.start; d = isNaN(b.end) ? 1 : b.end; a._ratioToPositionData(e, c, c.startData); a._ratioToPositionData(d, c, c.endData); c.startData.ratio = e; c.endData.ratio = d; c.animSpan = c.endData.ratio - c.startData.ratio
  }; a._ratioToPositionData = function (b, c, e) {
    var d = c.subLines; var f; var g = 0; var h = b * c.animSpan + c.startData.ratio
    var l = d.length; for (f = 0; f < l; f++) { var k = d[f].portion; if (g + k >= h) { var n = f; break }g += k } void 0 === n && (n = l - 1, g -= k); d = d[n].weightings; var p = k; l = d.length; for (f = 0; f < l; f++) { k = d[f] * p; if (g + k >= h) break; g += k }n = 4 * n + 2; l = c.path; a._getParamsForCurve(l[n - 2], l[n - 1], l[n], l[n + 1], l[n + 2], l[n + 3], f / 10 + (h - g) / k * 0.1, c.orient, e); c.orient && (e.rotation = b >= 0.99999 && b <= 1.00001 && void 0 !== c.endAbsRot ? c.endAbsRot : e.rotation + (c.startOffsetRot + b * c.deltaRotation)); return e
  }; a._getParamsForCurve = function (a, c, e, d, f, g, h, l, k) {
    var b = 1 - h; k.x = b * b * a +
2 * b * h * e + h * h * f; k.y = b * b * c + 2 * b * h * d + h * h * g; l && (k.rotation = 57.2957795 * Math.atan2((d - c) * b + (g - d) * h, (e - a) * b + (f - e) * h))
  }; a._findPathProblems = function (a) {
    var b = a.path; var e = b && b.length || 0; if (e < 6 || (e - 2) % 4) {
      return "\tCannot parse 'path' array due to invalid number of entries in path. There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\nOnly [ " + (e + ' ] values found. Expected: ' + Math.max(4 *
Math.ceil((e - 2) / 4) + 2, 6))
    } for (var d = 0; d < e; d++) if (isNaN(b[d])) return 'All data in path array must be numeric'; b = a.start; if (isNaN(b) && void 0 !== b) return "'start' out of bounds. Expected 0 to 1, got: " + b; b = a.end; if (isNaN(b) && void 0 !== b) return "'end' out of bounds. Expected 0 to 1, got: " + b; if ((a = a.orient) && a != 'fixed' && a != 'auto' && a != 'cw' && a != 'ccw') return 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + a
  }; createjs.MotionGuidePlugin = a
})(); this.createjs = this.createjs || {};
(function () { var a = createjs.TweenJS = createjs.TweenJS || {}; a.version = '1.0.0'; a.buildDate = 'Thu, 14 Sep 2017 19:47:47 GMT' })();
(function () {
  var a = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {}; var b = typeof module !== 'undefined' && module.exports; var c = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element; var e = (function () {
    for (var b, c = ['requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror'.split(' '), 'webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror'.split(' '), 'webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror'.split(' '),
        'mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror'.split(' '), 'msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError'.split(' ')], d = 0, e = c.length, f = {}; d < e; d++) if ((b = c[d]) && b[1] in a) { for (d = 0; d < b.length; d++)f[c[0][d]] = b[d]; return f } return !1
  }()); var d = { change: e.fullscreenchange, error: e.fullscreenerror }; var f = { request: function (b) {
    var d = e.requestFullscreen; b = b || a.documentElement; if (/5\.1[.\d]* Safari/.test(navigator.userAgent))b[d]()
    else b[d](c && Element.ALLOW_KEYBOARD_INPUT)
  },
  exit: function () { a[e.exitFullscreen]() },
  toggle: function (a) { this.isFullscreen ? this.exit() : this.request(a) },
  onchange: function (a) { this.on('change', a) },
  onerror: function (a) { this.on('error', a) },
  on: function (b, c) { var e = d[b]; e && a.addEventListener(e, c, !1) },
  off: function (b, c) { var e = d[b]; e && a.removeEventListener(e, c, !1) },
  raw: e }; e ? (Object.defineProperties(f, { isFullscreen: { get: function () { return !!a[e.fullscreenElement] } },
    element: { enumerable: !0, get: function () { return a[e.fullscreenElement] } },
    enabled: { enumerable: !0, get: function () { return !!a[e.fullscreenEnabled] } } }), b ? module.exports = f : window.screenfull = f) : b ? module.exports = !1 : window.screenfull = !1
})();
(function () {
  function a (a) { a = String(a); return a.charAt(0).toUpperCase() + a.slice(1) } function b (a, b) { var c = -1; var d = a ? a.length : 0; if (typeof d === 'number' && d > -1 && d <= x) for (;++c < d;)b(a[c], c, a); else e(a, b) } function c (b) { b = String(b).replace(/^ +| +$/g, ''); return /^(?:webOS|i(?:OS|P))/.test(b) ? b : a(b) } function e (a, b) { for (var c in a)r.call(a, c) && b(a[c], c, a) } function d (b) { return b == null ? a(b) : z.call(b).slice(8, -1) } function f (a, b) {
    var c = a != null ? typeof a[b] : 'number'; return !/^(?:boolean|number|string|undefined)$/.test(c) &&
(c == 'object' ? !!a[b] : !0)
  } function g (a) { return String(a).replace(/([ -])(?!$)/g, '$1?') } function h (a, c) { var d = null; b(a, function (b, e) { d = c(d, b, e, a) }); return d } function l (a) {
    function b (b) {
      return h(b, function (b, d) {
        var e = d.pattern || g(d); !b && (b = RegExp('\\b' + e + ' *\\d+[.\\w_]*', 'i').exec(a) || RegExp('\\b' + e + ' *\\w+-[\\w]*', 'i').exec(a) || RegExp('\\b' + e + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(a)) && ((b = String(d.label && !RegExp(e, 'i').test(d.label) ? d.label : b).split('/'))[1] && !/[\d.]+/.test(b[0]) && (b[0] +=
' ' + b[1]), d = d.label || d, b = c(b[0].replace(RegExp(e, 'i'), d).replace(RegExp('; *(?:' + d + '[_-])?', 'i'), ' ').replace(RegExp('(' + d + ')[-_.]?(\\w)', 'i'), '$1 $2'))); return b
      })
    } function k (b) { return h(b, function (b, c) { return b || (RegExp(c + '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(a) || 0)[1] || null }) } var r = n; var m = a && typeof a === 'object' && d(a) != 'String'; m && (r = a, a = null); var v = r.navigator || {}; var p = v.userAgent || ''; a || (a = p); var x = m ? !!v.likeChrome : /\bChrome\b/.test(a) && !/internal|\n/i.test(z.toString())
    var A = m ? 'Object' : 'ScriptBridgingProxyObject'; var E = m ? 'Object' : 'Environment'; var M = m && r.java ? 'JavaPackage' : d(r.java); var W = m ? 'Object' : 'RuntimeObject'; E = (M = /\bJava/.test(M) && r.java) && d(r.environment) == E; var F = M ? 'a' : '\u03b1'; var X = M ? 'b' : '\u03b2'; var T = r.document || {}; var O = r.operamini || r.opera; var Q = u.test(Q = m && O ? O['[[Class]]'] : d(O)) ? Q : O = null; var q; var R = a; m = []; var S = null; var P = a == p; p = P && O && typeof O.version === 'function' && O.version(); var B = (function (b) {
      return h(b, function (b, c) {
        return b || RegExp('\\b' + (c.pattern || g(c)) + '\\b', 'i').exec(a) && (c.label ||
c)
      })
    }([{ label: 'EdgeHTML', pattern: 'Edge' }, 'Trident', { label: 'WebKit', pattern: 'AppleWebKit' }, 'iCab', 'Presto', 'NetFront', 'Tasman', 'KHTML', 'Gecko'])); var w = (function (b) { return h(b, function (b, c) { return b || RegExp('\\b' + (c.pattern || g(c)) + '\\b', 'i').exec(a) && (c.label || c) }) }(['Adobe AIR', 'Arora', 'Avant Browser', 'Breach', 'Camino', 'Electron', 'Epiphany', 'Fennec', 'Flock', 'Galeon', 'GreenBrowser', 'iCab', 'Iceweasel', 'K-Meleon', 'Konqueror', 'Lunascape', 'Maxthon', { label: 'Microsoft Edge', pattern: 'Edge' }, 'Midori', 'Nook Browser',
      'PaleMoon', 'PhantomJS', 'Raven', 'Rekonq', 'RockMelt', { label: 'Samsung Internet', pattern: 'SamsungBrowser' }, 'SeaMonkey', { label: 'Silk', pattern: '(?:Cloud9|Silk-Accelerated)' }, 'Sleipnir', 'SlimBrowser', { label: 'SRWare Iron', pattern: 'Iron' }, 'Sunrise', 'Swiftfox', 'Waterfox', 'WebPositive', 'Opera Mini', { label: 'Opera Mini', pattern: 'OPiOS' }, 'Opera', { label: 'Opera', pattern: 'OPR' }, 'Chrome', { label: 'Chrome Mobile', pattern: '(?:CriOS|CrMo)' }, { label: 'Firefox', pattern: '(?:Firefox|Minefield)' }, { label: 'Firefox for iOS', pattern: 'FxiOS' },
      { label: 'IE', pattern: 'IEMobile' }, { label: 'IE', pattern: 'MSIE' }, 'Safari'])); var C = b([{ label: 'BlackBerry', pattern: 'BB10' }, 'BlackBerry', { label: 'Galaxy S', pattern: 'GT-I9000' }, { label: 'Galaxy S2', pattern: 'GT-I9100' }, { label: 'Galaxy S3', pattern: 'GT-I9300' }, { label: 'Galaxy S4', pattern: 'GT-I9500' }, { label: 'Galaxy S5', pattern: 'SM-G900' }, { label: 'Galaxy S6', pattern: 'SM-G920' }, { label: 'Galaxy S6 Edge', pattern: 'SM-G925' }, { label: 'Galaxy S7', pattern: 'SM-G930' }, { label: 'Galaxy S7 Edge', pattern: 'SM-G935' }, 'Google TV', 'Lumia', 'iPad',
      'iPod', 'iPhone', 'Kindle', { label: 'Kindle Fire', pattern: '(?:Cloud9|Silk-Accelerated)' }, 'Nexus', 'Nook', 'PlayBook', 'PlayStation Vita', 'PlayStation', 'TouchPad', 'Transformer', { label: 'Wii U', pattern: 'WiiU' }, 'Wii', 'Xbox One', { label: 'Xbox 360', pattern: 'Xbox' }, 'Xoom']); var L = (function (b) { return h(b, function (b, c, d) { return b || (c[C] || c[/^[a-z]+(?: +[a-z]+\b)*/i.exec(C)] || RegExp('\\b' + g(d) + '(?:\\b|\\w*\\d)', 'i').exec(a)) && d }) }({ Apple: { iPad: 1, iPhone: 1, iPod: 1 },
      Archos: {},
      Amazon: { Kindle: 1, 'Kindle Fire': 1 },
      Asus: { Transformer: 1 },
      'Barnes & Noble': { Nook: 1 },
      BlackBerry: { PlayBook: 1 },
      Google: { 'Google TV': 1, Nexus: 1 },
      HP: { TouchPad: 1 },
      HTC: {},
      LG: {},
      Microsoft: { Xbox: 1, 'Xbox One': 1 },
      Motorola: { Xoom: 1 },
      Nintendo: { 'Wii U': 1, Wii: 1 },
      Nokia: { Lumia: 1 },
      Samsung: { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
      Sony: { PlayStation: 1, 'PlayStation Vita': 1 } })); var y = (function (b) {
      return h(b, function (b, d) {
        var e = d.pattern || g(d); if (!b && (b = RegExp('\\b' + e + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(a))) {
          var f = b; var k = d.label || d; var l = { '10.0': '10',
            '6.4': '10 Technical Preview',
            '6.3': '8.1',
            '6.2': '8',
            '6.1': 'Server 2008 R2 / 7',
            '6.0': 'Server 2008 / Vista',
            '5.2': 'Server 2003 / XP 64-bit',
            '5.1': 'XP',
            '5.01': '2000 SP1',
            '5.0': '2000',
            '4.0': 'NT',
            '4.90': 'ME' }; e && k && /^Win/i.test(f) && !/^Windows Phone /i.test(f) && (l = l[/[\d.]+$/.exec(f)]) && (f = 'Windows ' + l); f = String(f); e && k && (f = f.replace(RegExp(e, 'i'), k)); b = f = c(f.replace(/ ce$/i, ' CE').replace(/\bhpw/i, 'web').replace(/\bMacintosh\b/, 'Mac OS').replace(/_PowerPC\b/i, ' OS').replace(/\b(OS X) [^ \d]+/i, '$1').replace(/\bMac (OS X)\b/, '$1').replace(/\/(\d)/,
            ' $1').replace(/_/g, '.').replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '').replace(/\bx86\.64\b/gi, 'x86_64').replace(/\b(Windows Phone) OS\b/, '$1').replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1').split(' on ')[0])
        } return b
      })
    }(['Windows Phone', 'Android', 'CentOS', { label: 'Chrome OS', pattern: 'CrOS' }, 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', 'Mac OS X', 'Macintosh', 'Mac',
      'Windows 98;', 'Windows '])); B && (B = [B]); L && !C && (C = b([L])); if (q = /\bGoogle TV\b/.exec(C))C = q[0]; /\bSimulator\b/i.test(a) && (C = (C ? C + ' ' : '') + 'Simulator'); w == 'Opera Mini' && /\bOPiOS\b/.test(a) && m.push('running in Turbo/Uncompressed mode'); w == 'IE' && /\blike iPhone OS\b/.test(a) ? (q = l(a.replace(/like iPhone OS/, '')), L = q.manufacturer, C = q.product) : /^iP/.test(C) ? (w || (w = 'Safari'), y = 'iOS' + ((q = / OS ([\d_]+)/i.exec(a)) ? ' ' + q[1].replace(/_/g, '.') : '')) : w != 'Konqueror' || /buntu/i.test(y) ? L && L != 'Google' && (/Chrome/.test(w) &&
!/\bMobile Safari\b/i.test(a) || /\bVita\b/.test(C)) || /\bAndroid\b/.test(y) && /^Chrome/.test(w) && /\bVersion\//i.test(a) ? (w = 'Android Browser', y = /\bAndroid\b/.test(y) ? y : 'Android') : w == 'Silk' ? (/\bMobi/i.test(a) || (y = 'Android', m.unshift('desktop mode')), /Accelerated *= *true/i.test(a) && m.unshift('accelerated')) : w == 'PaleMoon' && (q = /\bFirefox\/([\d.]+)\b/.exec(a)) ? m.push('identifying as Firefox ' + q[1]) : w == 'Firefox' && (q = /\b(Mobile|Tablet|TV)\b/i.exec(a)) ? (y || (y = 'Firefox OS'), C || (C = q[1])) : !w || (q = !/\bMinefield\b/i.test(a) &&
/\b(?:Firefox|Safari)\b/.exec(w)) ? (w && !C && /[\/,]|^[^(]+?\)/.test(a.slice(a.indexOf(q + '/') + 8)) && (w = null), (q = C || L || y) && (C || L || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(y)) && (w = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(y) ? y : q) + ' Browser')) : w == 'Electron' && (q = (/\bChrome\/([\d.]+)\b/.exec(a) || 0)[1]) && m.push('Chromium ' + q) : y = 'Kubuntu'; p || (p = k(['(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))', 'Version', g(w), '(?:Firefox|Minefield|NetFront)']))
    if (q = B == 'iCab' && parseFloat(p) > 3 && 'WebKit' || /\bOpera\b/.test(w) && (/\bOPR\b/.test(a) ? 'Blink' : 'Presto') || /\b(?:Midori|Nook|Safari)\b/i.test(a) && !/^(?:Trident|EdgeHTML)$/.test(B) && 'WebKit' || !B && /\bMSIE\b/i.test(a) && (y == 'Mac OS' ? 'Tasman' : 'Trident') || B == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(w) && 'NetFront')B = [q]; w == 'IE' && (q = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(a) || 0)[1]) ? (w += ' Mobile', y = 'Windows Phone ' + (/\+$/.test(q) ? q : q + '.x'), m.unshift('desktop mode')) : /\bWPDesktop\b/i.test(a) ? (w = 'IE Mobile', y = 'Windows Phone 8.x',
    m.unshift('desktop mode'), p || (p = (/\brv:([\d.]+)/.exec(a) || 0)[1])) : w != 'IE' && B == 'Trident' && (q = /\brv:([\d.]+)/.exec(a)) && (w && m.push('identifying as ' + w + (p ? ' ' + p : '')), w = 'IE', p = q[1]); if (P) {
      if (f(r, 'global')) {
        if (M && (q = M.lang.System, R = q.getProperty('os.arch'), y = y || q.getProperty('os.name') + ' ' + q.getProperty('os.version')), E) { try { p = r.require('ringo/engine').version.join('.'), w = 'RingoJS' } catch (V) { (q = r.system) && q.global.system == r.system && (w = 'Narwhal', y || (y = q[0].os || null)) }w || (w = 'Rhino') } else {
          typeof r.process === 'object' &&
!r.process.browser && (q = r.process) && (typeof q.versions === 'object' && (typeof q.versions.electron === 'string' ? (m.push('Node ' + q.versions.node), w = 'Electron', p = q.versions.electron) : typeof q.versions.nw === 'string' && (m.push('Chromium ' + p, 'Node ' + q.versions.node), w = 'NW.js', p = q.versions.nw)), w || (w = 'Node.js', R = q.arch, y = q.platform, p = (p = /[\d.]+/.exec(q.version)) ? p[0] : null))
        }
      } else {
        d(q = r.runtime) == A ? (w = 'Adobe AIR', y = q.flash.system.Capabilities.os) : d(q = r.phantom) == W ? (w = 'PhantomJS', p = (q = q.version || null) && q.major + '.' + q.minor +
'.' + q.patch) : typeof T.documentMode === 'number' && (q = /\bTrident\/(\d+)/i.exec(a)) ? (p = [p, T.documentMode], (q = +q[1] + 4) != p[1] && (m.push('IE ' + p[1] + ' mode'), B && (B[1] = ''), p[1] = q), p = w == 'IE' ? String(p[1].toFixed(1)) : p[0]) : typeof T.documentMode === 'number' && /^(?:Chrome|Firefox)\b/.test(w) && (m.push('masking as ' + w + ' ' + p), w = 'IE', p = '11.0', B = ['Trident'], y = 'Windows')
      }y = y && c(y)
    }p && (q = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(p) || /(?:alpha|beta)(?: ?\d)?/i.exec(a + ';' + (P && v.appMinorVersion)) || /\bMinefield\b/i.test(a) &&
'a') && (S = /b/i.test(q) ? 'beta' : 'alpha', p = p.replace(RegExp(q + '\\+?$'), '') + (S == 'beta' ? X : F) + (/\d+\+?/.exec(q) || '')); if (w == 'Fennec' || w == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(y))w = 'Firefox Mobile'; else if (w == 'Maxthon' && p)p = p.replace(/\.[\d.]+/, '.x'); else if (/\bXbox\b/i.test(C))C == 'Xbox 360' && (y = null), C == 'Xbox 360' && /\bIEMobile\b/.test(a) && m.unshift('mobile mode'); else if (!/^(?:Chrome|IE|Opera)$/.test(w) && (!w || C || /Browser|Mobi/.test(w)) || y != 'Windows CE' && !/Mobi/i.test(a)) {
      if (w == 'IE' && P) {
        try {
          r.external === null &&
m.unshift('platform preview')
        } catch (V) { m.unshift('embedded') }
      } else {
        (/\bBlackBerry\b/.test(C) || /\bBB10\b/.test(a)) && (q = (RegExp(C.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(a) || 0)[1] || p) ? (q = [q, /BB10/.test(a)], y = (q[1] ? (C = null, L = 'BlackBerry') : 'Device Software') + ' ' + q[0], p = null) : this != e && C != 'Wii' && (P && O || /Opera/.test(w) && /\b(?:MSIE|Firefox)\b/i.test(a) || w == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(y) || w == 'IE' && (y && !/^Win/.test(y) && p > 5.5 || /\bWindows XP\b/.test(y) && p > 8 || p == 8 && !/\bTrident\b/.test(a))) && !u.test(q =
l.call(e, a.replace(u, '') + ';')) && q.name && (q = 'ing as ' + q.name + ((q = q.version) ? ' ' + q : ''), u.test(w) ? (/\bIE\b/.test(q) && y == 'Mac OS' && (y = null), q = 'identify' + q) : (q = 'mask' + q, w = Q ? c(Q.replace(/([a-z])([A-Z])/g, '$1 $2')) : 'Opera', /\bIE\b/.test(q) && (y = null), P || (p = null)), B = ['Presto'], m.push(q))
      }
    } else w += ' Mobile'; if (q = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(a) || 0)[1]) {
      q = [parseFloat(q.replace(/\.(\d)$/, '.0$1')), q]; if (w == 'Safari' && q[1].slice(-1) == '+')w = 'WebKit Nightly', S = 'alpha', p = q[1].slice(0, -1); else if (p == q[1] || p == (q[2] =
(/\bSafari\/([\d.]+\+?)/i.exec(a) || 0)[1]))p = null; q[1] = (/\bChrome\/([\d.]+)/i.exec(a) || 0)[1]; q[0] == 537.36 && q[2] == 537.36 && parseFloat(q[1]) >= 28 && B == 'WebKit' && (B = ['Blink']); P && (x || q[1]) ? (B && (B[1] = 'like Chrome'), q = q[1] || (q = q[0], q < 530 ? 1 : q < 532 ? 2 : q < 532.05 ? 3 : q < 533 ? 4 : q < 534.03 ? 5 : q < 534.07 ? 6 : q < 534.1 ? 7 : q < 534.13 ? 8 : q < 534.16 ? 9 : q < 534.24 ? 10 : q < 534.3 ? 11 : q < 535.01 ? 12 : q < 535.02 ? '13+' : q < 535.07 ? 15 : q < 535.11 ? 16 : q < 535.19 ? 17 : q < 536.05 ? 18 : q < 536.1 ? 19 : q < 537.01 ? 20 : q < 537.11 ? '21+' : q < 537.13 ? 23 : q < 537.18 ? 24 : q < 537.24 ? 25 : q < 537.36 ? 26 : B !=
'Blink' ? '27' : '28')) : (B && (B[1] = 'like Safari'), q = (q = q[0], q < 400 ? 1 : q < 500 ? 2 : q < 526 ? 3 : q < 533 ? 4 : q < 534 ? '4+' : q < 535 ? 5 : q < 537 ? 6 : q < 538 ? 7 : q < 601 ? 8 : '8')); B && (B[1] += ' ' + (q += typeof q === 'number' ? '.x' : /[.+]/.test(q) ? '' : '+')); w == 'Safari' && (!p || parseInt(p) > 45) && (p = q)
    }w == 'Opera' && (q = /\bzbov|zvav$/.exec(y)) ? (w += ' ', m.unshift('desktop mode'), q == 'zvav' ? (w += 'Mini', p = null) : w += 'Mobile', y = y.replace(RegExp(' *' + q + '$'), '')) : w == 'Safari' && /\bChrome\b/.exec(B && B[1]) && (m.unshift('desktop mode'), w = 'Chrome Mobile', p = null, /\bOS X\b/.test(y) ? (L =
'Apple', y = 'iOS 4.3+') : y = null); p && p.indexOf(q = /[\d.]+$/.exec(y)) == 0 && a.indexOf('/' + q + '-') > -1 && (y = String(y.replace(q, '')).replace(/^ +| +$/g, '')); B && !/\b(?:Avant|Nook)\b/.test(w) && (/Browser|Lunascape|Maxthon/.test(w) || w != 'Safari' && /^iOS/.test(y) && /\bSafari\b/.test(B[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(w) && B[1]) && (q = B[B.length - 1]) && m.push(q); m.length && (m = ['(' + m.join('; ') + ')']); L && C && C.indexOf(L) < 0 && m.push('on ' + L); C && m.push((/^on /.test(m[m.length -
1]) ? '' : 'on ') + C); if (y) { var U = (q = / ([\d.+]+)$/.exec(y)) && y.charAt(y.length - q[0].length - 1) == '/'; y = { architecture: 32, family: q && !U ? y.replace(q[0], '') : y, version: q ? q[1] : null, toString: function () { var a = this.version; return this.family + (a && !U ? ' ' + a : '') + (this.architecture == 64 ? ' 64-bit' : '') } } }(q = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(R)) && !/\bi686\b/i.test(R) ? (y && (y.architecture = 64, y.family = y.family.replace(RegExp(' *' + q), '')), w && (/\bWOW64\b/i.test(a) || P && /\w(?:86|32)$/.test(v.cpuClass || v.platform) && !/\bWin64; x64\b/i.test(a)) &&
m.unshift('32-bit')) : y && /^OS X/.test(y.family) && w == 'Chrome' && parseFloat(p) >= 39 && (y.architecture = 64); a || (a = null); r = {}; r.description = a; r.layout = B && B[0]; r.manufacturer = L; r.name = w; r.prerelease = S; r.product = C; r.ua = a; r.version = w && p; r.os = y || { architecture: null, family: null, version: null, toString: function () { return 'null' } }; r.parse = l; r.toString = function () { return this.description || '' }; r.version && m.unshift(p); r.name && m.unshift(w); y && w && (y != String(y).split(' ')[0] || y != w.split(' ')[0] && !C) && m.push(C ? '(' + y + ')' : 'on ' +
y); m.length && (r.description = m.join(' ')); return r
  } var k = { 'function': !0, object: !0 }; var n = k[typeof window] && window || this; var p = k[typeof exports] && exports; k = k[typeof module] && module && !module.nodeType && module; var m = p && k && typeof global === 'object' && global; !m || m.global !== m && m.window !== m && m.self !== m || (n = m); var x = Math.pow(2, 53) - 1; var u = /\bOpera/; m = Object.prototype; var r = m.hasOwnProperty; var z = m.toString; var v = l(); typeof define === 'function' && typeof define.amd === 'object' && define.amd ? (n.platform = v, define(function () { return v })) : p &&
k ? e(v, function (a, b) { p[b] = a }) : n.platform = v
}).call(this); var s_iScaleFactor = 1; var s_bIsIphone = !1; var s_iOffsetX; var s_iOffsetY; var s_oCanvasLeft; var s_oCanvasTop;
(function (a) { (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent ||
navigator.vendor || window.opera); $(window).resize(function () { sizeHandler() }); function trace (a) { console.log(a) } function isChrome () { return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) } function isIOS () { var a = 'iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod'.split(';'); for (navigator.userAgent.toLowerCase().indexOf('iphone') !== -1 && (s_bIsIphone = !0); a.length;) if (navigator.platform === a.pop()) return !0; return s_bIsIphone = !1 }
function getSize (a) {
  var b = a.toLowerCase(); var c = window.document; var e = c.documentElement; if (void 0 === window['inner' + a])a = e['client' + a]; else if (window['inner' + a] != e['client' + a]) {
    var d = c.createElement('body'); d.id = 'vpw-test-b'; d.style.cssText = 'overflow:scroll'; var f = c.createElement('div'); f.id = 'vpw-test-d'; f.style.cssText = 'position:absolute;top:-1000px'; f.innerHTML = '<style>@media(' + b + ':' + e['client' + a] + 'px){body#vpw-test-b div#vpw-test-d{' + b + ':7px!important}}</style>'; d.appendChild(f); e.insertBefore(d, c.head)
    a = f['offset' + a] == 7 ? e['client' + a] : window['inner' + a]; e.removeChild(d)
  } else a = window['inner' + a]; return a
}window.addEventListener('orientationchange', onOrientationChange); function onOrientationChange () { window.matchMedia('(orientation: portrait)').matches && sizeHandler(); window.matchMedia('(orientation: landscape)').matches && sizeHandler() } function getIOSWindowHeight () { return document.documentElement.clientWidth / window.innerWidth * window.innerHeight }
function getHeightOfIOSToolbars () { var a = (window.orientation === 0 ? screen.height : screen.width) - getIOSWindowHeight(); return a > 1 ? a : 0 }
function sizeHandler () {
  window.scrollTo(0, 1); if ($('#canvas')) {
    var a = platform.name.toLowerCase() === 'safari' ? getIOSWindowHeight() : getSize('Height'); var b = getSize('Width'); _checkOrientation(b, a); var c = Math.min(a / CANVAS_HEIGHT, b / CANVAS_WIDTH); var e = CANVAS_WIDTH * c; c *= CANVAS_HEIGHT; if (c < a) { var d = a - c; c += d; e += CANVAS_WIDTH / CANVAS_HEIGHT * d } else e < b && (d = b - e, e += d, c += CANVAS_HEIGHT / CANVAS_WIDTH * d); d = a / 2 - c / 2; var f = b / 2 - e / 2; var g = CANVAS_WIDTH / e; if (f * g < -EDGEBOARD_X || d * g < -EDGEBOARD_Y) {
      c = Math.min(a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y),
        b / (CANVAS_WIDTH - 2 * EDGEBOARD_X)), e = CANVAS_WIDTH * c, c *= CANVAS_HEIGHT, d = (a - c) / 2, f = (b - e) / 2, g = CANVAS_WIDTH / e
    }s_iOffsetX = -1 * f * g; s_iOffsetY = -1 * d * g; d >= 0 && (s_iOffsetY = 0); f >= 0 && (s_iOffsetX = 0); s_oInterface !== null && s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY); s_oMenu !== null && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY); s_oLevelMenu !== null && s_oLevelMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY); s_oLanguageMenu !== null && s_oLanguageMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY); s_bIsIphone ? (canvas = document.getElementById('canvas'),
    s_oStage.canvas.width = 2 * e, s_oStage.canvas.height = 2 * c, canvas.style.width = e + 'px', canvas.style.height = c + 'px', s_iScaleFactor = 2 * Math.min(e / CANVAS_WIDTH, c / CANVAS_HEIGHT), s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor) : s_bMobile || isChrome() ? ($('#canvas').css('width', e + 'px'), $('#canvas').css('height', c + 'px'), s_iScaleFactor = 1) : (s_oStage.canvas.width = e, s_oStage.canvas.height = c, s_iScaleFactor = Math.min(e / CANVAS_WIDTH, c / CANVAS_HEIGHT), s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor); d < 0 || (d = (a - c) / 2); $('#canvas').css('top',
      d + 'px'); $('#canvas').css('left', f + 'px'); fullscreenHandler()
  }
} function createBitmap (a, b, c) { var e = new createjs.Bitmap(a); var d = new createjs.Shape(); b && c ? d.graphics.beginFill('#fff').drawRect(0, 0, b, c) : d.graphics.beginFill('#ff0').drawRect(0, 0, a.width, a.height); e.hitArea = d; return e } function createSprite (a, b, c, e, d, f) { a = b !== null ? new createjs.Sprite(a, b) : new createjs.Sprite(a); b = new createjs.Shape(); b.graphics.beginFill('#000000').drawRect(-c, -e, d, f); a.hitArea = b; return a }
function _checkOrientation (a, b) {
  s_bMobile && ENABLE_CHECK_ORIENTATION && (a > b ? $('.orientation-msg-container').attr('data-orientation') === 'landscape' ? ($('.orientation-msg-container').css('display', 'none'), s_oMain.startUpdate()) : ($('.orientation-msg-container').css('display', 'block'), s_oMain.stopUpdate()) : $('.orientation-msg-container').attr('data-orientation') === 'portrait' ? ($('.orientation-msg-container').css('display', 'none'), s_oMain.startUpdate()) : ($('.orientation-msg-container').css('display', 'block'),
  s_oMain.stopUpdate()))
} function randomFloatBetween (a, b, c) { typeof c === 'undefined' && (c = 2); return parseFloat(Math.min(a + Math.random() * (b - a), b).toFixed(c)) } function formatTime (a) { a /= 1E3; var b = Math.floor(a / 60); a = Math.floor(a - 60 * b); var c = ''; c = b < 10 ? c + ('0' + b + ':') : c + (b + ':'); return a < 10 ? c + ('0' + a) : c + a } function NoClickDelay (a) { this.element = a; window.Touch && this.element.addEventListener('touchstart', this, !1) }
function shuffle (a) { for (var b = a.length, c, e; b > 0;)e = Math.floor(Math.random() * b), b--, c = a[b], a[b] = a[e], a[e] = c; return a }
NoClickDelay.prototype = { handleEvent: function (a) { switch (a.type) { case 'touchstart':this.onTouchStart(a); break; case 'touchmove':this.onTouchMove(a); break; case 'touchend':this.onTouchEnd(a) } },
  onTouchStart: function (a) { a.preventDefault(); this.moved = !1; this.element.addEventListener('touchmove', this, !1); this.element.addEventListener('touchend', this, !1) },
  onTouchMove: function (a) { this.moved = !0 },
  onTouchEnd: function (a) {
    this.element.removeEventListener('touchmove', this, !1); this.element.removeEventListener('touchend',
      this, !1); if (!this.moved) { a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY); a.nodeType == 3 && (a = a.parentNode); var b = document.createEvent('MouseEvents'); b.initEvent('click', !0, !0); a.dispatchEvent(b) }
  } };
(function () {
  function a (a) { var c = { focus: 'visible', focusin: 'visible', pageshow: 'visible', blur: 'hidden', focusout: 'hidden', pagehide: 'hidden' }; a = a || window.event; a.type in c ? document.body.className = c[a.type] : (document.body.className = this[b] ? 'hidden' : 'visible', document.body.className === 'hidden' ? s_oMain.stopUpdate() : s_oMain.startUpdate()) } var b = 'hidden'; b in document ? document.addEventListener('visibilitychange', a) : (b = 'mozHidden') in document ? document.addEventListener('mozvisibilitychange', a) : (b = 'webkitHidden') in
document ? document.addEventListener('webkitvisibilitychange', a) : (b = 'msHidden') in document ? document.addEventListener('msvisibilitychange', a) : 'onfocusin' in document ? document.onfocusin = document.onfocusout = a : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = a
})(); function ctlArcadeResume () { s_oMain !== null && s_oMain.startUpdate() } function ctlArcadePause () { s_oMain !== null && s_oMain.stopUpdate() }
function getParamValue (a) { for (var b = window.location.search.substring(1).split('&'), c = 0; c < b.length; c++) { var e = b[c].split('='); if (e[0] == a) return e[1] } } function playSound (a, b, c) { return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[a].play(), s_aSounds[a].volume(b), s_aSounds[a].loop(c), s_aSounds[a]) : null } function stopSound (a) { !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].stop() } function setVolume (a, b) { !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].volume(b) }
function setMute (a, b) { !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].mute(b) } function between (a, b, c) { var e = !1; a < c && b > a && b < c && (e = !0); a > c && b > c && b < a && (e = !0); if (b === a || b === c)e = !0; return e } function pointInRectangle (a, b, c) { var e = !1; var d = c.y; var f = c.height; between(c.x, a, c.width) && between(d, b, f) && (e = !0); return e }
function directionNextCell (a, b) { if (a.x < b.x && a.y === b.y) return RIGHT; if (a.x > b.x && a.y === b.y) return LEFT; if (a.x === b.x && a.y > b.y) return UP; if (a.x === b.x && a.y < b.y) return DOWN; if (a.x > b.x && a.y < b.y) return DOWN_LEFT; if (a.x > b.x && a.y > b.y) return UP_LEFT; if (a.x < b.x && a.y > b.y) return UP_RIGHT; if (a.x < b.x && a.y < b.y) return DOWN_RIGHT } function rotate (a, b, c) { return { x: a * Math.cos(c) + b * Math.sin(c), y: a * -Math.sin(c) + b * Math.cos(c) } }
function fullscreenHandler () { ENABLE_FULLSCREEN && screenfull.enabled && (s_bFullscreen = screenfull.isFullscreen, s_oInterface !== null && s_oInterface.resetFullscreenBut(), s_oMenu !== null && s_oMenu.resetFullscreenBut(), s_oLevelMenu !== null && s_oLevelMenu.resetFullscreenBut(), s_oLanguageMenu !== null && s_oLanguageMenu.resetFullscreenBut()) }
if (screenfull.enabled)screenfull.on('change', function () { s_bFullscreen = screenfull.isFullscreen; s_oInterface !== null && s_oInterface.resetFullscreenBut(); s_oMenu !== null && s_oMenu.resetFullscreenBut(); s_oLevelMenu !== null && s_oLevelMenu.resetFullscreenBut(); s_oLanguageMenu !== null && s_oLanguageMenu.resetFullscreenBut() })
function CSpriteLibrary () {
  var a = {}; var b; var c; var e; var d; var f; var g; this.init = function (a, l, k) { b = {}; e = c = 0; d = a; f = l; g = k }; this.addSprite = function (d, e) { if (!a.hasOwnProperty(d)) { var f = new Image(); a[d] = b[d] = { szPath: e, oSprite: f, bLoaded: !1 }; c++ } }; this.getSprite = function (b) { return a.hasOwnProperty(b) ? a[b].oSprite : null }; this._onSpritesLoaded = function () { c = 0; f.call(g) }; this._onSpriteLoaded = function () { d.call(g); ++e === c && this._onSpritesLoaded() }; this.loadSprites = function () {
    for (var a in b) {
      b[a].oSprite.oSpriteLibrary = this, b[a].oSprite.szKey =
a, b[a].oSprite.onload = function () { this.oSpriteLibrary.setLoaded(this.szKey); this.oSpriteLibrary._onSpriteLoaded(this.szKey) }, b[a].oSprite.onerror = function (a) { var c = a.currentTarget; setTimeout(function () { b[c.szKey].oSprite.src = b[c.szKey].szPath }, 500) }, b[a].oSprite.src = b[a].szPath
    }
  }; this.setLoaded = function (b) { a[b].bLoaded = !0 }; this.isLoaded = function (b) { return a[b].bLoaded }; this.getNumSprites = function () { return c }
}
var CANVAS_WIDTH = 640; var CANVAS_HEIGHT = 960; var CANVAS_WIDTH_HALF = 0.5 * CANVAS_WIDTH; var CANVAS_HEIGHT_HALF = 0.5 * CANVAS_HEIGHT; var EDGEBOARD_X = 20; var EDGEBOARD_Y = 95; var FPS = 30; var FPS_TIME = 1 / FPS; var DISABLE_SOUND_MOBILE = !1; var PRIMARY_FONT = 'blackplotanregular'; var SECONDARY_FONT = 'arial'; var STATE_LOADING = 0; var STATE_MENU = 1; var STATE_HELP = 1; var STATE_GAME = 3; var ON_MOUSE_DOWN = 0; var ON_MOUSE_UP = 1; var ON_MOUSE_OVER = 2; var ON_MOUSE_OUT = 3; var ON_DRAG_START = 4; var ON_DRAG_END = 5; var STROKE_DIMENSION = 17; var STROKE_DIMENSION_MARKED = 7; var MAX_NUM_OF_COL_AND_ROW = 11; var SIZE_TEXT_CELL = 60; var MAX_ITERATION_RANDOM_NUMBER =
1E3; var TEXT_COLOR = '#ffffff'; var TEXT_COLOR_2 = '#018def'; var SPAWN_WORDS_OFFSET_Y = -10; var SHOW_SOLUTION = !1; var NUM_OF_LANGUAGE = 6; var LANGUAGE_ID = 'english french german italian portoguese spanish'.split(' '); var COLOR_STROKE_MARKED = 'rgba(255,0,0,0.7)'; var COLOR_STROKE = 'rgba(92,190,248,0.5)'; var OFFSET_Y_GRID_LETTER = -125; var OFFSET_Y_SPACE_WORDS_LIST = 7; var NO_DIRECTION = -1; var LEFT = 0; var RIGHT = 1; var UP = 2; var DOWN = 3; var UP_LEFT = 4; var UP_RIGHT = 5; var DOWN_LEFT = 6; var DOWN_RIGHT = 7; var ALL_DIRECTION = 8; var CELL_SIZE = { width: 100, height: 100 }; var TEXT_WORD_COLOR = '#2f2f2f'; var MAX_WORD_LENGTH = 9; var GRID_AREA_SIZE =
525; var START_X_GRID = (CANVAS_WIDTH - GRID_AREA_SIZE) / 2; var START_Y_GRID = CANVAS_HEIGHT - 200; var ENABLE_FULLSCREEN; var ENABLE_CHECK_ORIENTATION; var SOUNDTRACK_VOLUME_IN_GAME = 0.3; var TEXT_PRELOADER_CONTINUE = 'START'; var TEXT_SCORE = 'SCORE'; var TEXT_SCORE_GAMEOVER = 'Total Score'; var TEXT_PAUSE = 'PAUSE'; var TEXT_ARE_SURE = 'ARE YOU SURE?'; var TEXT_WIN = 'YOU WON'; var TEXT_TOTAL_SCORE = 'TOTAL SCORE'; var TEXT_SELECT_LANG = 'SELECT LANGUAGE'; var TEXT_SELECT_CATEGORY = 'SELECT CATEGORY'; var TEXT_CREDITS_DEVELOPED = 'DEVELOPED BY'; var TEXT_FAIL_GENERATION_MATRIX = 'FAIL TO GENERATE MATRIX OF WORDS DECREASE THE NUMBER OF WORDS OR WORDS LETTER OR RETRY TO REGENERATE MATRIX'
var TEXT_TIME = 'TIME'; var TEXT_SUMMARY = 'HOW TO PLAY'; var TEXT_HELP = 'Search up, down, forward, backward, and on the diagonal to find the hidden words.'; var TEXT_SHARE_IMAGE = '200x200.jpg'; var TEXT_SHARE_TITLE = 'Congratulations!'; var TEXT_SHARE_MSG1 = 'You collected <strong>'; var TEXT_SHARE_MSG2 = ' points</strong>!<br><br>Share your score with your friends!'; var TEXT_SHARE_SHARE1 = 'My score is '; var TEXT_SHARE_SHARE2 = ' points! Can you do better'
function CPreloader () {
  var a, b, c, e, d, f, g, h, l, k; this._init = function () { s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this); s_oSpriteLibrary.addSprite('progress_bar', './sprites/progress_bar.png'); s_oSpriteLibrary.addSprite('200x200', './sprites/200x200.jpg'); s_oSpriteLibrary.addSprite('but_start', './sprites/but_start.png'); s_oSpriteLibrary.loadSprites(); k = new createjs.Container(); s_oStage.addChild(k) }; this.unload = function () { k.removeAllChildren(); l.unload() }; this._onImagesLoaded = function () {}
  this._onAllImagesLoaded = function () { this.attachSprites(); s_oMain.preloaderReady() }; this.attachSprites = function () {
    var n = new createjs.Shape(); n.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); k.addChild(n); n = s_oSpriteLibrary.getSprite('200x200'); g = createBitmap(n); g.regX = 0.5 * n.width; g.regY = 0.5 * n.height; g.x = CANVAS_WIDTH / 2; g.y = CANVAS_HEIGHT / 2 - 180; k.addChild(g); h = new createjs.Shape(); h.graphics.beginFill('rgba(0,0,0,0.01)').drawRoundRect(g.x - 100, g.y - 100, 200, 200, 10); k.addChild(h); g.mask = h
    n = s_oSpriteLibrary.getSprite('progress_bar'); e = createBitmap(n); e.x = CANVAS_WIDTH / 2 - n.width / 2; e.y = CANVAS_HEIGHT / 2 + 50; k.addChild(e); a = n.width; b = n.height; d = new createjs.Shape(); d.graphics.beginFill('rgba(0,0,0,0.01)').drawRect(e.x, e.y, 1, b); k.addChild(d); e.mask = d; c = new createjs.Text('', '30px ' + PRIMARY_FONT, '#fff'); c.x = CANVAS_WIDTH / 2; c.y = CANVAS_HEIGHT / 2 + 100; c.textBaseline = 'alphabetic'; c.textAlign = 'center'; k.addChild(c); n = s_oSpriteLibrary.getSprite('but_start'); l = new CTextButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT /
2, n, TEXT_PRELOADER_CONTINUE, 'Arial', '#000', 40, k); l.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this); l.setVisible(!1); l.removeStroke(); f = new createjs.Shape(); f.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); k.addChild(f); createjs.Tween.get(f).to({ alpha: 0 }, 500).call(function () { createjs.Tween.removeTweens(f); k.removeChild(f) })
  }; this._onButStartRelease = function () { s_oMain._onRemovePreloader() }; this.refreshLoader = function (f) {
    c.text = f + '%'; f === 100 && (s_oMain._onRemovePreloader(),
    c.visible = !1, e.visible = !1); d.graphics.clear(); f = Math.floor(f * a / 100); d.graphics.beginFill('rgba(0,0,0,0.01)').drawRect(e.x, e.y, f, b)
  }; this._init()
}
function CMain (a) {
  var b; var c = 0; var e = 0; var d = STATE_LOADING; var f; var g; this.initContainer = function () {
    s_oCanvas = document.getElementById('canvas'); s_oStage = new createjs.Stage(s_oCanvas); createjs.Touch.enable(s_oStage); s_bMobile = jQuery.browser.mobile; !1 === s_bMobile && (s_oStage.enableMouseOver(20), $('body').on('contextmenu', '#canvas', function (a) { return !1 })); s_iPrevTime = (new Date()).getTime(); createjs.Ticker.addEventListener('tick', this._update); createjs.Ticker.framerate = 30; navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE =
!0); s_oSpriteLibrary = new CSpriteLibrary(); f = new CPreloader()
  }; this.preloaderReady = function () { this._loadImages(); !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds(); b = !0 }; this.soundLoaded = function () { c++; f.refreshLoader(Math.floor(c / e * 100)) }; this._initSounds = function () {
    Howler.mute(!s_bAudioActive); s_aSoundsInfo = []; s_aSoundsInfo.push({ path: './sounds/', filename: 'guessed', loop: !1, volume: 1, ingamename: 'guessed' }); s_aSoundsInfo.push({ path: './sounds/', filename: 'click', loop: !1, volume: 1, ingamename: 'click' })
    s_aSoundsInfo.push({ path: './sounds/', filename: 'wrong', loop: !0, volume: 1, ingamename: 'wrong' }); s_aSoundsInfo.push({ path: './sounds/', filename: 'game_completed', loop: !1, volume: 1, ingamename: 'game_completed' }); s_aSoundsInfo.push({ path: './sounds/', filename: 'soundtrack', loop: !0, volume: 1, ingamename: 'soundtrack' }); e += s_aSoundsInfo.length; s_aSounds = []; for (var a = 0; a < s_aSoundsInfo.length; a++) this.tryToLoadSound(s_aSoundsInfo[a], !1)
  }; this.tryToLoadSound = function (a, b) {
    setTimeout(function () {
      s_aSounds[a.ingamename] =
new Howl({ src: [a.path + a.filename + '.mp3'],
  autoplay: !1,
  preload: !0,
  loop: a.loop,
  volume: a.volume,
  onload: s_oMain.soundLoaded,
  onloaderror: function (a, b) { for (var c = 0; c < s_aSoundsInfo.length; c++) if (a === s_aSounds[s_aSoundsInfo[c].ingamename]._sounds[0]._id) { s_oMain.tryToLoadSound(s_aSoundsInfo[c], !0); break } },
  onplayerror: function (a) {
    for (var b = 0; b < s_aSoundsInfo.length; b++) {
      if (a === s_aSounds[s_aSoundsInfo[b].ingamename]._sounds[0]._id) {
        s_aSounds[s_aSoundsInfo[b].ingamename].once('unlock', function () {
          s_aSounds[s_aSoundsInfo[b].ingamename].play()
          s_aSoundsInfo[b].ingamename === 'soundtrack' && s_oGame !== null && setVolume('soundtrack', SOUNDTRACK_VOLUME_IN_GAME)
        }); break
      }
    }
  } })
    }, b ? 200 : 0)
  }; this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this); s_oSpriteLibrary.addSprite('bg_menu', './sprites/bg_menu.jpg'); s_oSpriteLibrary.addSprite('msg_box', './sprites/msg_box.png'); s_oSpriteLibrary.addSprite('bg_game', './sprites/bg_game.jpg'); s_oSpriteLibrary.addSprite('but_exit', './sprites/but_exit.png'); s_oSpriteLibrary.addSprite('but_pause',
      './sprites/but_pause.png'); s_oSpriteLibrary.addSprite('icon_audio', './sprites/icon_audio.png'); s_oSpriteLibrary.addSprite('but_play', './sprites/but_play.png'); s_oSpriteLibrary.addSprite('but_restart', './sprites/but_restart.png'); s_oSpriteLibrary.addSprite('but_continue', './sprites/but_continue.png'); s_oSpriteLibrary.addSprite('but_level', './sprites/but_category.png'); s_oSpriteLibrary.addSprite('hit_area_cell', './sprites/hit_area_cell.png'); s_oSpriteLibrary.addSprite('but_yes', './sprites/but_yes.png')
    s_oSpriteLibrary.addSprite('arrow_right', './sprites/arrow_right.png'); s_oSpriteLibrary.addSprite('arrow_left', './sprites/arrow_left.png'); s_oSpriteLibrary.addSprite('logo_ctl', './sprites/logo_ctl.png'); s_oSpriteLibrary.addSprite('but_not', './sprites/but_not.png'); s_oSpriteLibrary.addSprite('game_panel', './sprites/game_panel.png'); s_oSpriteLibrary.addSprite('word_panel', './sprites/word_panel.png'); s_oSpriteLibrary.addSprite('but_home',
      './sprites/but_home.png'); s_oSpriteLibrary.addSprite('img_help', './sprites/img_help.png'); s_oSpriteLibrary.addSprite('time_board', './sprites/time_board.png'); s_oSpriteLibrary.addSprite('logo_small', './sprites/logo_small.png'); s_oSpriteLibrary.addSprite('but_fullscreen', './sprites/but_fullscreen.png'); for (var a = 0; a < NUM_OF_LANGUAGE; a++)s_oSpriteLibrary.addSprite('flag_' + a, './sprites/flag_' + a + '.png'); e += s_oSpriteLibrary.getNumSprites(); s_oSpriteLibrary.loadSprites()
  }; this._onImagesLoaded = function () {
    c++
    f.refreshLoader(Math.floor(c / e * 100))
  }; this._onAllImagesLoaded = function () {}; this._onRemovePreloader = function () { f.unload(); s_oSoundTrack = playSound('soundtrack', 1, !0); s_oMain.gotoMenu() }; this.gotoMenu = function () { new CMenu(); d = STATE_MENU }; this.gotoGame = function (a) { g = new CGame(h, a); d = STATE_GAME; $(s_oMain).trigger('start_session') }; this.gotoLanguageMenu = function () { new CLanguageMenu(); d = STATE_MENU }; this.gotoLevelMenu = function () { new CLevelMenu(); d = STATE_MENU }; this.stopUpdate = function () {
    b = !1; createjs.Ticker.paused =
!0; $('#block_game').css('display', 'block'); !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || Howler.mute(!0)
  }; this.startUpdate = function () { s_iPrevTime = (new Date()).getTime(); b = !0; createjs.Ticker.paused = !1; $('#block_game').css('display', 'none'); (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) && s_bAudioActive && Howler.mute(!1) }; this._update = function (a) {
    if (!1 !== b) {
      var c = (new Date()).getTime(); s_iTimeElaps = c - s_iPrevTime; s_iCntTime += s_iTimeElaps; s_iCntFps++; s_iPrevTime = c; s_iCntTime >= 1E3 && (s_iCurFps = s_iCntFps, s_iCntTime -=
1E3, s_iCntFps = 0); d === STATE_GAME && g.update(); s_oStage.update(a)
    }
  }; s_oMain = this; var h = a; ENABLE_CHECK_ORIENTATION = a.check_orientation; ENABLE_FULLSCREEN = a.fullscreen; s_bAudioActive = a.audio_enable_on_startup; this.initContainer()
} var s_bMobile; var s_bAudioActive = !0; var s_iCntTime = 0; var s_iTimeElaps = 0; var s_iPrevTime = 0; var s_iCntFps = 0; var s_iCurFps = 0; var s_oAdsLevel = 1; var s_iLevelReached = 1; var s_oDrawLayer; var s_oStage; var s_oMain; var s_oSpriteLibrary; var s_oSoundTrack = null; var s_oCanvas; var s_aSounds; var s_iLanguageSelected; var s_aJSONWords; var s_bFullscreen = !1
function CTextButton (a, b, c, e, d, f, g, h) {
  var l, k, n, p, m, x, u; this._init = function (a, b, c, d, e, f, g, h) {
    l = []; k = []; e = createBitmap(c); var r = Math.ceil(g / 20); m = new createjs.Text(d, 'bold ' + g + 'px ' + PRIMARY_FONT, '#000000'); m.textAlign = 'center'; m.textBaseline = 'alphabetic'; var t = m.getBounds(); m.x = c.width / 2 + r; m.y = Math.floor(c.height / 2) + t.height / 3 + r; p = new createjs.Text(d, 'bold ' + g + 'px ' + PRIMARY_FONT, f); p.textAlign = 'center'; p.textBaseline = 'alphabetic'; t = p.getBounds(); p.x = c.width / 2; p.y = Math.floor(c.height / 2) + t.height / 3
    n = new createjs.Container(); n.x = a; n.y = b; n.regX = c.width / 2; n.regY = c.height / 2; n.addChild(e, m, p); h.addChild(n); this._initListener()
  }; this.unload = function () { n.off('mousedown', x); n.off('pressup', u); h.removeChild(n) }; this.setVisible = function (a) { n.visible = a }; this._initListener = function () { x = n.on('mousedown', this.buttonDown); u = n.on('pressup', this.buttonRelease) }; this.addEventListener = function (a, b, c) { l[a] = b; k[a] = c }; this.buttonRelease = function () { n.scaleX = 1; n.scaleY = 1; playSound('click', 1, !1); l[ON_MOUSE_UP] && l[ON_MOUSE_UP].call(k[ON_MOUSE_UP]) }
  this.buttonDown = function () { n.scaleX = 0.9; n.scaleY = 0.9; l[ON_MOUSE_DOWN] && l[ON_MOUSE_DOWN].call(k[ON_MOUSE_DOWN]) }; this.setTextPosition = function (a) { p.y = a; m.y = a + 2 }; this.setPosition = function (a, b) { n.x = a; n.y = b }; this.setX = function (a) { n.x = a }; this.setY = function (a) { n.y = a }; this.getButtonImage = function () { return n }; this.getX = function () { return n.x }; this.getY = function () { return n.y }; this.removeStroke = function () { m.visible = !1 }; this._init(a, b, c, e, d, f, g, h); return this
}
function CToggle (a, b, c, e, d) {
  var f; var g; var h; var l = []; var k; var n; var p; this._init = function (a, b, c, d) { g = []; h = []; var e = new createjs.SpriteSheet({ images: [c], frames: { width: c.width / 2, height: c.height, regX: c.width / 2 / 2, regY: c.height / 2 }, animations: { state_true: [0], state_false: [1] } }); f = d; k = createSprite(e, 'state_' + f, c.width / 2 / 2, c.height / 2, c.width / 2, c.height); k.mouseEnabled = !0; k.x = a; k.y = b; k.stop(); s_bMobile || (k.cursor = 'pointer'); m.addChild(k); this._initListener() }; this.unload = function () {
    k.off('mousedown', n); k.off('pressup', p); k.mouseEnabled =
!1; m.removeChild(k)
  }; this._initListener = function () { n = k.on('mousedown', this.buttonDown); p = k.on('pressup', this.buttonRelease) }; this.addEventListener = function (a, b, c) { g[a] = b; h[a] = c }; this.addEventListenerWithParams = function (a, b, c, d) { g[a] = b; h[a] = c; l = d }; this.setActive = function (a) { f = a; k.gotoAndStop('state_' + f) }; this.buttonRelease = function () { k.scaleX = 1; k.scaleY = 1; playSound('click', 1, !1); f = !f; k.gotoAndStop('state_' + f); g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], l) }; this.buttonDown = function () {
    k.scaleX =
0.9; k.scaleY = 0.9; g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN], l)
  }; this.setPosition = function (a, b) { k.x = a; k.y = b }; this.setVisible = function (a) { k.visible = a }; var m = d; this._init(a, b, c, e)
}
function CNumToggle (a, b, c, e) {
  var d; var f; var g; var h; var l; var k; var n; var p; var m; var x = []; this._init = function (a, b, c, e) {
    f = !1; g = []; h = []; l = new createjs.Container(); l.x = a; l.y = b; e.addChild(l); a = s_oSpriteLibrary.getSprite('num_button'); b = { images: [a], framerate: 5, frames: { width: a.width / 2, height: a.height, regX: a.width / 2 / 2, regY: a.height / 2 }, animations: { state_true: [0], state_false: [1] } }; b = new createjs.SpriteSheet(b); d = !1; k = createSprite(b, 'state_' + d, a.width / 2 / 2, a.height / 2, a.width / 2, a.height); k.stop(); a = s_oSpriteLibrary.getSprite('ball'); b = { images: [a],
      frames: { width: a.width / NUM_DIFFERENT_BALLS, height: a.height, regX: a.width / NUM_DIFFERENT_BALLS / 2, regY: a.height / 2 },
      animations: { red: [0], green: [1], cyan: [0], violet: [1], blue: [1] } }; b = new createjs.SpriteSheet(b); n = createSprite(b, 'red', a.width / NUM_DIFFERENT_BALLS / 2, a.height / 2, a.width / NUM_DIFFERENT_BALLS, a.height); n.gotoAndStop(0); n.visible = !1; l.addChild(k, n); this._initListener()
  }; this.unload = function () { l.off('mousedown', p); l.off('pressup', m); e.removeChild(l) }; this._initListener = function () {
    p = l.on('mousedown',
      this.buttonDown); m = l.on('pressup', this.buttonRelease)
  }; this.addEventListener = function (a, b, c) { g[a] = b; h[a] = c }; this.addEventListenerWithParams = function (a, b, c, d) { g[a] = b; h[a] = c; x = d }; this.setActive = function (a) { d = a; k.gotoAndStop('state_' + d) }; this.buttonRelease = function () { f || (playSound('click', 1, !1), d = !d, k.gotoAndStop('state_' + d), g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], x)) }; this.buttonDown = function () { f || g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN], x) }; this.setPosition = function (a, b) {
    l.x =
a; l.y = b
  }; this.getGlobalPosition = function () { return { x: l.localToGlobal(0, 0).x, y: l.localToGlobal(0, 0).y } }; this.block = function (a) { f = a }; this.setExtracted = function (a, b) { n.visible = a; n.gotoAndStop(b) }; this.highlight = function () { k.gotoAndPlay(0) }; this.stopHighlight = function () { k.gotoAndStop(1) }; this._init(a, b, c, e)
}
function CGfxButton (a, b, c, e) {
  var d; var f; var g; var h; var l = []; var k; var n; var p; var m; this._init = function (a, b, c, e) { d = f = 1; g = []; h = []; k = createBitmap(c); k.x = a; k.y = b; k.regX = c.width / 2; k.regY = c.height / 2; s_bMobile || (k.cursor = 'pointer'); x ? x.addChild(k) : s_oStage.addChild(k); n = !1; this._initListener() }; this.unload = function () { k.off('mousedown', p); k.off('pressup', m); x ? x.removeChild(k) : s_oStage.removeChild(k) }; this.setVisible = function (a) { k.visible = a }; this._initListener = function () { p = k.on('mousedown', this.buttonDown); m = k.on('pressup', this.buttonRelease) }
  this.addEventListener = function (a, b, c) { g[a] = b; h[a] = c }; this.addEventListenerWithParams = function (a, b, c, d) { g[a] = b; h[a] = c; l = d }; this.buttonRelease = function () { n || (playSound('click', 1, !1), k.scaleX = f, k.scaleY = d, g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], l)) }; this.buttonDown = function () { n || (k.scaleX = 0.9 * f, k.scaleY = 0.9 * d, g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN], l)) }; this.setScale = function (a) { d = f = a; k.scaleX = a; k.scaleY = a }; this.setScaleX = function (a) { f = a; k.scaleX = a }; this.setPosition = function (a,
    b) { k.x = a; k.y = b }; this.setX = function (a) { k.x = a }; this.setY = function (a) { k.y = a }; this.getButtonImage = function () { return k }; this.getX = function () { return k.x }; this.getY = function () { return k.y }; this.block = function (a) { n = a }; this.pulseAnimation = function () { createjs.Tween.get(k).to({ scaleX: 0.9 * f, scaleY: 0.9 * d }, 850, createjs.Ease.quadOut).to({ scaleX: f, scaleY: d }, 650, createjs.Ease.quadIn).call(function () { u.pulseAnimation() }) }; this.trebleAnimation = function () {
    createjs.Tween.get(k).to({ rotation: 5 }, 75, createjs.Ease.quadOut).to({ rotation: -5 },
      140, createjs.Ease.quadIn).to({ rotation: 0 }, 75, createjs.Ease.quadIn).wait(750).call(function () { u.trebleAnimation() })
  }; var x = e; var u = this; this._init(a, b, c, e); return this
}
function CMenu () {
  var a; var b; var c; var e; var d; var f; var g; var h; var l; var k; var n; var p; var m = null; var x = null; this._init = function () {
    g = createBitmap(s_oSpriteLibrary.getSprite('bg_menu')); s_oStage.addChild(g); var u = s_oSpriteLibrary.getSprite('but_play'); h = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 250, u); h.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this); if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) {
      u = s_oSpriteLibrary.getSprite('icon_audio'), d = CANVAS_WIDTH - u.width / 2 + 15, f = u.height / 2 + 15, n = new CToggle(d, f, u, s_bAudioActive, s_oStage), n.addEventListener(ON_MOUSE_UP,
        this._onAudioToggle, this)
    }u = s_oSpriteLibrary.getSprite('but_info'); c = u.width / 2 + 15; e = u.height / 2 + 15; l = new CGfxButton(c, e, u); l.addEventListener(ON_MOUSE_UP, this._onCredits, this); u = window.document; var r = u.documentElement; m = r.requestFullscreen || r.mozRequestFullScreen || r.webkitRequestFullScreen || r.msRequestFullscreen; x = u.exitFullscreen || u.mozCancelFullScreen || u.webkitExitFullscreen || u.msExitFullscreen; !1 === ENABLE_FULLSCREEN && (m = !1); m && screenfull.enabled && (u = s_oSpriteLibrary.getSprite('but_fullscreen'),
    a = c + u.width / 2 + 15, b = u.height / 2 + 15, p = new CToggle(a, b, u, s_bFullscreen, s_oStage), p.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)); k = new createjs.Shape(); k.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); s_oStage.addChild(k); createjs.Tween.get(k).to({ alpha: 0 }, 1E3).call(function () { s_oStage.removeChild(k) }); this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  }; this.unload = function () {
    h.unload(); h = null; s_oStage.removeChild(g); g = null; if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) {
      n.unload(),
      n = null
    }m && screenfull.enabled && p.unload(); createjs.Tween.removeAllTweens(); s_oMenu = null
  }; this.refreshButtonPos = function (g, k) { !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || n.setPosition(d - g, f + k); m && screenfull.enabled && p.setPosition(a + g, b + k); l.setPosition(c + g, e + k) }; this._onCredits = function () { new CCreditsPanel() }; this._onAudioToggle = function () { Howler.mute(s_bAudioActive); s_bAudioActive = !s_bAudioActive }; this._onButPlayRelease = function () { this.unload(); s_oMain.gotoLanguageMenu() }; this.resetFullscreenBut = function () {
    m &&
screenfull.enabled && p.setActive(s_bFullscreen)
  }; this._onFullscreenRelease = function () { s_bFullscreen ? x.call(window.document) : m.call(window.document.documentElement); sizeHandler() }; s_oMenu = this; this._init()
} var s_oMenu = null
function CGame (a, b) {
  var c; var e; var d; var f; var g; var h; var l; var k; var n; var p; var m; var x; var u; var r; var z; var v; var A; var t; var D; var J = !0; var K = !1; var I; var H; var N; var G; this._init = function () { I = !0; e = createBitmap(s_oSpriteLibrary.getSprite('bg_game')); s_oStage.addChild(e); u = ''; r = b.words; h = b.rows; l = b.cols; t = []; z = []; D = []; A = []; v = []; this._createGrid(); H = 0; d = new CInterface(); this.controlWords(); this.fillGridAttempts(); for (var a = 0; a < r.length; a++)v[a] = null; r.sort(); d.spawnWords(r); d.createHelpPanel(); N = s_oStage.on('pressup', this._onStageRelease); setVolume('soundtrack', 0.3) }; this.restartLevel = function () {
    K =
I = !1; this.unloadGrid(); z = []; D = []; A = []; t = []; for (var a = 0; a < r.length; a++)v[a] = null; this._createGrid(); this.clearCharGridCell(); this.deleteAllLineDraw(); this.fillGridAttempts(); H = 0; this.time(); d.createFade(); d.refreshButtonPos(s_iOffsetX, s_iOffsetY); d.destroyAllLineDrawWordsGuessed()
  }; this.unloadGrid = function () { for (var a = 0; a < h; a++) for (var b = 0; b < l; b++)t[a][b].unload(); t = null; s_oStage.removeChild(f) }; this.deleteAllLineDraw = function () { for (var a = 0; a < A.length; a++)s_oStage.removeChild(v[a]), v[a] = null }; this.setPause =
function (a) { I = a }; this.refreshPositionContainerGrid = function (a) { f.y = c.y + a; this.setRectCells() }; this._createGrid = function () {
    f = new createjs.Container(); s_oStage.addChild(f); p = parseInt(GRID_AREA_SIZE / l); n = parseInt(GRID_AREA_SIZE / h); m = p / 2; x = n / 2; for (var a = 0; a < r.length; a++)z.push(''); for (var b = a = 0; b < h; b++) { t[b] = []; for (var d = 0; d < l; d++)t[b][d] = new CWordCell(b, d, START_X_GRID + d * p + m, START_Y_GRID + b * n + x, f, 'hide', GRID_AREA_SIZE / l / CELL_SIZE.width, a), a++ }f.x = 0; f.y = -f.getBounds().height - 10; a = s_oSpriteLibrary.getSprite('game_panel')
    a = createBitmap(a); a.x = 35; a.y = f.getBounds().height + 220; f.addChild(a); f.setChildIndex(a, 0); c = { x: f.x, y: f.y }; this.setRectCells()
  }; this.onContinue = function () { this.unload(); setVolume('soundtrack', 1); s_oMain.gotoLevelMenu(); $(s_oMain).trigger('end_level', 1); $(s_oMain).trigger('end_session') }; this.fillGridAttempts = function () { var a = 0; do { var b = this.fillGrid(); a++ } while (!1 === b && a < 1E3);b || (d.createFailGridPanel(), I = !0) }; this.setRectCells = function () {
    for (var a = 0; a < h; a++) {
      for (var b = 0; b < l; b++) {
        t[a][b].setRecOffset({ x: f.x,
          y: f.y })
      }
    }
  }; this._onExitHelp = function () { this.setPause(!1); $(s_oMain).trigger('start_level', 1); d.unloadHelpPanel() }; this.controlWords = function () {}; this.orderWordsDescendant = function () { do { var a = !1; for (var b = 0; b < r.length - 1; b++)r[b].length < r[b + 1].length && (a = r[b], r[b] = r[b + 1], r[b + 1] = a, a = !0) } while (a) }; this.onExit = function () { s_oGame.unload(); s_oMain.gotoMenu(); $(s_oMain).trigger('end_level', 1); $(s_oMain).trigger('end_session'); $(s_oMain).trigger('show_interlevel_ad'); setVolume('soundtrack', 1) }; this.unload = function () {
    d.unload()
    s_oStage.off('pressup', N); s_oStage.off('pressmove', G); for (var a = 0; a < h; a++) for (var b = 0; b < l; b++)t[a][b].unload(); t = null; createjs.Tween.removeAllTweens(); s_oStage.removeAllChildren()
  }; this.onCellSelected = function (a) {
    if (J) {
      J = !1; D.push(a); a.setActive(!0); u += a.getChar(); k = ALL_DIRECTION; if (v[A.length] === null) {
        var b = new createjs.Shape(); b.graphics.setStrokeStyle(STROKE_DIMENSION, 'round'); b.graphics.beginStroke(COLOR_STROKE); b.graphics.moveTo(a.getX(), a.getY()); b.graphics.lineTo(a.getX(), a.getY() - 2); v[A.length] =
b; v[A.length].mouseEnabled = !1; f.addChild(v[A.length])
      }G = s_oStage.on('pressmove', this._onPressMove)
    }
  }; this.drawLine = function (a, b) { v[A.length].graphics.clear(); v[A.length].graphics.setStrokeStyle(STROKE_DIMENSION, 'round', 'round'); v[A.length].graphics.beginStroke(COLOR_STROKE); v[A.length].graphics.moveTo(D[0].getX(), D[0].getY()); v[A.length].graphics.lineTo(a, b) }; this.fillGrid = function () {
    this.clearCharGridCell(); var a = [LEFT, RIGHT, UP, DOWN, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT]; if (!this.placeFirstWordInRandomPos(r[0],
      a)) return !1; for (var b, c = 1; c < r.length; c++) {
      var d = []; a = shuffle(a); for (var e = !1, f = 0; f < a.length; f++) {
        b = a[f]; switch (b) {
          case LEFT:b = this.searchAFreePosition(placeWordsLeft, r[c], t); b.success && (d.push(b), e = !0); break; case RIGHT:b = this.searchAFreePosition(placeWordsRight, r[c], t, l); b.success && (d.push(b), e = !0); break; case UP:b = this.searchAFreePosition(placeWordsUp, r[c], t); b.success && (d.push(b), e = !0); break; case DOWN:b = this.searchAFreePosition(placeWordsDown, r[c], t, h); b.success && (d.push(b), e = !0); break; case UP_LEFT:b =
this.searchAFreePosition(placeWordsUpLeft, r[c], t); b.success && (d.push(b), e = !0); break; case UP_RIGHT:b = this.searchAFreePosition(placeWordsUpRight, r[c], t, l); b.success && (d.push(b), e = !0); break; case DOWN_LEFT:b = this.searchAFreePosition(placeWordsDownLeft, r[c], t, h); b.success && (d.push(b), e = !0); break; case DOWN_RIGHT:b = this.searchAFreePosition(placeWordsDownRight, r[c], t, h, l), b.success && (d.push(b), e = !0)
        } if (f === a.length - 1 && !e) return !1
      } this.searchWordWithMinWeight(d)
    } for (a = 0; a < h; a++) {
      for (c = 0; c < l; c++) {
        t[a][c].getChar() === '' &&
t[a][c].setRandomChar(Math.floor(Math.random() * s_aJSONWords.alphabet.length))
      }
    } return !0
  }; this.searchWordWithMinWeight = function (a) { for (var b = a[0].list[0].weight, c = a[0].list[0], d = 0; d < a.length; d++) for (var e = 0; e < a[d].list.length; e++)b > a[d].list[e].weight && (c = a[d].list[e], b = a[d].list[e].weight); this.insertWordOnGrid(c) }; this.insertWordOnGrid = function (a) { for (var b = this.getRandomColor(), c = 0; c < a.list_cell.length; c++) { var d = a.list_cell[c]; t[d.r][d.c].changeCellText(d['char']); SHOW_SOLUTION && t[d.r][d.c].changeTextColor(b) } }
  this.getRandomColor = function () { return 'rgba(' + (Math.floor(127 * Math.random() + 128) - 128) + ',' + (Math.floor(127 * Math.random() + 128) - 128) + ',' + (Math.floor(127 * Math.random() + 128) - 128) + ',1)' }; this.searchAFreePosition = function (a, b) { for (var c = [], d = !1, e = 0; e < t.length; e++) for (var f = 0; f < t[e].length; f++) { var g = a(b, e, f, t); g.success && (c.push(g), d = !0) } return { list: c, success: d } }; this.clearCharGridCell = function () { for (var a = 0; a < t.length; a++) for (var b = 0; b < t[a].length; b++)t[a][b].changeCellText('') }; this.placeFirstWordInRandomPos =
function (a, b) {
  var c = Math.floor(Math.random() * h); var d = Math.floor(Math.random() * l); var e = 0; b = shuffle(b); for (var f, g = 0; g < b.length; g++) {
    switch (f = b[g], f) {
      case LEFT:if (d - a.length > -1) { for (g = d; g > d - a.length; g--)t[c][g].changeCellText(a.charAt(e)), e++; return !0 } break; case RIGHT:if (d + a.length < l + 1) { for (g = d; g < d + a.length; g++)t[c][g].changeCellText(a.charAt(e)), e++; return !0 } break; case UP:if (c - a.length > -1) { for (g = c; g > c - a.length; g--)t[g][d].changeCellText(a.charAt(e)), e++; return !0 } break; case DOWN:if (c + a.length < h + 1) {
        for (g = c; g <
c + a.length; g++)t[g][d].changeCellText(a.charAt(e)), e++; return !0
      } break; case UP_LEFT:if (f = d, c - a.length > -1 && d - a.length > 0) { for (g = c; g > c - a.length; g--)t[g][f].changeCellText(a.charAt(e)), f--, e++; return !0 } case UP_RIGHT:f = d; if (c - a.length > -1 && d + a.length < l) { for (g = c; g > c - a.length; g--)t[g][f].changeCellText(a.charAt(e)), f++, e++; return !0 } break; case DOWN_LEFT:f = d; if (c + a.length < h + 1 && d - a.length > 0) { for (g = c; g < c + a.length; g++)t[g][f].changeCellText(a.charAt(e)), f--, e++; return !0 } break; case DOWN_RIGHT:if (f = d, c + a.length <
h + 1 && d + a.length < l) { for (g = c; g < c + a.length; g++)t[g][f].changeCellText(a.charAt(e)), f++, e++; return !0 }
    }
  } return !1
}; this._onPressMove = function (a) {
    s_oGame.lineDrawing(a.stageX / s_iScaleFactor - f.x, a.stageY / s_iScaleFactor - f.y); if (v[A.length] !== null) { var b = v[A.length].graphics.command.x + f.x; var c = v[A.length].graphics.command.y + f.y - 2 } else b = a.stageX / s_iScaleFactor, c = a.stageY / s_iScaleFactor; for (var d = 0; d < h; d++) {
      for (var e = 0; e < l; e++) {
        if (s_oGame.dirByMouse(a.stageX / s_iScaleFactor, a.stageY / s_iScaleFactor, d, e), !1 === t[d][e].isActive() &&
pointInRectangle(b, c, t[d][e].getRectPos())) { s_oGame.onCellOver(t[d][e]); break }
      }
    }
  }; this.dirByMouse = function (a, b, c, d) { pointInRectangle(a, b, t[c][d].getRectPos()) && (k = s_oGame.directionCell(D[0], t[c][d])) }; this.onCellOver = function (a) { J || (g = { r: a.getRow(), c: a.getCol() }, D.push(a)) }; this.lineDrawing = function (a, b) {
    if (v[A.length] !== null) {
      switch (k) {
        case LEFT:case RIGHT:case UP:case DOWN:case UP_LEFT:case UP_RIGHT:case DOWN_LEFT:case DOWN_RIGHT:var c = this.constrainLineDrawAngle(D[0].getX(), D[0].getY(), a, b); this.drawLine(c.x,
          c.y - 2); break; case ALL_DIRECTION:this.drawLine(a, b)
      }
    }
  }; this.directionCell = function (a, b) { if (a !== 'undefined') { var c = { x: a.getX(), y: a.getY() }; var d = { x: b.getX(), y: b.getY() }; return directionNextCell(c, d) } }; this.constrainLineDrawAngle = function (a, b, c, d) {
    c -= a; var e = d - b; d = Math.sqrt(c * c + e * e); c = Math.atan2(e, c) / Math.PI * 180; c = c % 360 + 180; c <= 22.5 || c >= 337.5 ? c = 0 : c <= 67.5 ? c = 45 : c <= 112.5 ? c = 90 : c <= 157.5 ? c = 135 : c <= 202.5 ? c = 180 : c <= 247.5 ? c = 225 : c <= 292.5 ? c = 270 : c < 337.5 && (c = 315); c -= 180; return { x: d * Math.cos(c * Math.PI / 180) + a,
      y: d * Math.sin(c *
Math.PI / 180) + b }
  }; this._onStageRelease = function () { J || (s_oStage.off('pressmove', G), J = !0, s_oGame._onCheckWord()) }; this.deleteALineDraw = function (a) { v[a].graphics.clear(); s_oStage.removeChild(v[a]); v[a] = null }; this._onCheckWord = function () {
    if (void 0 !== g) {
      var a = this.checkWord(); if (u.length < 2) this.deleteALineDraw(A.length), this._clearMatrix(), playSound('wrong', 1, !1); else {
        for (var b, c = -1, e = 0; e < r.length; e++) if (r[e] === u) { c = 1; b = e; break } if (c === -1) {
          this._clearMatrix(), this.deleteALineDraw(A.length), playSound('wrong',
            1, !1)
        } else { c = !1; for (e = 0; e < A.length; e++) if (A[e] === u) { c = !0; this.deleteALineDraw(A.length); playSound('wrong', 1, !1); break }c || (this.drawLine(a.x, a.y), v[A.length].graphics.endStroke(), A.push(u), d.drawLineOnWord(b), this.checkFinishWordList(), playSound('guessed', 1, !1)); this._clearMatrix() }
      }
    }
  }; this.checkFinishWordList = function () { A.length === r.length && (d.createWinPanel(Math.floor(BONUS_TIME / 60 - H / 60)), playSound('game_completed', 1, !1), K = !0) }; this.checkWord = function () {
    var a = v[A.length].graphics.command; var b = D[0].getRow()
    var c = D[0].getCol(); var d = D[0].getX() + f.x; var e = D[0].getY() + f.y; switch (k) {
      case LEFT:for (var h = c; h > g.c - 1; h--) for (c = a.x; c < d; c += 0.07 * CELL_SIZE.width) if (!1 === t[b][h].isActive() && pointInRectangle(c, e, t[b][h].getRectPos())) { u += t[b][h].getChar(); t[b][h].setActive(!0); var n = { x: t[b][h].getX(), y: t[b][h].getY() }; break } break; case RIGHT:for (h = c; h < g.c + 1; h++) {
        for (c = a.x; c > d; c -= 0.07 * CELL_SIZE.width) {
          if (!1 === t[b][h].isActive() && pointInRectangle(c, e, t[b][h].getRectPos())) {
            u += t[b][h].getChar(); t[b][h].setActive(!0); n = { x: t[b][h].getX(),
              y: t[b][h].getY() }; break
          }
        }
      } break; case UP:for (;b > g.r - 1; b--) for (h = a.y + f.y; h < e; h += 0.07 * CELL_SIZE.height) if (!1 === t[b][c].isActive() && pointInRectangle(d, h, t[b][c].getRectPos())) { u += t[b][c].getChar(); t[b][c].setActive(!0); n = { x: t[b][c].getX(), y: t[b][c].getY() }; break } break; case DOWN:for (;b < g.r + 1; b++) for (h = a.y + f.y; h > e; h -= 0.07 * CELL_SIZE.height) if (!1 === t[b][c].isActive() && pointInRectangle(d, h, t[b][c].getRectPos())) { u += t[b][c].getChar(); t[b][c].setActive(!0); n = { x: t[b][c].getX(), y: t[b][c].getY() }; break } break; case UP_LEFT:for (d =
c; b > g.r - 1; b--) { c = a.x; for (h = a.y + f.y; h < e; h += 0.07 * CELL_SIZE.height) { if (!1 === t[b][d].isActive() && pointInRectangle(c, h, t[b][d].getRectPos())) { u += t[b][d].getChar(); t[b][d].setActive(!0); n = { x: t[b][d].getX(), y: t[b][d].getY() }; break }c += 0.07 * CELL_SIZE.width }d--; if (d < 0) break } break; case UP_RIGHT:for (d = c; b > g.r - 1; b--) {
        c = a.x; for (h = a.y + f.y; h < e; h += 0.07 * CELL_SIZE.height) {
          if (!1 === t[b][d].isActive() && pointInRectangle(c, h, t[b][d].getRectPos())) {
            u += t[b][d].getChar(); t[b][d].setActive(!0); n = { x: t[b][d].getX(), y: t[b][d].getY() }
            break
          }c -= 0.07 * CELL_SIZE.width
        }d++; if (d > l - 1) break
      } break; case DOWN_RIGHT:for (d = c; b < g.r + 1; b++) { c = a.x; for (h = a.y + f.y; h > e; h -= 0.07 * CELL_SIZE.height) { if (!1 === t[b][d].isActive() && pointInRectangle(c, h, t[b][d].getRectPos())) { u += t[b][d].getChar(); t[b][d].setActive(!0); n = { x: t[b][d].getX(), y: t[b][d].getY() }; break }c -= 0.07 * CELL_SIZE.width }d++; if (d > l - 1) break } break; case DOWN_LEFT:for (d = c; b < g.r + 1; b++) {
        c = a.x; for (h = a.y + f.y; h > e; h -= 0.07 * CELL_SIZE.height) {
          if (!1 === t[b][d].isActive() && pointInRectangle(c, h, t[b][d].getRectPos())) {
            u +=
t[b][d].getChar(); t[b][d].setActive(!0); n = { x: t[b][d].getX(), y: t[b][d].getY() }; break
          }c += 0.07 * CELL_SIZE.width
        }d--; if (d < 0) break
      }
    } return n
  }; this._clearMatrix = function () { for (var a = 0; a < h; a++) for (var b = 0; b < l; b++)t[a][b].setActive(!1); D = []; J = !0; u = '' }; this.time = function () { H += FPS_TIME; d.refreshTime(Math.floor(H / 3600) % 99, Math.floor(H / 60) % 60, Math.floor(H) % 60) }; this.update = function () { !1 === I && (K || this.time(), d.refreshFPSText(Math.floor(createjs.Ticker.getMeasuredFPS()))) }; s_oGame = this; BONUS_TIME = a.bonus_time; NUM_LEVELS_FOR_ADS =
a.num_levels_for_ads; this._init()
} var s_oGame
function CAreYouSurePanel (a) {
  var b, c, e, d, f, g; this._init = function () {
    d = new createjs.Container(); d.alpha = 0; d.visible = !1; h.addChild(d); f = createBitmap(s_oSpriteLibrary.getSprite('bg_game')); d.on('click', function () {}); d.addChild(f); var a = s_oSpriteLibrary.getSprite('logo_small'); g = new CLogo(0.5 * a.width + 15, 0.5 * a.height + 15, a, d); a = s_oSpriteLibrary.getSprite('msg_box'); b = createBitmap(a); b.x = CANVAS_WIDTH_HALF; b.y = CANVAS_HEIGHT_HALF; b.regX = 0.5 * a.width; b.regY = 0.5 * a.height; d.addChild(b); new CTLText(d, CANVAS_WIDTH / 2 - 200,
      320, 400, 160, 80, 'center', TEXT_COLOR, PRIMARY_FONT, 1, 0, 0, TEXT_ARE_SURE, !0, !0, !0, !1); c = new CGfxButton(CANVAS_WIDTH / 2 + 150, 0.5 * CANVAS_HEIGHT + 110, s_oSpriteLibrary.getSprite('but_yes'), d); c.addEventListener(ON_MOUSE_UP, this._onButYes, this); e = new CGfxButton(CANVAS_WIDTH / 2 - 150, 0.5 * CANVAS_HEIGHT + 110, s_oSpriteLibrary.getSprite('but_not'), d); e.addEventListener(ON_MOUSE_UP, this._onButNo, this); this.refreshPosLogo(s_iOffsetX, s_iOffsetY)
  }; this.show = function () {
    s_oGame.setPause(!0); d.visible = !0; createjs.Tween.get(d).to({ alpha: 1 },
      300, createjs.quartOut).call(function () { createjs.Ticker.paused = !0 })
  }; this.refreshPosLogo = function (a, b) { var c = g.getStartPos(); g.setPosition(c.x + a, c.y + b) }; this._onButYes = function () { s_oGame.setPause(!1); createjs.Ticker.paused = !1; s_oGame.onExit(); d.removeAllEventListeners() }; this.unload = function () { createjs.Tween.get(d).to({ alpha: 0 }, 300, createjs.quartOut).call(function () { h.removeChild(d) }) }; this._onButNo = function () { createjs.Ticker.paused = !1; s_oGame.setPause(!1); s_oInterface.unloadAreYouSure(); d.removeAllEventListeners() }
  var h = a; this._init()
}
function CInterface () {
  var a; var b; var c; var e; var d; var f; var g; var h; var l; var k; var n; var p; var m; var x; var u; var r; var z; var v = null; var A; var t; var D; var J; var K; var I; var H = null; var N; var G; var E = null; var M = null; this._init = function () {
    c = 0; e = 115; r = new createjs.Container(); s_oStage.addChild(r); r.x = c; r.y = e; var v = s_oSpriteLibrary.getSprite('word_panel'); K = createBitmap(v); K.x = 0.1 * v.width - 20; K.y = 0.5 * -v.height + 20; r.addChild(K); t = []; N = []; var F = s_oSpriteLibrary.getSprite('but_exit'); g = v = CANVAS_WIDTH - F.width / 2 - 15; h = F.height / 2 + 15; u = new CGfxButton(g, h, F); u.addEventListener(ON_MOUSE_UP, this._onExit, this); F = s_oSpriteLibrary.getSprite('but_pause')
    n = v -= F.width + 15; p = F.height / 2 + 15; x = new CGfxButton(n, p, F); x.addEventListener(ON_MOUSE_UP, this._onButPauseRelease, this); !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (F = s_oSpriteLibrary.getSprite('icon_audio'), l = v -= F.width / 2 + 15, k = F.height / 2 + 15, m = new CToggle(l, k, F, s_bAudioActive, s_oStage), m.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this), F = s_oSpriteLibrary.getSprite('but_fullscreen'), a = l - F.width / 2 - 10) : (F = s_oSpriteLibrary.getSprite('but_fullscreen'), a = n - F.width / 2 - 15); b = F.height / 2 + 15; v = window.document
    var A = v.documentElement; E = A.requestFullscreen || A.mozRequestFullScreen || A.webkitRequestFullScreen || A.msRequestFullscreen; M = v.exitFullscreen || v.mozCancelFullScreen || v.webkitExitFullscreen || v.msExitFullscreen; !1 === ENABLE_FULLSCREEN && (E = !1); E && screenfull.enabled && (G = new CToggle(a, b, F, s_bFullscreen, s_oStage), G.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)); d = CANVAS_WIDTH_HALF - 50; f = CANVAS_HEIGHT_HALF - 450; z = this.createText(d, f, 'FPS:', 20, 'left', 'middle', 400); s_oStage.addChild(z); v = s_oSpriteLibrary.getSprite('time_board')
    J = new CTimeBoard(v, 15, 15); this.createFade(); this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  }; this.createFade = function () { var a = new createjs.Shape(); a.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); a.alpha = 1; s_oStage.addChild(a); createjs.Tween.get(a).to({ alpha: 0 }, 1E3, createjs.Ease.cubicOut).call(function () { s_oStage.removeChild(a) }) }; this.destroyAllLineDrawWordsGuessed = function () { for (var a = 0; a < N.length; a++)r.removeChild(N[a]); N = [] }; this.createHelpPanel = function () {
    var a = s_oSpriteLibrary.getSprite('msg_box')
    I = new CHelpPanel(a)
  }; this.refreshButtonPos = function (c, d) { !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || m.setPosition(l - c, k + d); E && screenfull.enabled && G.setPosition(a - c, b + d); x.setPosition(n - c, p + d); u.setPosition(g - c, h + d); z.y = f + d; r.y = e + d; var t = J.getStartPosition(); J.setPosition(t.x + c, t.y + d); v !== null && v.refreshPosLogo(c, d); H !== null && H.refreshPosLogo(c, d); s_oGame.refreshPositionContainerGrid(d) }; this.unloadHelpPanel = function () { I.unload() }; this.createText = function (a, b, c, d, e, f, g) {
    c = new createjs.Text(c, d + 'px ' +
PRIMARY_FONT, TEXT_COLOR); c.x = a; c.y = b; c.textAlign = e; c.textBaseline = f; c.lineWidth = g; return c
  }; this.spawnWords = function (a) {
    for (var b = 2 * EDGEBOARD_X + 15, d = b, e = SPAWN_WORDS_OFFSET_Y, f = 0; f < a.length; f++) {
      t.push(new createjs.Text(a[f], ' 20px ' + SECONDARY_FONT, TEXT_COLOR)), t[f].x = d, t[f].y = e, t[f].textAlign = 'left', t[f].textBaseline = 'middle', t[f].lineWidth = 400, t[f].x + t[f].getBounds().width > CANVAS_WIDTH - b && (d = b, e += t[f].getBounds().height + OFFSET_Y_SPACE_WORDS_LIST, t[f].x = d, t[f].y = e), r.addChild(t[f]), d += t[f].getBounds().width +
15, d > CANVAS_WIDTH - b - t[f].getBounds().width && (d = b, e += t[f].getBounds().height + OFFSET_Y_SPACE_WORDS_LIST)
    }r.x = c
  }; this.drawLineOnWord = function (a) { var b = new createjs.Shape(); b.graphics.setStrokeStyle(STROKE_DIMENSION_MARKED, 'round', 'round'); b.graphics.beginStroke(COLOR_STROKE_MARKED); b.graphics.moveTo(t[a].x, t[a].y); b.graphics.lineTo(t[a].x + t[a].getBounds().width, t[a].y); b.graphics.closePath(); N.push(b); r.addChild(b) }; this.refreshFPSText = function (a) { z.text = 'FPS:' + a }; this.createWinPanel = function (a) {
    var b =
s_oSpriteLibrary.getSprite('msg_box'); A = new CEndPanel(b); A.show(a)
  }; this._onButReturnToMenuRelease = function () { s_oGame.onExit() }; this._onButPauseRelease = function () { v = new CPause() }; this.numLevel = function (a) {}; this.unloadPause = function () { v.unload(); v = null }; this.createFailGridPanel = function () { var a = s_oSpriteLibrary.getSprite('msg_box'); D = new CFailGenerateGrid(a) }; this.unloadFailPanel = function () { D.unload(); D = null }; this.unload = function () {
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)m.unload(), m = null; E && screenfull.enabled &&
G.unload(); u.unload(); u = null; x.unload(); s_oInterface = x = null
  }; this.refreshTime = function (a, b, c) { a = a.toString(); b = b.toString(); c = c.toString(); a = this.checkIfAddZero(a); b = this.checkIfAddZero(b); c = this.checkIfAddZero(c); J.refresh(a + ':' + b + ':' + c) }; this.checkIfAddZero = function (a) { var b = a; b.length < 2 && (b = '0' + a); return b }; this._onExit = function () { H = new CAreYouSurePanel(s_oStage); H.show() }; this.unloadAreYouSure = function () { H.unload(); H = null }; this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive); s_bAudioActive =
!s_bAudioActive
  }; this.resetFullscreenBut = function () { E && screenfull.enabled && G.setActive(s_bFullscreen) }; this._onFullscreenRelease = function () { s_bFullscreen ? M.call(window.document) : E.call(window.document.documentElement); sizeHandler() }; s_oInterface = this; this._init(); return this
} var s_oInterface = null
function CCreditsPanel () {
  var a, b, c, e, d, f, g, h, l; this._init = function () {
    h = new createjs.Container(); s_oStage.addChild(h); var k = s_oSpriteLibrary.getSprite('msg_box'); f = new createjs.Shape(); f.graphics.beginFill('#000').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); f.alpha = 0.5; l = f.on('click', this._onLogoButRelease); f.cursor = 'pointer'; h.addChild(f); b = createBitmap(k); b.x = CANVAS_WIDTH_HALF; b.y = CANVAS_HEIGHT_HALF; b.regX = 0.5 * k.width; b.regY = 0.5 * k.height; h.addChild(b); k = s_oSpriteLibrary.getSprite('but_not'); a = 0.5 * CANVAS_WIDTH +
210; e = new CGfxButton(a, 330, k, h); e.setScale(0.4); e.addEventListener(ON_MOUSE_UP, this.unload, this); d = new createjs.Text(TEXT_CREDITS_DEVELOPED, '42px ' + PRIMARY_FONT, TEXT_COLOR); d.textAlign = 'center'; d.textBaseline = 'alphabetic'; d.x = CANVAS_WIDTH_HALF; d.y = 400; h.addChild(d); k = s_oSpriteLibrary.getSprite('logo_ctl'); c = createBitmap(k); c.regX = k.width / 2; c.regY = k.height / 2; c.x = CANVAS_WIDTH_HALF; c.y = d.y + 80; h.addChild(c); g = new createjs.Text('www.codethislab.com', '40px ' + PRIMARY_FONT, TEXT_COLOR); g.textAlign = 'center'
    g.textBaseline = 'alphabetic'; g.x = CANVAS_WIDTH_HALF; g.y = d.y + 180; h.addChild(g)
  }; this.unload = function () { f.off('click', l); e.unload(); e = null; playSound('click', 1, !1); s_oStage.removeChild(h) }; this._onLogoButRelease = function () { window.open('http://www.codethislab.com/index.php?&l=en', '_blank') }; this._init()
}
function CEndPanel (a) {
  var b, c, e, d, f, g, h, l; this._init = function (a) {
    l = new createjs.Shape(); l.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); l.alpha = 0; s_oStage.addChild(l); d = new createjs.Container(); d.alpha = 1; d.visible = !1; d.y = CANVAS_HEIGHT; b = createBitmap(a); b.x = CANVAS_WIDTH_HALF; b.y = CANVAS_HEIGHT_HALF; b.regX = 0.5 * a.width; b.regY = 0.5 * a.height; d.addChild(b); c = new CTLText(d, CANVAS_WIDTH / 2 - 240, CANVAS_HEIGHT_HALF - 180, 480, 50, 50, 'center', '#fff', PRIMARY_FONT, 1, 0, 0, ' ', !0, !0, !1, !1); e = new CTLText(d,
      CANVAS_WIDTH / 2 - 240, CANVAS_HEIGHT_HALF - 70, 480, 46, 46, 'center', '#fff', PRIMARY_FONT, 1, 0, 0, ' ', !0, !0, !1, !1); a = s_oSpriteLibrary.getSprite('but_restart'); g = new CGfxButton(0.5 * CANVAS_WIDTH - 180, 0.5 * CANVAS_HEIGHT + 110, a, d); g.addEventListener(ON_MOUSE_DOWN, this._onRestart, this); g.pulseAnimation(); a = s_oSpriteLibrary.getSprite('but_home'); f = new CGfxButton(0.5 * CANVAS_WIDTH + 180, 0.5 * CANVAS_HEIGHT + 110, a, d); f.addEventListener(ON_MOUSE_DOWN, this._onExit, this); a = s_oSpriteLibrary.getSprite('but_continue'); h = new CGfxButton(0.5 *
CANVAS_WIDTH, 0.5 * CANVAS_HEIGHT + 110, a, d); h.addEventListener(ON_MOUSE_DOWN, this._onContinue, this); s_oStage.addChild(d)
  }; this.unload = function () { f && (f.unload(), f = null); g && (g.unload(), g = null); l.removeAllEventListeners(); s_oStage.removeChild(d, l) }; this.show = function (a) {
    c.refreshText(TEXT_WIN); e.refreshText(TEXT_TOTAL_SCORE + ': ' + a); d.visible = !0; createjs.Tween.get(l).to({ alpha: 0.5 }, 500, createjs.Ease.cubicOut); createjs.Tween.get(d).wait(250).to({ y: 0 }, 1250, createjs.Ease.bounceOut).call(function () {
      s_oAdsLevel ===
NUM_LEVELS_FOR_ADS ? ($(s_oMain).trigger('show_interlevel_ad'), s_oAdsLevel = 1) : s_oAdsLevel++
    }); $(s_oMain).trigger('save_score', a); $(s_oMain).trigger('share_event', a)
  }; this._onContinue = function () { this.createFade(this.onUnloadContinue) }; this.createFade = function (a) {
    var b = new createjs.Shape(); b.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); b.alpha = 0; s_oStage.addChild(b); var c = this; createjs.Tween.get(b).to({ alpha: 1 }, 750, createjs.Ease.cubicOut).call(function () {
      s_oStage.removeChild(b)
      a(c)
    })
  }; this._onRestart = function () { this.createFade(this.onUnloadRestart) }; this.onUnloadRestart = function (a) { a.unload(); s_oGame.restartLevel() }; this.onUnloadContinue = function (a) { a.unload(); s_oGame.unload(); s_oMain.gotoLevelMenu(); $(s_oMain).trigger('end_level', 1); $(s_oMain).trigger('end_session'); $(s_oMain).trigger('show_interlevel_ad'); setVolume('soundtrack', 1) }; this.onUnloadExit = function (a) { a.unload(); s_oGame.onExit() }; this._onExit = function () { this.createFade(this.onUnloadExit) }; this._init(a); return this
}
var NUM_ROWS_PAGE_LEVEL = 5; var NUM_COLS_PAGE_LEVEL = 2
function CLevelMenu () {
  var a; var b; var c; var e; var d; var f; var g; var h; var l; var k; var n; var p; var m; var x; var u; var r; var z; var v = null; var A = null; var t; var D; var J; var K; var I = null; var H = null; this._init = function () {
    n = 0; t = new createjs.Container(); s_oStage.addChild(t); var m = createBitmap(s_oSpriteLibrary.getSprite('bg_game')); t.addChild(m); m = s_oSpriteLibrary.getSprite('logo_small'); J = new CLogo(0.5 * m.width + 15, 0.5 * m.height + 15, m, s_oStage); new CTLText(s_oStage, CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT_HALF - 270, 500, 70, 70, 'center', TEXT_COLOR_2, PRIMARY_FONT, 1, 0, 0, TEXT_SELECT_CATEGORY, !0, !0, !1, !1); m = s_oSpriteLibrary.getSprite('but_exit')
    l = CANVAS_WIDTH - m.height / 2 - 15; k = m.height / 2 + 15; r = new CGfxButton(l, k, m, s_oStage); r.addEventListener(ON_MOUSE_UP, this._onExit, this); p = m.height; !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (g = r.getX() - m.width - 15, h = m.height / 2 + 15, z = new CToggle(g, h, s_oSpriteLibrary.getSprite('icon_audio'), s_bAudioActive, s_oStage), z.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this), m = s_oSpriteLibrary.getSprite('but_fullscreen'), a = g - m.width / 2 - 10) : (m = s_oSpriteLibrary.getSprite('but_fullscreen'), a = r.getX() - m.width / 2 - 15); b =
m.height / 2 + 15; var G = window.document; var E = G.documentElement; I = E.requestFullscreen || E.mozRequestFullScreen || E.webkitRequestFullScreen || E.msRequestFullscreen; H = G.exitFullscreen || G.mozCancelFullScreen || G.webkitExitFullscreen || G.msExitFullscreen; !1 === ENABLE_FULLSCREEN && (I = !1); I && screenfull.enabled && (K = new CToggle(a, b, m, s_bFullscreen, s_oStage), K.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)); this._checkBoundLimits(); x = []; m = Math.floor((CANVAS_WIDTH + 2 * EDGEBOARD_X) / NUM_COLS_PAGE_LEVEL) / 2; for (E =
G = 0; E < NUM_COLS_PAGE_LEVEL; E++)x.push(G), G += 2 * m; u = []; this._createNewLevelPage(0, s_aJSONWords.categories.length); if (u.length > 1) { for (m = 1; m < u.length; m++)u[m].visible = !1; d = CANVAS_WIDTH - 80; f = CANVAS_HEIGHT - 80; v = new CGfxButton(d, f, s_oSpriteLibrary.getSprite('arrow_right'), s_oStage); v.addEventListener(ON_MOUSE_UP, this._onRight, this); c = 80; e = CANVAS_HEIGHT - 80; A = new CGfxButton(c, e, s_oSpriteLibrary.getSprite('arrow_left'), s_oStage); A.addEventListener(ON_MOUSE_UP, this._onLeft, this) }D = new createjs.Shape(); D.graphics.beginFill('black').drawRect(0,
      0, CANVAS_WIDTH, CANVAS_HEIGHT); s_oStage.addChild(D); createjs.Tween.get(D).to({ alpha: 0 }, 1E3).call(function () { s_oStage.removeChild(D); D = null }); this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  }; this.unload = function () { for (var a = 0; a < m.length; a++)m[a].unload(); if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)z.unload(), z = null; I && screenfull.enabled && K.unload(); r.unload(); r = null; A !== null && (A.unload(), v.unload()); s_oLevelMenu = null; s_oStage.removeAllChildren() }; this.refreshButtonPos = function (m, n) {
    r.setPosition(l - m,
      k + n); !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || z.setPosition(g - m, n + h); I && screenfull.enabled && K.setPosition(a - m, b + n); A !== null && (v.setPosition(d - m, f - n), A.setPosition(c + m, e - n)); var t = J.getStartPos(); J.setPosition(t.x + m, t.y + n)
  }; this._checkBoundLimits = function () {
    for (var a = s_oSpriteLibrary.getSprite('but_level'), b = 0, c = CANVAS_HEIGHT - 2 * EDGEBOARD_Y - 2 * p, d = 0; b < c;)b += a.height + 20, d++; NUM_ROWS_PAGE_LEVEL > d && (NUM_ROWS_PAGE_LEVEL = d); c = b = 0; d = CANVAS_WIDTH - 2 * EDGEBOARD_X; for (a = s_oSpriteLibrary.getSprite('but_level'); c <
d;)c += a.width / 2 + 5, b++; NUM_COLS_PAGE_LEVEL > b && (NUM_COLS_PAGE_LEVEL = b)
  }; this._createNewLevelPage = function (a, b) {
    var c = new createjs.Container(); t.addChild(c); u.push(c); m = []; for (var d = 0, e = -200, f = 1, g = !1, h = s_oSpriteLibrary.getSprite('but_level'), k = a; k < b; k++) { var l = new CLevelBut(x[d] + h.width / 2, e + h.height / 2, s_aJSONWords.categories[k].cat_name, h, !0, c); l.addEventListenerWithParams(ON_MOUSE_UP, this._onButLevelRelease, this, k); m.push(l); d++; if (d === x.length && (d = 0, e += h.height + 20, f++, f > NUM_ROWS_PAGE_LEVEL)) { g = !0; break } }c.x =
CANVAS_WIDTH / 2; c.y = 520; c.regX = c.getBounds().width / 2; g && this._createNewLevelPage(k + 1, b)
  }; this._onRight = function () { u[n].visible = !1; n++; n >= u.length && (n = 0); u[n].visible = !0 }; this._onLeft = function () { u[n].visible = !1; n--; n < 0 && (n = u.length - 1); u[n].visible = !0 }; this._onButLevelRelease = function (a) { s_oMain.gotoGame(s_aJSONWords.categories[a]) }; this._onAudioToggle = function () { Howler.mute(s_bAudioActive); s_bAudioActive = !s_bAudioActive }; this._onExit = function () { this.unload(); s_oMain.gotoLanguageMenu() }; this.resetFullscreenBut =
function () { I && screenfull.enabled && K.setActive(s_bFullscreen) }; this._onFullscreenRelease = function () { s_bFullscreen ? H.call(window.document) : I.call(window.document.documentElement); sizeHandler() }; s_oLevelMenu = this; this._init()
} var s_oLevelMenu = null
function CLevelBut (a, b, c, e, d, f) {
  var g; var h; var l; var k = []; var n = []; var p; var m; var x; var u; this._init = function (a, b, c, d, e) { h = []; l = []; m = new createjs.Container(); r.addChild(m); p = createBitmap(d); p.regX = 0.5 * d.width; p.regY = 0.5 * d.height; p.mouseEnabled = e; p.x = a; p.y = b; g = !0; s_bMobile || (m.cursor = 'pointer'); m.addChild(p); k.push(p); new CTLText(m, a - d.width / 2, b - d.height / 2, d.width, d.height, 24, 'center', TEXT_COLOR, PRIMARY_FONT, 1, 0, 0, c, !0, !0, !1, !1); this._initListener() }; this.unload = function () { m.off('mousedown', x); m.off('pressup', u); m.removeChild(p) }
  this._initListener = function () { x = m.on('mousedown', this.buttonDown); u = m.on('pressup', this.buttonRelease) }; this.viewBut = function (a) { m.addChild(a) }; this.addEventListener = function (a, b, c) { h[a] = b; l[a] = c }; this.addEventListenerWithParams = function (a, b, c, d) { h[a] = b; l[a] = c; n = d }; this.ifClickable = function () { return !0 === m.mouseEnabled ? 1 : 0 }; this.setActive = function (a, b) { g = b; k[a].gotoAndStop('state_' + g); k[a].mouseEnabled = !0 }; this.buttonRelease = function () { g && h[ON_MOUSE_UP] && h[ON_MOUSE_UP].call(l[ON_MOUSE_UP], n) }; this.buttonDown =
function () { h[ON_MOUSE_DOWN] && h[ON_MOUSE_DOWN].call(l[ON_MOUSE_DOWN], n) }; this.setPosition = function (a, b) { m.x = a; m.y = b }; this.setVisible = function (a) { m.visible = a }; var r = f; this._init(a, b, c, e, d, f)
}
function CWordCell (a, b, c, e, d, f, g, h) {
  var l; var k; var n; var p; var m; var x = !1; var u; var r = s_aJSONWords.alphabet; var z; var v; var A; this._init = function (a, b, c, e, f, g, h) {
    l = a; k = b; n = g; m = h; u = f; p = null; z = new createjs.Text('', SIZE_TEXT_CELL + 'px ' + SECONDARY_FONT, TEXT_WORD_COLOR); z.x = c; z.y = e + 5; z.textAlign = 'center'; z.textBaseline = 'alphabet'; z.lineWidth = 500; z.scaleX = z.scaleY = n; d.addChild(z); a = s_oSpriteLibrary.getSprite('hit_area_cell'); v = new CGfxButton(c, e, a, d); v.addEventListener(ON_MOUSE_DOWN, this._onCellClicked, this); v.regX = a.width / 2; v.regY = a.height / 2
    d.addChild(v.getButtonImage())
  }; this.isActive = function () { return x }; this.changeCellState = function (a) { (void 0).gotoAndStop('selected_' + a) }; this.getID = function () { return m }; this.changeCellText = function (a) { z.text = a }; this.checkInPlace = function (a) { return z.text === '' || z.text === a ? !0 : !1 }; this.getChar = function () { return z.text }; this.setRecOffset = function (a) { A = new createjs.Rectangle(a.x + v.getX() - 25, a.y + v.getY() - 25, a.x + v.getX() + 5, a.y + v.getY() + 5) }; this.setRandomChar = function (a) { z.text === '' && (z.text = r[a]) }; this._onCellClicked =
function () { s_oGame.onCellSelected(this, l, k) }; this.setActive = function (a) { x = a }; this.getX = function () { return c }; this.getY = function () { return e }; this.getValue = function () { return u }; this.getState = function () { return p }; this.changeTextColor = function (a) { z.color = a }; this.getRotation = function () { return (void 0).rotation }; this.getRow = function () { return l }; this.getCol = function () { return k }; this.getRectPos = function () { return A }; this.unload = function () { v.unload(); v = null; d.removeChild(void 0) }; this._init(a, b, c, e, f, g, h); return this
}
function CPause () {
  var a, b, c, e, d, f; this._init = function () {
    a = new createjs.Container(); a.alpha = 0; b = createBitmap(s_oSpriteLibrary.getSprite('bg_game')); a.addChild(b); var g = s_oSpriteLibrary.getSprite('msg_box'); c = createBitmap(g); c.x = CANVAS_WIDTH_HALF; c.y = CANVAS_HEIGHT_HALF; c.regX = 0.5 * g.width; c.regY = 0.5 * g.height; a.addChild(c); g = s_oSpriteLibrary.getSprite('logo_small'); e = new CLogo(0.5 * g.width + 15, 0.5 * g.height + 15, g, a); f = a.on('click', function () {}); new CTLText(a, CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT_HALF - 160, 500, 70, 70,
      'center', TEXT_COLOR, PRIMARY_FONT, 1, 0, 0, TEXT_PAUSE, !0, !0, !1, !1); s_oStage.addChild(a); g = s_oSpriteLibrary.getSprite('but_continue'); d = new CGfxButton(0.5 * CANVAS_WIDTH, 0.5 * CANVAS_HEIGHT + 70, g, a); d.addEventListener(ON_MOUSE_UP, this._onLeavePause, this); this.onPause(!0); createjs.Tween.get(a).to({ alpha: 1 }, 300, createjs.quartOut).call(function () { createjs.Ticker.paused = !0 }); this.refreshPosLogo(s_iOffsetX, s_iOffsetY)
  }; this.onPause = function (a) { s_oGame.setPause(a) }; this.unload = function () { a.off('click', f); s_oStage.removeChild(a) }
  this.refreshPosLogo = function (a, b) { var c = e.getStartPos(); e.setPosition(c.x + a, c.y + b) }; this._onLeavePause = function () { createjs.Ticker.paused = !1; createjs.Tween.removeTweens(a); var b = this; createjs.Tween.get(a).to({ alpha: 0 }, 300, createjs.quartIn).call(function () { b.onPause(!1); d.unload(); s_oInterface.unloadPause() }) }; this._init(); return this
}
function CLanguageMenu () {
  var a; var b; var c; var e; var d; var f; var g; var h; var l; var k; var n; var p; var m; var x = null; var u = null; this._init = function () {
    p = []; g = createBitmap(s_oSpriteLibrary.getSprite('bg_game')); s_oStage.addChild(g); var r = s_oSpriteLibrary.getSprite('logo_small'); n = new CLogo(0.5 * r.width + 15, 0.5 * r.height + 15, r, s_oStage); new CTLText(s_oStage, CANVAS_WIDTH / 2 - 250, 0.5 * CANVAS_HEIGHT - 280, 500, 65, 65, 'center', TEXT_COLOR_2, PRIMARY_FONT, 1, 0, 0, TEXT_SELECT_LANG, !0, !0, !1, !1); r = 180; for (var z = 194, v = 0; v < NUM_OF_LANGUAGE; v++, r += 285) {
      v % 2 === 0 && (r = 180, z += 162); var A = s_oSpriteLibrary.getSprite('flag_' +
v); p.push(this.createFlagButton(r, z, A, v))
    }r = s_oSpriteLibrary.getSprite('but_exit'); c = CANVAS_WIDTH - r.height / 2 - 15; e = r.height / 2 + 15; k = new CGfxButton(c, e, r, s_oStage); k.addEventListener(ON_MOUSE_UP, this._onExit, this); !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (d = k.getX() - r.width - 15, f = r.height / 2 + 15, l = new CToggle(d, f, s_oSpriteLibrary.getSprite('icon_audio'), s_bAudioActive, s_oStage), l.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this), r = s_oSpriteLibrary.getSprite('but_fullscreen'), a = d - r.width / 2 - 15) : (r =
s_oSpriteLibrary.getSprite('but_fullscreen'), a = c - r.width / 2 - 15); b = r.height / 2 + 15; z = window.document; v = z.documentElement; x = v.requestFullscreen || v.mozRequestFullScreen || v.webkitRequestFullScreen || v.msRequestFullscreen; u = z.exitFullscreen || z.mozCancelFullScreen || z.webkitExitFullscreen || z.msExitFullscreen; !1 === ENABLE_FULLSCREEN && (x = !1); x && screenfull.enabled && (m = new CToggle(a, b, r, s_bFullscreen, s_oStage), m.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)); h = new createjs.Shape(); h.graphics.beginFill('black').drawRect(0,
      0, CANVAS_WIDTH, CANVAS_HEIGHT); s_oStage.addChild(h); createjs.Tween.get(h).to({ alpha: 0 }, 1E3).call(function () { s_oStage.removeChild(h); h = null }); this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  }; this.createFlagButton = function (a, b, c, d) { a = new CGfxButton(a, b, c, s_oStage); a.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, d); return a }; this.unload = function () {
    for (var a = 0; a < NUM_OF_LANGUAGE; a++)p[a].unload(); p = null; if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)l.unload(), l = null; x && screenfull.enabled &&
m.unload(); k.unload(); k = null; s_oStage.removeAllChildren(); s_oLanguageMenu = null
  }; this.refreshButtonPos = function (g, h) { !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || l.setPosition(d - g, f + h); x && screenfull.enabled && m.setPosition(a - g, b + h); k.setPosition(c - g, h + e); var p = n.getStartPos(); n.setPosition(p.x + g, p.y + h) }; this._onAudioToggle = function () { Howler.mute(s_bAudioActive); s_bAudioActive = !s_bAudioActive }; this._onExit = function () { this.unload(); s_oMain.gotoMenu() }; this._onButPlayRelease = function (a) {
    trace('_iLang ' +
a); this.unload(); new window['CLang' + a](); s_oMain.gotoLevelMenu()
  }; this.resetFullscreenBut = function () { x && screenfull.enabled && m.setActive(s_bFullscreen) }; this._onFullscreenRelease = function () { s_bFullscreen ? u.call(window.document) : x.call(window.document.documentElement); sizeHandler() }; s_oLanguageMenu = this; this._init()
} var s_oLanguageMenu = null
function CFailGenerateGrid (a) {
  var b, c, e, d, f; this._init = function (a) {
    f = new createjs.Container(); s_oStage.addChild(f); c = new createjs.Shape(); c.graphics.beginFill('#000').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); c.alpha = 0.5; d = c.on('click', function () {}); c.cursor = 'pointer'; f.addChild(c); b = createBitmap(a); b.x = CANVAS_WIDTH_HALF; b.y = CANVAS_HEIGHT_HALF; b.regX = 0.5 * a.width; b.regY = 0.5 * a.height; f.addChild(b); new CTLText(f, CANVAS_WIDTH / 2 - 240, 330, 480, 120, 28, 'center', '#fff', PRIMARY_FONT, 1, 0, 0, TEXT_FAIL_GENERATION_MATRIX,
      !0, !0, !0, !1); e = new CGfxButton(CANVAS_WIDTH / 2, 0.5 * CANVAS_HEIGHT + 100, s_oSpriteLibrary.getSprite('but_restart'), f); e.addEventListener(ON_MOUSE_UP, this._onPressButRestart, this)
  }; this.unload = function () { c.off('click', d); e.unload(); e = null; playSound('click', 1, !1); s_oStage.removeChild(f) }; this._onPressButRestart = function () { s_oInterface.unloadFailPanel(); s_oGame.restartLevel() }; this._init(a); return this
}
function CTimeBoard (a, b, c) { var e, d, f, g; this._init = function (a, b, c) { e = { x: b, y: c }; d = new createjs.Container(); d.x = e.x; d.y = e.y; f = createBitmap(a); f.x = 0; f.y = 0; f.regX = 0; f.regY = 0; d.addChild(f); s_oStage.addChild(d); g = new CTLText(d, 60, 6, 170, 34, 34, 'left', TEXT_COLOR, PRIMARY_FONT, 1, 0, 0, '00:00:00', !0, !0, !1, !1) }; this.getStartPosition = function () { return e }; this.setPosition = function (a, b) { d.x = a; d.y = b }; this.unload = function () { s_oStage.removeChild(d) }; this.refresh = function (a) { g.refreshText(a) }; this._init(a, b, c); return this }
function CHelpPanel (a) {
  var b; var c; var e; var d; var f; var g = !1; this._init = function (a) { b = createBitmap(a); b.x = 0.5 * CANVAS_WIDTH; b.y = 0.5 * CANVAS_HEIGHT; b.regX = 0.5 * a.width; b.regY = 0.5 * a.height; c = new createjs.Container(); e = new createjs.Shape(); e.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); e.alpha = 0.5; c.addChild(e); c.addChild(b); s_oStage.addChild(c); this.page1(c); c.on('pressup', function () { s_oHelpPanel._onExitHelp() }, null, !0); s_bMobile || (c.cursor = 'pointer') }; this.page1 = function (a) {
    new CTLText(a, CANVAS_WIDTH / 2 - 240,
      0.5 * CANVAS_HEIGHT - 180, 480, 44, 44, 'center', '#fff', PRIMARY_FONT, 1, 0, 0, TEXT_SUMMARY, !0, !0, !1, !1); new CTLText(a, CANVAS_WIDTH / 2 - 240, 0.5 * CANVAS_HEIGHT - 100, 480, 100, 26, 'center', TEXT_COLOR, SECONDARY_FONT, 1, 0, 0, TEXT_HELP, !0, !0, !0, !1); var b = s_oSpriteLibrary.getSprite('img_help'); f = createBitmap(b); f.x = CANVAS_WIDTH_HALF - 100; f.y = CANVAS_HEIGHT_HALF + 108; f.regX = 0.5 * b.width; f.regY = 0.5 * b.height; a.addChild(f); createjs.Tween.get(a).to({ alpha: 1 }, 300, createjs.Ease.cubicOut); b = s_oSpriteLibrary.getSprite('but_continue'); d = new CGfxButton(0.5 *
CANVAS_WIDTH + 180, 0.5 * CANVAS_HEIGHT + 110, b, a); d.addEventListener(ON_MOUSE_UP, this._onExitHelp, this); d.pulseAnimation(); s_oStage.addChild(a)
  }; this.unload = function () { s_oStage.removeChild(c); s_oHelpPanel = null; d.unload(); d = null }; this._onExitHelp = function () { g || (c.removeAllEventListeners(), g = !0, createjs.Tween.get(c).to({ alpha: 0 }, 300, createjs.Ease.cubicOut).call(function () { s_oGame._onExitHelp() })) }; s_oHelpPanel = this; this._init(a)
} var s_oHelpPanel = null
function CLogo (a, b, c, e) { var d, f; this._init = function (a, b, c) { d = { x: a, y: b }; f = createBitmap(c); f.x = d.x; f.y = d.y; f.regX = 0.5 * c.width; f.regY = 0.5 * c.height; g.addChild(f) }; this.setPosition = function (a, b) { f.x = a; f.y = b }; this.getStartPos = function () { return d }; this.unload = function () { g.removeChild(f) }; var g = e; this._init(a, b, c); return this }
function placeWordsLeft (a, b, c, e) { var d = []; var f = 0; var g = 0; var h = !1; var l = c - a.length; if (l < 0) return { success: !1 }; for (;c > l; c--) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(f) === e[b][c].getChar()) { var k = ''; a.charAt(f) !== e[b][c].getChar() ? g++ : k = e[b][c].getChar(); d.push({ r: b, c: c, 'char': a.charAt(f), char_compare: k }); f++; a.length === f && (h = !0) } else return { success: !1 }; else return { success: !1 }; return { list_cell: d, weight: g, success: h } }
function placeWordsRight (a, b, c, e, d) { var f = []; var g = 0; var h = 0; var l = !1; var k = c + a.length; if (k > d) return { success: !1 }; for (;c < k; c++) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(g) === e[b][c].getChar())d = '', a.charAt(g) !== e[b][c].getChar() ? h++ : d = e[b][c].getChar(), f.push({ r: b, c: c, 'char': a.charAt(g), char_compare: d }), g++, a.length === g && (l = !0); else return { success: !1 }; else return { success: !1 }; return { list_cell: f, weight: h, success: l } }
function placeWordsUp (a, b, c, e) { var d = []; var f = 0; var g = 0; var h = !1; var l = b - a.length; if (l < 0) return { success: !1 }; for (;b > l; b--) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(f) === e[b][c].getChar()) { var k = ''; a.charAt(f) !== e[b][c].getChar() ? g++ : k = e[b][c].getChar(); d.push({ r: b, c: c, 'char': a.charAt(f), char_compare: k }); f++; a.length === f && (h = !0) } else return { success: !1 }; else return { success: !1 }; return { list_cell: d, weight: g, success: h } }
function placeWordsDown (a, b, c, e, d) { var f = []; var g = 0; var h = 0; var l = !1; var k = b + a.length; if (k > d) return { success: !1 }; for (;b < k; b++) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(g) === e[b][c].getChar())d = '', a.charAt(g) !== e[b][c].getChar() ? h++ : d = e[b][c].getChar(), f.push({ r: b, c: c, 'char': a.charAt(g), char_compare: d }), g++, a.length === g && (l = !0); else return { success: !1 }; else return { success: !1 }; return { list_cell: f, weight: h, success: l } }
function placeWordsUpLeft (a, b, c, e) { var d = []; var f = 0; var g = 0; var h = !1; var l = b - a.length; var k = c - a.length; if (l < 0 && k < 0) return { success: !1 }; for (;b > l; b--) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(f) === e[b][c].getChar())k = '', a.charAt(f) !== e[b][c].getChar() ? g++ : k = e[b][c].getChar(), d.push({ r: b, c: c, 'char': a.charAt(f), char_compare: k }), f++, c--, a.length === f && (h = !0); else return { success: !1 }; else return { success: !1 }; return { list_cell: d, weight: g, success: h } }
function placeWordsUpRight (a, b, c, e, d) { var f = []; var g = 0; var h = 0; var l = !1; var k = b - a.length; var n = c + a.length; if (k < 0 && n > d) return { success: !1 }; for (;b > k; b--) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(g) === e[b][c].getChar())d = '', a.charAt(g) !== e[b][c].getChar() ? h++ : d = e[b][c].getChar(), f.push({ r: b, c: c, 'char': a.charAt(g), char_compare: d }), g++, c++, a.length === g && (l = !0); else return { success: !1 }; else return { success: !1 }; return { list_cell: f, weight: h, success: l } }
function placeWordsDownLeft (a, b, c, e, d) { var f = []; var g = 0; var h = 0; var l = !1; var k = b + a.length; var n = c - a.length; if (k > d && n < 0) return { success: !1 }; for (;b < k; b++) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(g) === e[b][c].getChar())d = '', a.charAt(g) !== e[b][c].getChar() ? h++ : d = e[b][c].getChar(), f.push({ r: b, c: c, 'char': a.charAt(g), char_compare: d }), g++, c--, a.length === g && (l = !0); else return { success: !1 }; else return { success: !1 }; return { list_cell: f, weight: h, success: l } }
function placeWordsDownRight (a, b, c, e, d, f) { var g = []; var h = 0; var l = 0; var k = !1; var n = b + a.length; var p = c + a.length; if (n > d && p > f) return { success: !1 }; for (;b < n; b++) if (void 0 !== e[b] && void 0 !== e[b][c]) if (e[b][c].getChar() === '' || a.charAt(h) === e[b][c].getChar())d = '', a.charAt(h) !== e[b][c].getChar() ? l++ : d = e[b][c].getChar(), g.push({ r: b, c: c, 'char': a.charAt(h), char_compare: d }), h++, c++, a.length === h && (k = !0); else return { success: !1 }; else return { success: !1 }; return { list_cell: g, weight: l, success: k } }
CTLText.prototype = { constructor: CTLText,
  __autofit: function () { if (this._bFitText) { for (var a = this._iFontSize; (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(a--, this._oText.font = a + 'px ' + this._szFont, this._oText.lineHeight = Math.round(a * this._fLineHeightFactor), this.__updateY(), this.__verticalAlign(), a < 8););this._iFontSize = a } },
  __verticalAlign: function () {
    if (this._bVerticalAlign) {
      var a = this._oText.getBounds().height; this._oText.y -=
(a - this._iHeight) / 2 + this._iPaddingV
    }
  },
  __updateY: function () { this._oText.y = this._y + this._iPaddingV; switch (this._oText.textBaseline) { case 'middle':this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize) } },
  __createText: function (a) {
    this._bDebug && (this._oDebugShape = new createjs.Shape(), this._oDebugShape.graphics.beginFill('rgba(255,0,0,0.5)').drawRect(this._x, this._y, this._iWidth, this._iHeight), this._oContainer.addChild(this._oDebugShape)); this._oText = new createjs.Text(a,
      this._iFontSize + 'px ' + this._szFont, this._szColor); this._oText.textBaseline = 'middle'; this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor); this._oText.textAlign = this._szAlign; this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null; switch (this._szAlign) { case 'center':this._oText.x = this._x + this._iWidth / 2; break; case 'left':this._oText.x = this._x + this._iPaddingH; break; case 'right':this._oText.x = this._x + this._iWidth - this._iPaddingH } this._oContainer.addChild(this._oText)
    this.refreshText(a)
  },
  setVerticalAlign: function (a) { this._bVerticalAlign = a },
  setOutline: function (a) { this._oText !== null && (this._oText.outline = a) },
  setShadow: function (a, b, c, e) { this._oText !== null && (this._oText.shadow = new createjs.Shadow(a, b, c, e)) },
  setColor: function (a) { this._oText.color = a },
  setAlpha: function (a) { this._oText.alpha = a },
  setY: function (a) { this._oText.y = a },
  removeTweens: function () { createjs.Tween.removeTweens(this._oText) },
  getText: function () { return this._oText },
  getY: function () { return this._y },
  getFontSize: function () { return this._iFontSize },
  refreshText: function (a) { a === '' && (a = ' '); this._oText === null && this.__createText(a); this._oText.text = a; this._oText.font = this._iFontSize + 'px ' + this._szFont; this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor); this.__autofit(); this.__updateY(); this.__verticalAlign() } }
function CTLText (a, b, c, e, d, f, g, h, l, k, n, p, m, x, u, r, z) { this._oContainer = a; this._x = b; this._y = c; this._iWidth = e; this._iHeight = d; this._bMultiline = r; this._iFontSize = f; this._szAlign = g; this._szColor = h; this._szFont = l; this._iPaddingH = n; this._iPaddingV = p; this._bVerticalAlign = u; this._bFitText = x; this._bDebug = z; this._oDebugShape = null; this._fLineHeightFactor = k; this._oText = null; m && this.__createText(m) }
function CLang0 () {
  s_aJSONWords = { alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    categories: [{ cat_name: 'Fruits', words: 'mandarin plantain apricot avocado berries banana tomato citrus durian lychee papaya guava kiwi lime pear pome'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Vegetables', words: 'broccoli celeriac cucumber arugula parsnip shallot potato capers chives fennel ginger pepper pickle sorrel turnip'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Computer',
      words: 'processor document download homepage internet monitor restore webpage select column header online output server cells zip'.split(' '),
      rows: 10,
      cols: 10 }, { cat_name: 'Music', words: 'classical accordion saxophone composer baritone trombone modulate staccato accent lyrics melody rhythm banjo cello viola bass'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Countries', words: 'argentina guatemala tunisia vietnam turkey canada france haiti libya italy japan spain africa romania portugal togo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Animals',
      words: 'alligator kangaroo rabbit spider eagle camel shark snake zebra bird goat seal deer rat dog ant fox'.split(' '),
      rows: 10,
      cols: 10 }] }
}
function CLang1 () {
  s_aJSONWords = { alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    categories: [{ cat_name: 'Fruit', words: 'mandarin plantain abricot avocat baies banane tomate citrus durian litchi papaye goyave kiwi lime poire pome'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Vegetables', words: 'brocoli poireau concombre roquette panais oignon salade capres civette fenouil gingembre poivre cornichon oseille navet'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Computer',
      words: 'cpu document download homepage internet monitor restore webpage choisir column header online output server cellules zip'.split(' '),
      rows: 10,
      cols: 10 }, { cat_name: 'Musique', words: 'classique accordeon saxophone composer baryton trombone moduler staccato accent paroles chant rythme banjo cello violet basse'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Patrie', words: 'argentina tunisia vietnam turquie canada france haiti libye italie japon espagne afrique roumanie portugal togo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Animaux',
      words: 'alligator kangourou lapin araignee aigle chameau requin serpent z\u00e8bre oiseau chevre sceau cerf rat chien fourmi renard'.split(' '),
      rows: 10,
      cols: 10 }] }
}
function CLang2 () {
  s_aJSONWords = { alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    categories: [{ cat_name: 'Frucht', words: 'mandarine wegerich aprikose avocado beeren banane tomate zitrus durian litschi papaya guave kiwi kalk birne samen'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Pflanze', words: 'brokkoli sellerie gurke steckrube rucola pastinake schalotten kartoffel kapern knoblauch fenchel ingwer pfeffer gurke fuchs rube'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Computer',
      words: 'cpu dokument download homepage internet monitor restore webseite wahlen spalte header online ausgang server zellen zip'.split(' '),
      rows: 10,
      cols: 10 }, { cat_name: 'Musik', words: 'klassisch akkordeon saxophon komponist bariton posaune staccato akzent text melodie rhythmus banjo cello viola bass'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Staat', words: 'germania guatemala tunesien vietnam pute kanada haiti libyen italien japan spanien afrika rumanien portugal togo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Tiere',
      words: 'alligator kanguru kaninchen spinne adler kamel hai schlange zebra vogel ziege siegel hirsche ratte hund ameise fuchs'.split(' '),
      rows: 10,
      cols: 10 }] }
}
function CLang3 () {
  s_aJSONWords = { alphabet: 'abcdefghijklmnopqrstuvwyz'.split(''),
    categories: [{ cat_name: 'Frutti', words: 'mandarino pesca albicocca avocado bacca banana pomodoro agrumi durian litchi papaya guava kiwi lime pera'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Vegetali', words: 'broccoli porro cetriolo rapa rucola pastinaca scalogno patata capperi cipolla finocchio zenzero pepe salamoia acetosa'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Computer',
      words: 'cpu documento download homepage internet monitor restore webpage selezione colonna header online output server celle zip'.split(' '),
      rows: 10,
      cols: 10 }, { cat_name: 'Musica', words: 'classico accordi sassofono composer baritono trombone modulare staccato tono testo melodia ritmo banjo chitarra viola basso'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Paesi', words: 'argentina guatemala tunisia vietnam turchia canada francia haiti libia italia giappone spagna africa romania portogallo togo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Animali',
      words: 'alligatore canguro coniglio ragno aquila cammello squalo serpente zebra uccello capra foca cervo topo cane formica volpe'.split(' '),
      rows: 10,
      cols: 10 }] }
}
function CLang4 () {
  s_aJSONWords = { alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    categories: [{ cat_name: 'Fruta', words: 'tangerina banana damasco abacate frutos banana tomate citrus durian lichia papaya goiaba kiwi cal pera pome'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Vegetais', words: 'brocolis aipo pepino nabo r\u00facula parsnip cebola batata alcaparras cebolinha funcho ginger pimenta picles azeda cole'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Computador',
      words: 'cpu documento download homepage internet monitor restore web selecionar coluna header online output server celulas zip'.split(' '),
      rows: 10,
      cols: 10 }, { cat_name: 'Musica', words: 'classica acordeao saxofone compositor baritono trombone modular staccato sotaque letras melodia ritmo banjo cello viola bass'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Pa\u00edses', words: 'argentina guatemala tunisia vietnam turkey canada fran\u00e7a haiti l\u00edbia italia japao espanha africa romenia portugal togo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Animais',
      words: 'jacare canguru coelho spider aguia camelo tubarao cobra zebra passaro cabra selo veado rato cao formiga fox'.split(' '),
      rows: 10,
      cols: 10 }] }
}
function CLang5 () {
  s_aJSONWords = { alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    categories: [{ cat_name: 'Fruta', words: 'mandarina platano melo aguacate bayas banana tomate c\u00edtricos durian lichi papaya guayaba kiwi limonero pera pepita'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Vegetales', words: 'brocoli apio pepino nabo r\u00facula pastinaca chalota papa alcaparras cebollino hinojo jengibre pimienta salmuera acedera nabo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Computadora',
      words: 'cpu documento descarga homepage internet monitor restore webpage elegir columna header online output server celda zip'.split(' '),
      rows: 10,
      cols: 10 }, { cat_name: 'Musica', words: 'clasica acordeon saxofon compositor baritono trombon modular staccato acento letras melodia ritmo banjo cello viola bajos'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Paises', words: 'argentina guatemala tunez vietnam pavo canada francia haiti libia italia japon espana africa rumania portugal togo'.split(' '), rows: 10, cols: 10 }, { cat_name: 'Animales',
      words: 'cocodrilo canguro conejo arana aguila camello tiburon serpiente cebra ave cabra sello ciervo rata can hormiga zorro'.split(' '),
      rows: 10,
      cols: 10 }] }
};
