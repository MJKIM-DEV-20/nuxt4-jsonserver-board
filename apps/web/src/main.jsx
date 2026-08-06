import { PrimeReactProvider } from 'primereact/api'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom';
import {routers} from "./router/router.jsx";
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
        <RouterProvider router={routers} />
    <App/>
    </PrimeReactProvider>
  </StrictMode>,
)
