import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from './Pages/Admin/AdminHome';
import AdminHeader from './Layout/AdminLayout/AdminLayout';  // Import AdminHeader
import PlayerManagement from './Pages/Admin/PlayerManage';
import Login from './Pages/Auth/Login';
import Signup from './Pages/Auth/SignupPage';
import UserHome from './Pages/User/UserHome';
import UserHeader from './Layout/UserLayout/UserLayout';  // Import UserHeader
import Chatbot from './Pages/User/Chatbot';
import Tournement from './Pages/Admin/Tournement';
import PlayerDetails from './Pages/User/PlayerDetails';
import CreateTeam from './Pages/User/CreateTeam';
import Leaderboard from './Pages/User/LeaderBoard';


function App() {


  const role = localStorage.getItem('role');
  if (role === "admin") {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<AdminHeader />}>
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/playermanage" element={<PlayerManagement />} />
            <Route path="/tournement" element={<Tournement />} />
            <Route path="*" element={<Navigate to="/adminhome" />} /> {/* Handle unauthorized route */}
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  if (role === "user") {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<UserHeader />}>
            <Route path="/userhome" element={<UserHome />} />
            <Route path="playerdetails" element={<PlayerDetails />} />
            <Route path="/createteam" element={<CreateTeam />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/userhome" />} /> {/* Handle unauthorized route */}
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unauthorized routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
