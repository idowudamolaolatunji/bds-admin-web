import { Outlet, Navigate } from 'react-router-dom'
import DashboardUI from '../components/ui/DashboardUI';
import { useAuthContext } from '../context/AuthContext';


function ProtectedRoute() {
    let { auth, token } = useAuthContext();

    if (!auth && !token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardUI>
            <Outlet />
        </DashboardUI>
    );
}

export default ProtectedRoute;