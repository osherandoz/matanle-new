import React, { useState, useEffect } from "react";
import { auth } from '../../firebase-config';
import { 
    signInWithEmailAndPassword, 
    sendSignInLinkToEmail, 
    isSignInWithEmailLink, 
    signInWithEmailLink, 
    GoogleAuthProvider, 
    FacebookAuthProvider, // הוספתי את פייסבוק
    signInWithPopup 
} from 'firebase/auth';
import './LoginPage.css'; // נוודא שה-CSS מיובא
import { useNavigate } from "react-router-dom";

// TODO: Choose new Typography, Check input color, check login button hover, implement google + facebook login

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // לוגיקה קיימת נשארת ללא שינוי...
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let savedEmail = window.localStorage.getItem('emailForSignIn');
            if (!savedEmail) {
                savedEmail = window.prompt('Please provide your email for confirmation');
            }
            if (savedEmail) {
                signInWithEmailLink(auth, savedEmail, window.location.href)
                    .then((result) => {
                        window.localStorage.removeItem('emailForSignIn');
                        localStorage.setItem("userId", result.user.uid);
                        navigate("/");
                    })
                    .catch((err) => setError('שגיאה בהתחברות עם קישור האימייל.'));
            }
        }
    }, [navigate]);
    
    // התחברות עם אימייל וסיסמה
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("userId", userCredential.user.uid);
            navigate("/");
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // התחברות עם גוגל
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        handlePopupSignIn(provider);
    };

    // התחברות עם פייסבוק (הלוגיקה זהה לגוגל)
    const handleFacebookSignIn = async () => {
        const provider = new FacebookAuthProvider();
        handlePopupSignIn(provider);
    };

    // פונקציית עזר להתחברות עם Popup
    const handlePopupSignIn = async (provider) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem("userId", result.user.uid);
            localStorage.setItem("fullName", result.user.displayName || '');
            navigate("/");
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // פונקציית עזר לטיפול בשגיאות
    const handleAuthError = (error) => {
        let errorMessage = "אירעה שגיאה. נסה שוב.";
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = "אימייל או סיסמה שגויים";
                break;
            case 'auth/invalid-email':
                errorMessage = "כתובת אימייל לא תקינה";
                break;
            case 'auth/too-many-requests':
                errorMessage = "יותר מדי ניסיונות. נסה שוב מאוחר יותר.";
                break;
            case 'auth/account-exists-with-different-credential':
                 errorMessage = "חשבון כבר קיים עם אמצעי זיהוי אחר.";
                 break;
            default:
                console.error("Firebase Auth Error:", error);
        }
        setError(errorMessage);
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

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'מתחבר...' : 'התחברות'}
                    </button>
                    
                    {error && <p className="error-message">{error}</p>}

                    <div className="divider">
                    </div>

                    {/* שינוי 4: כפתורי התחברות חברתיים */}
                    <div className="social-login">
                        <button type="button" onClick={handleFacebookSignIn} className="social-icon facebook" aria-label="התחבר עם פייסבוק" disabled={isLoading}>
                            <i className="fa-brands fa-facebook-f"></i>
                        </button>
                        <button type="button" onClick={handleGoogleSignIn} className="social-icon google" aria-label="התחבר עם גוגל" disabled={isLoading}>
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