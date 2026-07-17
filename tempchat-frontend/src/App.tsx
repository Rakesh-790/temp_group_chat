import MainLayout from "./components/layout/mainLayout";
import Dashboard from "./pages/auth/dashboard"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import { Routes, Route } from "react-router-dom";

function App() {

  return(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  )
  
}

export default App;
