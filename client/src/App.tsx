import './App.css';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Home from './components/Home';
import NotFound from './components/NotFound';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';
import Matches from './components/Matches';
import { useAuth } from './components/AuthProvider';


const Protected = ({children}: any) => {
    const auth = useAuth();
    
    if (!auth?.isLoggedIn())
        return <Navigate to="/login" replace={true}/>

    return children;
}


function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
            <Header/>
            <Routes>
                <Route index element={ <Protected><Home/></Protected> }/>
                <Route path="/match" element={ <Protected><Matches/></Protected> }/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
