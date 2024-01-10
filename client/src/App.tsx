import './App.css';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Home from './components/Home';
import NotFound from './components/NotFound';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
            <Header/>
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
