import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/auth/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoutes";

const AppRouter = () => {
    return (
        <Routes>
            {/* {public Routes No login required} */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* {Protected Routes login required} */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    {/* <Route path="/profile" element={<Profile />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/chat/:groupId" element={<Chat />} /> */}
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRouter;