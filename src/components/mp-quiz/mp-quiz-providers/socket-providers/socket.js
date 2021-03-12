class Socket {
  constructor(url) {
    this.connection = new WebSocket(url);
    this.callbacks = {};
    this.bind = this.bind.bind(this);
    this.trigger = this.trigger.bind(this);
    this.dispatch = this.dispatch.bind(this);

    this.connection.onmessage = (evt) => {
      const json = JSON.parse(evt.data);
      this.dispatch(json.event, json.data);
    };

    this.connection.onclose = () => {
      this.dispatch('close', null);
    };
    this.connection.onopen = () => {
      this.dispatch('open', null);
    };
  }

  //  To bind the event handler
  bind(eventName, callback) {
    this.callbacks[eventName] = this.callbacks[eventName] || [];
    this.callbacks[eventName].push(callback);
    // making it chainable
    return this;
  }

  // To send data
  trigger(eventName, eventData) {
    const payload = JSON.stringify({ event: eventName, data: eventData });
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
