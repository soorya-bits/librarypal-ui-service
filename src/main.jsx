import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-hcpas5cw3qg61iwn.us.auth0.com"
    clientId="QXzfEH73qVI1QRmIfwt8nxBVIbzBjIQD"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
    </Auth0Provider>
)
