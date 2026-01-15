import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/pagesStyles/WelcomeScreen.scss'; 
import DottedMap from '../components/DottedMap';
import AuthForm from '../components/AuthForm';
import FeatureSection from '../components/FeatureSection';

const WelcomeScreen: React.FC = () => {
    const { isLoggedIn, login } = useAuth();
    const [isLogin, setIsLogin] = useState<boolean>(true); 

    if (isLoggedIn) return <Navigate to="/map" replace />;

    const handleAuth = (values: any, { setSubmitting }: any) => {
        const usernameToStore = isLogin ? values.email : values.name;
        setTimeout(() => {
            login(usernameToStore); 
            setSubmitting(false);
        }, 1000);
    };

    return (
        <div className='welcome-screen'>
            <div className='map-background'>
                <DottedMap />
            </div>
            <header className='WelcomeScreen-Header'>
                <img src="/logo.png" alt="website logo" />
                <h1>Travel Log</h1>
            </header>
            <main>
            <div className='welcome-container'>
                <div className='auth-card-split'>
                    <div className='form-side'>
                        <div className='auth-header'>
                            <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
                            <p>Welcome {isLogin ? 'back' : ''} to TravelLog</p>
                        </div>

                        <AuthForm isLogin={isLogin} onSubmit={handleAuth} />

                        <div className='auth-footer'>
                            <p>{isLogin ? "Don't have an account?" : "Already a member?"} 
                                <button onClick={() => setIsLogin(!isLogin)} className='toggle-btn'>
                                    {isLogin ? "Sign Up" : "Log In"}
                                </button>
                            </p>
                        </div>
                    </div>

                    <div className='info-side'>
                        <FeatureSection />
                    </div>
                    
                </div>
                
                
            </div>
            </main>
            <footer className='footer-welcomeScreen'>
            <p>©2026 Travel Log. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default WelcomeScreen;