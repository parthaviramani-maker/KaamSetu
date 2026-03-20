import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store';
import './styles/main.scss';
import App from './App.jsx';
<<<<<<< HEAD
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import PageLoader    from './components/PageLoader/PageLoader';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<PageLoader />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
=======

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
  </StrictMode>
);
