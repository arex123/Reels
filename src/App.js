import "./styles.css";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Feed from "./Components/Feed";
import PrivateRoute from "./Components/PrivateRoute";
import Profile from "./Components/Profile";

export default function App() {
  return (
    <BrowserRouter>
      {/* <Signup /> */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:id" element={<PrivateRoute> <Profile/> </PrivateRoute> } />
          <Route path="/" element={ <PrivateRoute> <Feed/> </PrivateRoute>} />
          {/* <PrivateRoute path="/" element={<Feed/>} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
