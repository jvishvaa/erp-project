class Socket {
  constructor(url) {
    this.url = url;
    this.connect();
    // this.connection = new WebSocket(url);

    this.callbacks = {};
    this.bind = this.bind.bind(this);
    this.trigger = this.trigger.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.doNotReConnectOnFailure = false;

    // this.connection.onmessage = (evt) => {
    //   const json = JSON.parse(evt.data);
    //   this.dispatch(json.event, json.data);
    // };

    // this.connection.onclose = (data) => {
    //   this.dispatch('close', data);
    // };
    // this.connection.onopen = () => {
    //   this.dispatch('open', null);
    // };
    // this.connection.onerror = (data) => {
    //   this.dispatch('error', data);
    // };
  }

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    if (!this.connection || this.connection.readyState === window.WebSocket.CLOSED) {
      this.connect(); // check if websocket instance is closed, if so call `connect` function.
    } else {
      // debugger;
      console.log('mk');
    }
  };

  timeout = 250;

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = () => {
    const that = this; // cache the this
    let connectInterval;
    this.connection = new WebSocket(this.url);
    // websocket onopen event listener
    this.connection.onopen = () => {
      console.log('connected websocket main component');
      this.doNotReConnectOnFailure = false;
      this.dispatch('open', null);
      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };
    this.connection.onmessage = (evt) => {
      const json = JSON.parse(evt.data);
      this.dispatch(json.event, json.data);
    };

    this.connection.onclose = (data) => {
      this.dispatch('close', data);
      const { doNotReConnectOnFailure } = this;
      if (!doNotReConnectOnFailure) {
        console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
            10000 / 1000,
            (that.timeout + that.timeout) / 1000
          )} second.`,
          data.reason
        );
        that.timeout += that.timeout; // increment retry interval
        connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); // call check function after timeout
      }
    };
    this.connection.onerror = (data) => {
      this.doNotReConnectOnFailure = false;
      this.dispatch('error', data);
      this.connection.close();
    };
  };

  //  To bind the event handler
  bind(eventName, callback) {
    this.callbacks[eventName] = this.callbacks[eventName] || [];
    this.callbacks[eventName].push(callback);
    // making it chainable
    return this;
  }

  // To send data
  trigger(eventName, eventData) {
    // const payload = JSON.stringify({ event: eventName, data: eventData });
    const payload = JSON.stringify(eventData);
    this.connection.send(payload);
    return this;
  }

  close() {
    this.connection.close();
  }

  dispatch(eventName, message) {
    const chain = this.callbacks[eventName];
    if (typeof chain === 'undefined') return; // no callbacks for this event
    for (let i = 0; i < chain.length; i += 1) {
      chain[i](message);
    }
  }
}

export default Socket;
