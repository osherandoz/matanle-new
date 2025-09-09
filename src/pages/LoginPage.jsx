import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useEventCheck } from '../hooks/useEventCheck';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const { loginWithEmail, loginWithGoogle, loginWithFacebook, loading, isAuthenticated } = useAuth();
    const { hasEvent, loading: eventLoading } = useEventCheck();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated && !loading && !eventLoading) {
            // Check if user has an event
            if (hasEvent) {
                navigate('/dashboard');
            } else {
                navigate('/create-event');
            }
        }
    }, [isAuthenticated, loading, eventLoading, hasEvent, navigate]);

    // התחברות עם אימייל וסיסמה
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            await loginWithEmail(email, password);
            // Navigation will happen automatically via useEffect
        } catch (err) {
            setError(err.message);
        }
    };

    // התחברות עם גוגל
    const handleGoogleSignIn = async () => {
        setError(null);
        
        try {
            await loginWithGoogle();
            // Navigation will happen automatically via useEffect
        } catch (err) {
            setError(err.message);
        }
    };

    // התחברות עם פייסבוק
    const handleFacebookSignIn = async () => {
        setError(null);
        
        try {
            await loginWithFacebook();
            // Navigation will happen automatically via useEffect
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* שינוי 1: מבנה חדש לכותרת עם אייקון */}
                <div className="login-header">
                    <i className="fa-solid fa-gift logo-icon"></i>
                    <h2>התחבר למתנל'ה</h2>
                </div>

                <form onSubmit={handleLogin}>
                    {/* שינוי 2: מבנה חדש לשדות הקלט עבור "תווית צפה" */}
                    <div className="input-group">
                        <i className="fa-solid fa-user input-icon"></i>
                        <input
                            type="email" // שדה שם משתמש הוא בדרך כלל אימייל
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="email">שם משתמש (אימייל)</label>
                    </div>

                    <div className="input-group">
                        <i className="fa-solid fa-lock input-icon"></i>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">סיסמה</label>
                    </div>

                    {/* שינוי 3: הוספת קישור "שכחתי סיסמה" */}
                    <a href="/forgot-password" className="forgot-password">שכחתי סיסמה?</a>

                    <button type="submit" className="login-btn" disabled={loading || eventLoading}>
                        {loading || eventLoading ? 'מתחבר...' : 'התחברות'}
                    </button>
                    
                    {error && <p className="error-message">{error}</p>}

                    <div className="divider">
                    </div>

                    {/* שינוי 4: כפתורי התחברות חברתיים */}
                    <div className="social-login">
                        <button type="button" onClick={handleFacebookSignIn} className="social-icon facebook" aria-label="התחבר עם פייסבוק" disabled={loading || eventLoading}>
                            <i className="fa-brands fa-facebook-f"></i>
                        </button>
                        <button type="button" onClick={handleGoogleSignIn} className="social-icon google" aria-label="התחבר עם גוגל" disabled={loading || eventLoading}>
                            <i className="fa-brands fa-google"></i>
                        </button>
                    </div>
                      <div className="signup-prompt">
                        <span>?עוד לא נרשמת</span>
                        <a href="/signup" className="signup-link">הירשם כאן</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;