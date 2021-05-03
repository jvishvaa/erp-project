function FullScreenConstructor(fullscreenchangeCallback, fullscreenerrorCallback) {
  this.fullscreenEnabled = document.fullscreenEnabled;
  this.requestFullscreen = function () {
    if (document.fullscreenEnabled) {
      /* supported */
      document.documentElement.requestFullscreen();
    }
  };
  this.exitFullscreen = function () {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
  this.fullscreenActivated = null;
  Object.defineProperties(this, {
    isFullscreenActivated: {
      get() {
        this.fullscreenActivated = Boolean(document.fullscreenElement);
        return this.fullscreenActivated;
      },
    },
    // 'setVal': { set: function(x) { this.a = x / 2; } }
  });

  document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
      // fullscreen is activated
      this.fullscreenActivated = true;
    } else {
      // fullscreen is cancelled
      this.fullscreenActivated = false;
    }
    if (typeof fullscreenchangeCallback === 'function') {
      fullscreenchangeCallback(this.fullscreenActivated, this);
    }
    console.log('fullScreenConstructor', this);
  });
  document.addEventListener('fullscreenerror', (event) => {
    // an error occurred
    this.fullscreenActivated = false;
    if (typeof fullscreenerrorCallback === 'function') {
      fullscreenerrorCallback(event, this);
    }
  });
}
// const fullScreen = FullScreenConstructor()
export { FullScreenConstructor };
/*
  document.addEventListener('fullscreenchange', function (event) {
    if (document.fullscreenElement) {
      // fullscreen is activated
      this.fullscreenActivated = true
    } else {
      // fullscreen is cancelled
      this.fullscreenActivated = false
    }
  })
  document.addEventListener('fullscreenerror', function (event) {
    // an error occurred
    this.fullscreenActivated = false
  })
  */
