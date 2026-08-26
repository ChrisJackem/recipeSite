
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './components/App/index.tsx'

import FirebaseProvider from './components/Firebase/firebaseProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>

)
