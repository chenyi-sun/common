function setupWebViewJavascriptBridge (callback) {
  console.log('setupWebViewJavascriptBridge');
  let bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
  if (bridge) { return callback(bridge)}
  let callbacks = window.WVJBCallbacks || window.WKWVJBCallbacks
  if (callbacks) { return callbacks.push(callback) }
  window.WVJBCallbacks = window.WKWVJBCallbacks = [callback]
  if (window.WKWebViewJavascriptBridge) {
    //for https://github.com/Lision/WKWebViewJavascriptBridge
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
  } else {
    //for https://github.com/marcuswestin/WebViewJavascriptBridge
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
  }
}

/*const BridgeMixin = {
  methods: {
    setupWebViewJavascriptBridge (callback) {
      console.log('setupWebViewJavascriptBridge');
      let bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
      if (bridge) { return callback(bridge)}
      let callbacks = window.WVJBCallbacks || window.WKWVJBCallbacks
      if (callbacks) { return callbacks.push(callback) }
      window.WVJBCallbacks = window.WKWVJBCallbacks = [callback]
      if (window.WKWebViewJavascriptBridge) {
        //for https://github.com/Lision/WKWebViewJavascriptBridge
        window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
      } else {
        //for https://github.com/marcuswestin/WebViewJavascriptBridge
        let WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
      }
    }
  }
};

export {
  BridgeMixin
}*/

export default {
  callhandler (name, data, callback) {
  setupWebViewJavascriptBridge(function (bridge) {

    bridge.callHandler(name, data, callback)
  })
},
registerhandler (name, callback) {
  setupWebViewJavascriptBridge(function (bridge) {
    bridge.registerHandler(name, function (data, responseCallback) {
      callback(data, responseCallback)
    })
  })
}
}
