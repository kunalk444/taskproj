import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./reduxfolder/store.ts"
import { GoogleOAuthProvider } from '@react-oauth/google'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='425264817728-9dcfmdg2hhqqlnf2smien6nm9bd4rr5t.apps.googleusercontent.com'>
      <Provider store={store}>
        <BrowserRouter>
         <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
