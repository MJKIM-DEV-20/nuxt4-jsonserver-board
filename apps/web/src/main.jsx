import { PrimeReactProvider } from 'primereact/api'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider,Routes } from 'react-router-dom';


import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './styles.css'

createRoot(document.getElementById('app')).render(
  <StrictMode>
      {/*<RouterProvider router={router} />*/}
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
