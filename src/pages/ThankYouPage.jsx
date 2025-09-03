import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYouPage.css';

const ThankYouPage = () => {
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get the full name from localStorage (set during registration)
        const storedFullName = localStorage.getItem('fullName');
        if (storedFullName) {
            setFullName(storedFullName);
        }
    }, []);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="thank-you-container">
            <div className="thank-you-card">
                <div className="baby-image-container">
                    <img 
                        src="/src/assets/oz.jpg" 
                        alt="עוז התינוק" 
                        className="baby-image"
                    />
                </div>
                
                <div className="thank-you-content">
                    <h1 className="thank-you-title">תודה לך!</h1>
                    
                    <div className="personal-message">
                        <p className="message-text">
                            היי <span className="client-name">{fullName || 'חדש'}</span> אני עוז הבן של אושר ובר, תודה שבחרתם מתנ'לה
                        </p>
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            className="btn btn-home" 
                            onClick={handleHomeClick}
                        >
                            <i className="fa-solid fa-home"></i>
                            דף הבית
                        </button>
                        
                        <button 
                            className="btn btn-login" 
                            onClick={handleLoginClick}
                        >
                            <i className="fa-solid fa-sign-in-alt"></i>
                            התחברות
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;
