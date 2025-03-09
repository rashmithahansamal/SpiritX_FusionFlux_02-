import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminHome from './Pages/Admin/AdminHome';
import AdminHeader from './Layout/AdminLayout/AdminLayout';  // Import AdminHeader

function App() {
  return (
    <BrowserRouter>
      <AdminHeader />
      <Routes>
        <Route path="/" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
