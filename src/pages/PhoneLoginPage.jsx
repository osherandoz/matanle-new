import React, { useState } from "react";
import { auth } from '../../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";

const PhoneLoginPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Initialize reCAPTCHA
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                    console.log('reCAPTCHA solved');
                }
            });
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            setupRecaptcha();
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+972${phoneNumber.replace(/^0/, '')}`;
            
            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
            setVerificationId(confirmationResult.verificationId);
            setShowVerification(true);
        } catch (error) {
            console.log("Send Code Error:", error.code, error.message);
            setError('שגיאה בשליחת קוד אימות. נסה שוב.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const credential = await window.confirmationResult.confirm(verificationCode);
            const user = credential.user;
            
            localStorage.setItem("userId", user.uid);
            console.log("התחברת בהצלחה:", user.uid);
            navigate("/");
        } catch (error) {
            console.log("Verify Code Error:", error.code, error.message);
            setError('קוד אימות שגוי. נסה שוב.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {!showVerification ? (
                    <>
                        <div className="form-header">
                            <div className="logo">מתנל'ה</div>
                            <h2>התחברות עם מספר טלפון</h2>
                            <p>הכנס את מספר הטלפון שלך לקבלת קוד אימות</p>
                        </div>

                        <form onSubmit={handleSendCode} className="login-form">
                            <div className="field-group">
                                <label htmlFor="phone">מספר טלפון</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="050-1234567"
                                    required
                                />
                            </div>

                            <div id="recaptcha-container"></div>

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'שולח...' : 'שלח קוד אימות'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="form-header">
                            <div className="logo">מתנל'ה</div>
                            <h2>אימות קוד</h2>
                            <p>הכנס את הקוד שנשלח ל-{phoneNumber}</p>
                        </div>

                        <form onSubmit={handleVerifyCode} className="login-form">
                            <div className="field-group">
                                <label htmlFor="code">קוד אימות</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="123456"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'מאמת...' : 'אמת קוד'}
                            </button>

                            <button 
                                type="button"
                                onClick={() => setShowVerification(false)}
                                className="back-btn"
                            >
                                חזור
                            </button>
                        </form>
                    </>
                )}
                
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default PhoneLoginPage; 