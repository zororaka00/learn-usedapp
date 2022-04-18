import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  DAppProvider,
  Config,
} from '@usedapp/core';

const config: Config = {
  readOnlyChainId: Number(process.env.REACT_APP_CHAIN_ID),
  readOnlyUrls: {
    [process.env.REACT_APP_CHAIN_ID as string]: process.env.REACT_APP_RPC_URL as string,
  },
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
