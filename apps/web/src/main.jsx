import { PrimeReactProvider } from 'primereact/api'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './styles.css'
import { BrowserRouter} from "react-router-dom";
import AppHeader from "./components/AppHeader.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
            <PrimeReactProvider>
                <AppHeader/>
                 <App/>
            </PrimeReactProvider>
      </BrowserRouter>
  </StrictMode>
)
