import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ToastProvider } from './contexts/useToast';
import App from './App';


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <IonApp>
    <ToastProvider>
        <IonReactRouter>
          <App />
        </IonReactRouter>
      </ToastProvider>
    </IonApp>
  </React.StrictMode>
);
