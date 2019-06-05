import 'core-js';
import 'regenerator-runtime/runtime';
// CustomEvent polyfill
(function() {
  if (typeof window.CustomEvent === 'function') return false;
  // eslint-disable-next-line
  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: null};
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
        event, params.bubbles, params.cancelable, params.detail
    );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

import AppModel from './app/App.model';
import AppPresenter from './app/App.presenter';
import './style.css';

// Needed for Hot Module Replacement
if (typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}

// Initiate the app
new AppPresenter(new AppModel(), null);
