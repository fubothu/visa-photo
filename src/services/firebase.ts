import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// TODO: Replace with your actual Firebase config
// Check if config is placeholder
export const isConfigured = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY";

// Helper to get config or empty string
const getEnv = (key: string) => import.meta.env[key] || "";

const firebaseConfig = {
    apiKey: getEnv("VITE_FIREBASE_API_KEY"),
    authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("VITE_FIREBASE_APP_ID")
};

const app = initializeApp(firebaseConfig);

// Initialize App Check if configured
if (isConfigured) {
    const recaptchaKey = getEnv("VITE_FIREBASE_RECAPTCHA_SITE_KEY");
    if (recaptchaKey && recaptchaKey !== "YOUR_RECAPTCHA_SITE_KEY") {
        try {
            initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(recaptchaKey),
                isTokenAutoRefreshEnabled: true
            });
            console.log('Firebase App Check initialized');
        } catch (e) {
            console.error('Failed to initialize App Check:', e);
        }
    }
}

export const db = getFirestore(app);

export const checkFeedbackEnabled = async (): Promise<boolean> => {
    try {
        const settingsRef = doc(db, 'settings', 'public');
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
            return snap.data().feedbackEnabled !== false; // Default to true if undefined
        }
        // If document doesn't exist, we assume enabled by default or disabled?
        // Let's assume enabled for now, or you can manually create the doc.
        return true;
    } catch (e) {
        console.warn('Failed to check feedback status', e);
        return true; // Fail open (allow feedback) or fail closed? Fail open for now.
    }
};
