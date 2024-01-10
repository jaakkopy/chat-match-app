import './App.css';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import { AuthProvider } from './components/auth-provider';
import Home from './components/home';
import NotFound from './components/not-found';
import LoginPage from './components/login-page';
import RegisterPage from './components/register-page';

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
