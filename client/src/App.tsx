import './App.css';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import { AuthProvider } from './components/auth-provider';
import Home from './components/home';
import NotFound from './components/not-found';

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
