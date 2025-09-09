import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create basic profile if doesn't exist
            const basicProfile = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              createdAt: new Date(),
              signInMethod: 'unknown'
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), basicProfile);
            setUserProfile(basicProfile);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('שגיאה בטעינת פרופיל המשתמש');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login with email and password
  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: new Date(),
        lastLoginMethod: 'email'
      });

      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const registerWithEmail = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const { email, password, ...profileData } = userData;
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user profile to Firestore
      const userProfile = {
        ...profileData,
        email,
        uid: userCredential.user.uid,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        signInMethod: 'email',
        lastLoginMethod: 'email'
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
      return userCredential.user;
    } catch (err) {
      console.error('Registration error:', err);
      throw new Error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile
        const userProfile = {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          signInMethod: 'google'
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date(),
          lastLoginMethod: 'google'
        });
      }

      return user;
    } catch (err) {
      console.error('Google login error:', err);
      throw new Error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Login with Facebook
  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile
        const userProfile = {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          signInMethod: 'facebook'
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date(),
          lastLoginMethod: 'facebook'
        });
      }

      return user;
    } catch (err) {
      console.error('Facebook login error:', err);
      throw new Error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      setError(null);

      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date()
      });

      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Profile update error:', err);
      throw new Error('שגיאה בעדכון הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut(auth);
      
      // Clear local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('fullName');
      
    } catch (err) {
      console.error('Logout error:', err);
      throw new Error('שגיאה בהתנתקות');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    updateUserProfile,
    logout,
    isAuthenticated: !!user
  };
};

// Helper function to convert Firebase auth errors to Hebrew messages
const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'אימייל או סיסמה שגויים';
    case 'auth/invalid-email':
      return 'כתובת אימייל לא תקינה';
    case 'auth/email-already-in-use':
      return 'כתובת האימייל כבר קיימת במערכת';
    case 'auth/weak-password':
      return 'הסיסמה חלשה מדי';
    case 'auth/too-many-requests':
      return 'יותר מדי ניסיונות. נסה שוב מאוחר יותר';
    case 'auth/account-exists-with-different-credential':
      return 'חשבון כבר קיים עם אמצעי זיהוי אחר';
    case 'auth/popup-closed-by-user':
      return 'החלון נסגר על ידי המשתמש';
    case 'auth/popup-blocked':
      return 'החלון נחסם על ידי הדפדפן';
    case 'auth/cancelled-popup-request':
      return 'בקשת ההתחברות בוטלה';
    case 'auth/network-request-failed':
      return 'שגיאת רשת. בדוק את החיבור לאינטרנט';
    default:
      console.error('Unknown auth error:', error);
      return 'אירעה שגיאה לא צפויה. נסה שוב';
  }
};
