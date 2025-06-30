import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {provider} from 'react-redux'
import store from './store/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <provider store = {store}>
        <RouterProvider router = {router} />
    </provider>
  </StrictMode>,
)
