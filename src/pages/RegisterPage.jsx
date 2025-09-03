import React, { useState } from "react";
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './RegisterPage.css';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [relate, setRelate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        special: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Check password requirements
    const checkPasswordRequirements = (password) => {
        setPasswordRequirements({
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordRequirements(newPassword);
    };

    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(req => req);
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email,
                phone: user.phoneNumber || '',
                createdAt: new Date(),
                signInMethod: 'google'
            });

            localStorage.setItem("userId", user.uid);
            localStorage.setItem("fullName", user.displayName || '');
            console.log("Google sign in successful:", user.uid);
            navigate("/thank-you");
        } catch (err) {
            console.log("Google Sign In Error:", err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!isPasswordValid()) {
            setError('הסיסמה לא עומדת בדרישות המינימום');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                relate,
                email,
                phone,
                gender,
                createdAt: new Date(),
                signInMethod: 'email'
            });

            localStorage.setItem("userId", user.uid);
            localStorage.setItem("fullName", `${firstName} ${lastName}`);
            console.log("Registration successful:", user.uid);
            navigate("/thank-you");
        } catch (err) {
            console.log("Registration Error:", err.message);
            setError(err.message);      
        } finally {
            setIsLoading(false);
        }
    };


return (
    <div className="register-container">
        <div className="register-card">
            
            <div className="form-header">
                <i className="fa-solid fa-gift logo-icon"></i>
                <h2>יצירת חשבון חדש</h2>
                <p>מלא את הפרטים ונתחיל</p>
            </div>

            <form onSubmit={handleRegister} className="form-fields">
                <div className="field-row">
                    {/* --- שם פרטי --- */}
                    <div className="input-group">
                        <i className="fa-solid fa-user input-icon"></i>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <label htmlFor="firstName">שם פרטי *</label>
                    </div>

                    {/* --- שם משפחה --- */}
                    <div className="input-group">
                         <i className="fa-solid fa-users input-icon"></i>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <label htmlFor="lastName">שם משפחה *</label>
                    </div>
                </div>

                <div className="field-row">
                    {/* --- קשר משפחתי --- */}
                    <div className="field-group">
                        <label htmlFor="relate">קשר משפחתי</label>
                        <select
                            id="relate"
                            value={relate}
                            onChange={(e) => setRelate(e.target.value)}
                        >
                            <option value="">בחר קשר משפחתי</option>
                            <option value="אבא">אבא</option>
                            <option value="אמא">אמא</option>
                            <option value="סבא/סבתא">סבא/סבתא</option>
                            <option value="דוד/דודה">דוד/דודה</option>
                            <option value="חבר/ה">חבר/ה</option>
                            <option value="אחר">אחר</option>
                        </select>
                    </div>

                    {/* --- מין --- */}
                    <div className="field-group">
                        <label htmlFor="gender">מין</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">בחר מין</option>
                            <option value="זכר">זכר</option>
                            <option value="נקבה">נקבה</option>
                        </select>
                    </div>
                </div>

                {/* --- אימייל --- */}
                <div className="input-group">
                    <i className="fa-solid fa-envelope input-icon"></i>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">כתובת אימייל*</label>
                </div>

                {/* --- טלפון --- */}
<div className="input-group">
    <i className="fa-solid fa-phone input-icon"></i>
    <input
        type="tel"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
    />
    <label htmlFor="phone">מספר טלפון*</label>
</div>

                {/* --- סיסמה --- */}
                <div className="input-group">
                    <i className="fa-solid fa-lock input-icon"></i>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <label htmlFor="password">סיסמה *</label>
                </div>

                {/* דרישות סיסמה */}
                <div className="password-requirements">
                    <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                        <span><i className="fa-solid fa-check"></i></span> לפחות 6 תווים
                    </div>
                    <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                        <span><i className="fa-solid fa-check"></i></span> אות גדולה (A-Z)
                    </div>
                    <div className={`requirement ${passwordRequirements.lowercase ? 'met' : ''}`}>
                        <span><i className="fa-solid fa-check"></i></span> אות קטנה (a-z)
                    </div>
                    <div className={`requirement ${passwordRequirements.special ? 'met' : ''}`}>
                        <span><i className="fa-solid fa-check"></i></span> תו מיוחד (!@#)
                    </div>
                </div>
                
                <button type="submit" className="submit-btn" disabled={isLoading || !isPasswordValid()}>
                    {isLoading ? 'מעבד...' : 'השלם הרשמה'}
                </button>

                <div className="divider">
                    <span>או</span>
                </div>

                <button 
                    type="button" 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="google-btn"
                >
                    {isLoading ? 'מעבד...' : 'הירשם עם Google'}
                </button>

                <div className="form-footer">
                    <p>כבר יש לך חשבון? <a href="/login">התחבר כאן</a></p>
                </div>

                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    </div>
);
};

export default RegisterPage;