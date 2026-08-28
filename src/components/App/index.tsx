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
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {  

  return (
    <div>


      <BrowserRouter>

        

        <Navigation />

        <Routes>
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
          <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.ACCOUNT} element={<LandingPage />} />
          <Route path={ROUTES.ADMIN} element={<LandingPage />} />
          <Route path={ROUTES.PASSWORD_FORGET} element={<LandingPage />} />
        </Routes>

          <ToastContainer 
            position="bottom-left" 
            closeButton={true}
          />
      </BrowserRouter>
    </div>
  )
}

export default App
