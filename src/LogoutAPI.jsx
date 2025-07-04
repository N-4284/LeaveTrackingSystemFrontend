import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutAPI = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('authToken');
        navigate('/login'); 
    }, [navigate]);

    return (
        <>
            Logging out...
        </>
    );
};

export default LogoutAPI;