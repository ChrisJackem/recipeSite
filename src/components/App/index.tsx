import { 
  BrowserRouter,
  Routes,
  Route, 
} from 'react-router-dom';
import './app.css'

// Navigation
import Navigation from '../Navigation';
import * as ROUTES from '../../_constants/routes';
import LandingPage from '../Landing';

function App() {  

  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
