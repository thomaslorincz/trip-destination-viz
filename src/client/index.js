import 'core-js';
import 'regenerator-runtime/runtime';
import AppModel from './app/App.model';
import AppPresenter from './app/App.presenter';
import './style.css';

// Register a service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Needed for Hot Module Replacement
if (typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}

// Initiate the app
new AppPresenter(new AppModel(), null);
