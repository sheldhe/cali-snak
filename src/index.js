import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store/index.js';
import './styles/reset.scss';
import './styles/common.scss';
import './styles/variables.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<Router />);
export let persistor = persistStore(store);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router />
    </PersistGate>
  </Provider>,
);
