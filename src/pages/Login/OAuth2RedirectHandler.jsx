import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const tokenError = getUrlParameter('error');
        const profileComplete = getUrlParameter('profileComplete');

        if (token) {
            try {
                // Decode the JWT token to extract user info
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                
                const authData = {
                    token: token,
                    email: decodedPayload.sub,
                    role: decodedPayload.role,
                    userId: decodedPayload.userId,
                    username: decodedPayload.username || '',
                    profileComplete: profileComplete
                };
                
                login(authData);
            } catch (err) {
                console.error('Error decoding OAuth2 token', err);
                setError('Failed to process login. Please try again.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } else if (tokenError) {
            setError(tokenError);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError('Login failed! No token received.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    }, [location, login, navigate]);

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>Redirecting to login...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Logging in with Google...</Typography>
        </Box>
    );
};

export default OAuth2RedirectHandler;
