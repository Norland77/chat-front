import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {Provider} from "react-redux";
import {setupStore} from "./store/store";
import ContextMenuProvider from "./context/ContextMenu/ContextMenu.provider";

const store = setupStore()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ContextMenuProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ContextMenuProvider>
);