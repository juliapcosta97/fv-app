import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import './styles/globals.css'

// GitHub Pages SPA: restore path from ?p= query param injected by 404.html
;(function () {
  const m = window.location.search.match(/[?&]p=([^&]*)/)
  if (m) {
    const path = decodeURIComponent(m[1].replace(/~and~/g, '&'))
    window.history.replaceState(null, null, path + (window.location.hash || ''))
  }
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
