import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginProfissional from '../pages/LoginProfissional';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-profissional" element={<LoginProfissional />} />
      
      </Routes>
    </BrowserRouter>
  );
}
