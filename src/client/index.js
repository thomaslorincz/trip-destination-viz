import '@babel/polyfill';
import AppModel from './app/App.model';
import AppPresenter from './app/App.presenter';
import './style.css';

// Needed for Hot Module Replacement
if (typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}

// Initiate the app
new AppPresenter(new AppModel(), null);
